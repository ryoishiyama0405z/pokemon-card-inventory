import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cardsAPI } from '../services/api';

interface CSVUploadProps {
  onUploadComplete?: (result: any) => void;
  onClose?: () => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onUploadComplete, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await cardsAPI.bulkUpload(file);
      setUploadResult(response.data);
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult({
        created_count: 0,
        errors: ['アップロードに失敗しました'],
        cards: []
      });
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: uploading
  });

  const downloadTemplate = () => {
    const template = `name,card_number,set_name,rarity,condition,language,description
ピカチュウ,025,基本セット,Common,NM,JP,でんきタイプのポケモン
リザードン,006,基本セット,Rare,LP,JP,ほのおタイプのポケモン`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'card_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">CSV一括アップロード</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {!uploadResult ? (
            <>
              {/* Template Download */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">CSVテンプレート</h3>
                <p className="text-blue-700 text-sm mb-3">
                  正しい形式でアップロードするために、テンプレートをダウンロードしてください。
                </p>
                <button
                  onClick={downloadTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                >
                  テンプレートをダウンロード
                </button>
              </div>

              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                  ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-lg font-medium">アップロード中...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      {isDragActive ? (
                        <p className="text-lg font-medium">ファイルをここにドロップしてください</p>
                      ) : (
                        <>
                          <p className="text-lg font-medium mb-2">
                            CSVファイルをドラッグ&ドロップ
                          </p>
                          <p className="text-gray-500">または</p>
                          <p className="text-blue-600 font-medium">
                            クリックしてファイルを選択
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Format Info */}
              <div className="mt-6 text-sm text-gray-600">
                <h4 className="font-medium mb-2">必須フィールド:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>name: カード名</li>
                  <li>set_name: セット名</li>
                </ul>
                <h4 className="font-medium mt-4 mb-2">オプションフィールド:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>card_number: カード番号</li>
                  <li>rarity: レアリティ</li>
                  <li>condition: 状態 (デフォルト: NM)</li>
                  <li>language: 言語 (デフォルト: JP)</li>
                  <li>description: 説明</li>
                </ul>
              </div>
            </>
          ) : (
            /* Upload Results */
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {uploadResult.created_count > 0 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <h3 className="text-lg font-semibold">
                  アップロード結果
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800">
                    <div className="font-semibold">成功</div>
                    <div className="text-2xl font-bold">{uploadResult.created_count}件</div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-800">
                    <div className="font-semibold">エラー</div>
                    <div className="text-2xl font-bold">{uploadResult.errors?.length || 0}件</div>
                  </div>
                </div>
              </div>

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">エラー詳細:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {uploadResult.errors.map((error: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-1 h-1 bg-red-600 rounded-full mt-2 mr-2"></span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setUploadResult(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  もう一度アップロード
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    完了
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;
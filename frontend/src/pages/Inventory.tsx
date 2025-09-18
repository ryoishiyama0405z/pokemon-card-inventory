import React, { useState, useEffect } from 'react';
import { Search, Filter, Upload, Download } from 'lucide-react';
import { inventoryAPI } from '../services/api';
import { Inventory } from '../types';
import CSVUpload from '../components/CSVUpload';

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'value'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll({ limit: 1000 });
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedInventory = inventory
    .filter(item =>
      item.card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.card.set_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.card.name;
          bValue = b.card.name;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'value':
          aValue = (a.current_market_price || a.purchase_price || 0) * a.quantity;
          bValue = (b.current_market_price || b.purchase_price || 0) * b.quantity;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

  const totalValue = inventory.reduce(
    (sum, item) => sum + (item.current_market_price || item.purchase_price || 0) * item.quantity,
    0
  );

  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const exportToCSV = () => {
    const headers = [
      'カード名',
      'セット名',
      'カード番号',
      'レアリティ',
      '状態',
      '在庫数',
      '購入価格',
      '現在価格',
      '総額',
      '保管場所',
      'メモ'
    ];

    const csvData = [
      headers.join(','),
      ...filteredAndSortedInventory.map(item => [
        `"${item.card.name}"`,
        `"${item.card.set_name}"`,
        `"${item.card.card_number || ''}"`,
        `"${item.card.rarity || ''}"`,
        `"${item.card.condition}"`,
        item.quantity,
        item.purchase_price || '',
        item.current_market_price || '',
        (item.current_market_price || item.purchase_price || 0) * item.quantity,
        `"${item.location || ''}"`,
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-12 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">在庫管理</h1>
          <p className="text-gray-600">
            総在庫: {totalQuantity}枚 | 推定総額: ¥{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCSVUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            CSV取込
          </button>
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV出力
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="カード名またはセット名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">名前順</option>
              <option value="quantity">在庫数順</option>
              <option value="value">価値順</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAndSortedInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カード
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    在庫数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    購入価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    現在価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    総額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    保管場所
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedInventory.map((item) => {
                  const currentPrice = item.current_market_price || item.purchase_price || 0;
                  const totalValue = currentPrice * item.quantity;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-10">
                            {item.card.image_url ? (
                              <img
                                className="h-12 w-10 object-cover rounded"
                                src={item.card.image_url}
                                alt={item.card.name}
                              />
                            ) : (
                              <div className="h-12 w-10 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.card.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.card.set_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.card.rarity} | {item.card.condition}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {item.quantity}枚
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.purchase_price ? `¥${item.purchase_price.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.current_market_price ? `¥${item.current_market_price.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ¥{totalValue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.location || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">在庫データがありません</p>
            <button
              onClick={() => setShowCSVUpload(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              CSV取込でデータを追加
            </button>
          </div>
        )}
      </div>

      {/* CSV Upload Modal */}
      {showCSVUpload && (
        <CSVUpload
          onUploadComplete={(result) => {
            console.log('Upload completed:', result);
            fetchInventory();
          }}
          onClose={() => setShowCSVUpload(false)}
        />
      )}
    </div>
  );
};

export default InventoryPage;
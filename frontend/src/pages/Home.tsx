import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Plus, DollarSign } from 'lucide-react';
import { cardsAPI, inventoryAPI } from '../services/api';

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalCards: 0,
    totalValue: 0,
    totalInventory: 0,
    recentCards: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cardsResponse, inventoryResponse] = await Promise.all([
          cardsAPI.getAll({ limit: 5 }),
          inventoryAPI.getAll({ limit: 100 })
        ]);

        const totalValue = inventoryResponse.data.reduce(
          (sum, item) => sum + (item.current_market_price || item.purchase_price || 0) * item.quantity,
          0
        );

        const totalQuantity = inventoryResponse.data.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setStats({
          totalCards: cardsResponse.data.length,
          totalValue,
          totalInventory: totalQuantity,
          recentCards: cardsResponse.data
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: '登録カード数',
      value: stats.totalCards,
      icon: Package,
      color: 'bg-blue-500',
      format: (value: number) => `${value}枚`
    },
    {
      title: '在庫数',
      value: stats.totalInventory,
      icon: TrendingUp,
      color: 'bg-green-500',
      format: (value: number) => `${value}枚`
    },
    {
      title: '推定総額',
      value: stats.totalValue,
      icon: DollarSign,
      color: 'bg-yellow-500',
      format: (value: number) => `¥${value.toLocaleString()}`
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="bg-gray-300 h-4 rounded mb-2 w-24"></div>
              <div className="bg-gray-300 h-8 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ダッシュボード
        </h1>
        <p className="text-gray-600">
          ポケモンカード在庫管理システムへようこそ
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.format(stat.value)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Cards */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            最近追加されたカード
          </h2>
        </div>
        <div className="p-6">
          {stats.recentCards.length > 0 ? (
            <div className="space-y-4">
              {stats.recentCards.map((card: any) => (
                <div key={card.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {card.image_url ? (
                      <img
                        src={card.image_url}
                        alt={card.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {card.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {card.set_name}
                    </p>
                    <div className="flex space-x-4 mt-1">
                      <span className="text-xs text-gray-400">
                        {card.rarity}
                      </span>
                      <span className="text-xs text-gray-400">
                        {card.condition}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">カードが登録されていません</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center mx-auto">
                <Plus className="w-4 h-4 mr-2" />
                最初のカードを追加
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left">
          <Plus className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900">新規カード追加</h3>
          <p className="text-sm text-gray-600 mt-1">
            新しいカードを登録
          </p>
        </button>
        <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left">
          <Package className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900">在庫管理</h3>
          <p className="text-sm text-gray-600 mt-1">
            在庫数の確認・更新
          </p>
        </button>
        <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left">
          <TrendingUp className="w-8 h-8 text-yellow-600 mb-3" />
          <h3 className="font-semibold text-gray-900">価格分析</h3>
          <p className="text-sm text-gray-600 mt-1">
            価格推移の確認
          </p>
        </button>
        <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left">
          <DollarSign className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900">CSV一括更新</h3>
          <p className="text-sm text-gray-600 mt-1">
            データの一括インポート
          </p>
        </button>
      </div>
    </div>
  );
};

export default Home;
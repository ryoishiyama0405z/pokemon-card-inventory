import React from 'react';
import { Card } from '../types';
import { Edit, Trash2, Eye } from 'lucide-react';

interface CardListProps {
  cards: Card[];
  onEdit?: (card: Card) => void;
  onDelete?: (card: Card) => void;
  onView?: (card: Card) => void;
  loading?: boolean;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="bg-gray-300 h-40 rounded mb-3"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 rounded mb-2 w-3/4"></div>
            <div className="bg-gray-300 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">カードが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          {/* Card Image */}
          <div className="aspect-w-3 aspect-h-4 bg-gray-100">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-card.png';
                }}
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">画像なし</span>
              </div>
            )}
          </div>

          {/* Card Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {card.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{card.set_name}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
              <span>{card.rarity}</span>
              <span>{card.condition}</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              {onView && (
                <button
                  onClick={() => onView(card)}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  詳細
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(card)}
                  className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  編集
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(card)}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  削除
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
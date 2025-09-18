import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PriceHistory } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  priceHistory: PriceHistory[];
  title?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceHistory, title = '価格推移' }) => {
  // データを日付順にソート
  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date_recorded).getTime() - new Date(b.date_recorded).getTime()
  );

  const data = {
    labels: sortedHistory.map(item =>
      new Date(item.date_recorded).toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric'
      })
    ),
    datasets: [
      {
        label: '価格 (円)',
        data: sortedHistory.map(item => item.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const item = sortedHistory[context.dataIndex];
            return [
              `価格: ¥${context.parsed.y.toLocaleString()}`,
              ...(item.source ? [`ソース: ${item.source}`] : []),
              ...(item.condition ? [`状態: ${item.condition}`] : []),
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '日付',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '価格 (円)',
        },
        ticks: {
          callback: function(value: any) {
            return '¥' + value.toLocaleString();
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  if (priceHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          価格履歴データがありません
        </div>
      </div>
    );
  }

  const currentPrice = sortedHistory[sortedHistory.length - 1]?.price;
  const previousPrice = sortedHistory[sortedHistory.length - 2]?.price;
  const priceChange = currentPrice && previousPrice ? currentPrice - previousPrice : 0;
  const priceChangePercent = currentPrice && previousPrice
    ? ((currentPrice - previousPrice) / previousPrice) * 100
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ¥{currentPrice?.toLocaleString()}
          </div>
          {priceChange !== 0 && (
            <div className={`text-sm ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange > 0 ? '+' : ''}¥{priceChange.toLocaleString()}
              ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
            </div>
          )}
        </div>
      </div>

      <div className="h-64">
        <Line data={data} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-500">最高価格</div>
          <div className="font-semibold">
            ¥{Math.max(...sortedHistory.map(h => h.price)).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">最低価格</div>
          <div className="font-semibold">
            ¥{Math.min(...sortedHistory.map(h => h.price)).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">平均価格</div>
          <div className="font-semibold">
            ¥{Math.round(sortedHistory.reduce((sum, h) => sum + h.price, 0) / sortedHistory.length).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
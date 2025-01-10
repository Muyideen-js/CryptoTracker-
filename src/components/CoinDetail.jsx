import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiArrowLeft } from 'react-icons/fi';
import Spinner from './Spinner';

const API_URL = 'https://cors-proxy.fringe.zone/https://api.coingecko.com/api/v3';

const TIME_PERIODS = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '1Y', value: 365 }
];

const CoinDetail = () => {
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchChartData = async (days) => {
    try {
      const response = await axios.get(`${API_URL}/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days
        }
      });

      const formattedData = response.data.prices.map(item => ({
        date: new Date(item[0]).toLocaleDateString(),
        price: item[1]
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const coinResponse = await axios.get(`${API_URL}/coins/${id}`);
        setCoinData(coinResponse.data);
        await fetchChartData(selectedPeriod);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  const handlePeriodChange = async (days) => {
    setSelectedPeriod(days);
    await fetchChartData(days);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="coin-detail">
      <div className="coin-detail-content">
        <div className="coin-detail-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FiArrowLeft /> Back
          </button>
          <div className="coin-detail-info">
            <img src={coinData.image.large} alt={coinData.name} />
            <h1>{coinData.name} ({coinData.symbol.toUpperCase()})</h1>
          </div>
        </div>

        
        <div className="coin-detail-price">
          <h2>${coinData.market_data.current_price.usd.toLocaleString()}</h2>
          <span className={coinData.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'}>
            {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        <div className="chart-container">
          <div className="chart-header">
            <h3>Price Chart</h3>
            <div className="time-period-buttons">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period.value}
                  onClick={() => handlePeriodChange(period.value)}
                  className={`time-button ${selectedPeriod === period.value ? 'active' : ''}`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={value => `$${value.toLocaleString()}`}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                labelStyle={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '8px'
                }}
                itemStyle={{
                  fontSize: '14px',
                  color: '#1e293b',
                  padding: '4px 0'
                }}
                formatter={value => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={label => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="coin-detail-stats">
          <div className="stat-card">
            <h4>Market Cap</h4>
            <p>${coinData.market_data.market_cap.usd.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h4>24h Volume</h4>
            <p>${coinData.market_data.total_volume.usd.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h4>Circulating Supply</h4>
            <p>{coinData.market_data.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail; 
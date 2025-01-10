import { useState, useEffect } from 'react';
import axios from 'axios';
import CoinCard from '../components/CoinCard';
import Spinner from '../components/Spinner';

const API_URL = 'https://cors-proxy.fringe.zone/https://api.coingecko.com/api/v3';

const Home = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 250,
              page: 1,
              sparkline: false,
            }
          }
        );
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Filter coins based on search term
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="page-title">Cryptocurrency Prices by Muyideen.Jsx</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search cryptocurrency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="coins-grid">
        {filteredCoins.length > 0 ? (
          filteredCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))
        ) : (
          <div className="no-results">No cryptocurrencies found</div>
        )}
      </div>
    </div>
  );
};

export default Home; 
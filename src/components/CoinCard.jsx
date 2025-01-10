import { useNavigate } from 'react-router-dom';

const CoinCard = ({ coin }) => {
  const navigate = useNavigate();

  return (
    <div className="coin-card" onClick={() => navigate(`/coin/${coin.id}`)}>
      <div className="coin-info">
        <img src={coin.image} alt={coin.name} />
        <div className="coin-name">
          <h3>{coin.name}</h3>
          <span>{coin.symbol.toUpperCase()}</span>
        </div>
      </div>
      
      <div className="coin-price">
        <h3>${coin.current_price.toLocaleString()}</h3>
        <span className={coin.price_change_24h > 0 ? 'positive' : 'negative'}>
          {coin.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
      
      <div className="coin-market">
        <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
        <p>Volume (24h): ${coin.total_volume.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CoinCard; 
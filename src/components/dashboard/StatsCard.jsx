import './StatsCard.css';

export default function StatsCard({ icon, title, value, subtitle, color = 'blue', trend }) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <p className="stats-card-value">{value}</p>
        {subtitle && <p className="stats-card-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`stats-card-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}

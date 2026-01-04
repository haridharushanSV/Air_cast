export default function ChannelCard({ channel, onPlay }) {
  return (
    <div className="card" onClick={() => onPlay(channel)}>
      {channel.logo ? (
        <img
          src={channel.logo}
          alt={channel.name}
          loading="lazy"
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <div className="logo-placeholder">TV</div>
      )}

      <div className="card-info">
        <h4>{channel.name}</h4>
        <span>{channel.category}</span>
      </div>
    </div>
  );
}

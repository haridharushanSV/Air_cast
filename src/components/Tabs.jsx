export default function Tabs({ tab, setTab }) {
  return (
    <div className="tabs">
      {["All", "Tamil"].map((t) => (
        <button
          key={t}
          className={tab === t ? "active" : ""}
          onClick={() => setTab(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

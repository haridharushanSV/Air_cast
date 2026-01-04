import { useEffect, useState } from "react";
import { fetchChannels } from "../api/iptvApi";
import ChannelCard from "../components/ChannelCard";
import Player from "../components/Player";
import Tabs from "../components/Tabs";
import Disclaimer from "../components/Disclaimer";
import logo from "../assets/logo.png";

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [current, setCurrent] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    fetchChannels()
      .then(setChannels)
      .finally(() => setLoading(false));
  }, []);

  // ✅ STRONG TAMIL DETECTION
  const isTamil = (c) => {
    const name = (c.name || "").toLowerCase();
    const lang = (c.language || "").toLowerCase();

    const tamilKeywords = [
      "tamil",
      "தமிழ்",
      "sun",
      "vijay",
      "kalaignar",
      "raj",
      "jaya",
      "polimer",
      "thanthi",
      "puthiyathalaimurai",
      "news18 tamil",
      "chutti",
      "sirippoli",
      "isaiaruvi",
      "murasu",
      "mega tv",
    ];

    return (
      lang === "tam" ||
      tamilKeywords.some((k) => name.includes(k))
    );
  };

  const filtered = channels.filter((c) => {
    if (tab === "Tamil" && !isTamil(c)) return false;
    return c.name.toLowerCase().includes(search.toLowerCase());
  });

  if (current) {
    return (
      <Player
        url={current.streamUrl}
        onBack={() => setCurrent(null)}
      />
    );
  }

  return (
    <>
      {showDisclaimer && (
        <Disclaimer onClose={() => setShowDisclaimer(false)} />
      )}

<header className="app-header">
      <img
        src={logo}
        className="app-logo"
        alt="Air Cast Logo"
      />
      <span className="app-title">Air Cast</span>
    </header>

      <input
        className="search"
        placeholder="Search channels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Tabs tab={tab} setTab={setTab} />

      {loading ? (
        <div className="loader">Loading channels…</div>
      ) : filtered.length === 0 ? (
        <div className="loader">No channels available</div>
      ) : (
        <div className="grid">
          {filtered.map((c) => (
            <ChannelCard
              key={c.id}
              channel={c}
              onPlay={setCurrent}
            />
          ))}
        </div>
      )}
    </>
  );
}

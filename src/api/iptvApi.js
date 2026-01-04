import axios from "axios";

const CHANNELS_URL = "https://iptv-org.github.io/api/channels.json";
const STREAMS_URL = "https://iptv-org.github.io/api/streams.json";
const LOGOS_URL = "https://iptv-org.github.io/api/logos.json";

export async function fetchChannels() {
  const [channelsRes, streamsRes, logosRes] = await Promise.all([
    axios.get(CHANNELS_URL),
    axios.get(STREAMS_URL),
    axios.get(LOGOS_URL),
  ]);

  // Map streams by channel ID
  const streamsMap = {};
  streamsRes.data.forEach((s) => {
    if (s.channel && s.url && !streamsMap[s.channel]) {
      streamsMap[s.channel] = s.url;
    }
  });

  // Map logos
  const logosMap = {};
  logosRes.data.forEach((l) => {
    if (l.channel && l.url) {
      logosMap[l.channel] = l.url;
    }
  });

  // Merge metadata + stream + logo
  return channelsRes.data
    .filter((c) => streamsMap[c.id]) // 🔥 ONLY STREAMED CHANNELS
    .map((c) => ({
      id: c.id,
      name: c.name || c.channel || "Unknown Channel",
      category: c.category || "General",
      language: c.languages?.[0] || "",
      streamUrl: streamsMap[c.id],
      logo: logosMap[c.id] || "",
    }));
}

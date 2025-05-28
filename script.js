
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video-player");
  const list = document.getElementById("channel-list");
  const search = document.getElementById("search");

  fetch("playlist.m3u")
    .then((res) => res.text())
    .then((text) => {
      const channels = parseM3U(text);
      renderChannels(channels);

      search.addEventListener("input", () => {
        const query = search.value.toLowerCase();
        const filtered = channels.filter((c) =>
          c.name.toLowerCase().includes(query)
        );
        renderChannels(filtered);
      });
    });

  function renderChannels(channels) {
    list.innerHTML = "";
    channels.forEach((channel) => {
      const div = document.createElement("div");
      div.className = "channel";
      div.textContent = channel.name;
      div.onclick = () => {
        video.src = channel.url;
        video.play();
      };
      list.appendChild(div);
    });
  }

  function parseM3U(data) {
    const lines = data.split("\n");
    const channels = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        const name = lines[i].split(",")[1];
        const url = lines[i + 1];
        channels.push({ name, url });
      }
    }
    return channels;
  }
});

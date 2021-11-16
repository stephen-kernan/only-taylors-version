import axios from "axios";

const conversionMap = {
  "786NsUYn4GGUf8AOt0SQhP": {
    taylorsVersionId: "6lzc0Al0zfZOIFsFvBS1ki",
    trackName: "State of Grace",
  },
  "1RvQQGwaPipiNgz8RXAKA8": {
    taylorsVersionId: "4OAuvHryIVv4kMDNSLuPt6",
    trackName: "Red",
  },
  "0XfOV7qY3834QpFVwOb6CC": {
    taylorsVersionId: "3S7HNKPakdwNEBFIVTL6dZ",
    trackName: "Treacherous",
  },
  "0ciHz919LVKoH4zgxyMPZ9": {
    taylorsVersionId: "6AtZLIzUINvExIUy4QhdjP",
    trackName: "I Knew You Were Trouble",
  },
  "1q3RiD1tIWUpGsNFADMlvl": {
    taylorsVersionId: "1IBhYEvvi02tDVByxIiTh4",
    trackName: "All Too Well",
  },
  "3bIxTsfeNMO7Nt2J3EUKrA": {
    taylorsVersionId: "3yII7UwgLF6K5zW3xad3MP",
    trackName: "22",
  },
  "31pEV5lPJi7btskZoUr2yu": {
    taylorsVersionId: "2r9CbjYgFhtAmcFv1cSquB",
    trackName: "I Almost Do",
  },
  "1OYARuagDrpgNNQ4loO1Cs": {
    taylorsVersionId: "5YqltLsjdqFtvqE7Nrysvs",
    trackName: "We Are Never Ever Getting Back Together",
  },
  "1x0J8LFX23d5h1zzuzZorc": {
    taylorsVersionId: "7eQj6r5PIdYKEIZjucBMcq",
    trackName: "Stay Stay Stay",
  },
  "7vvIpJZye5cRR6De1LKM0m": {
    taylorsVersionId: "0y6kdSRCVQhSsHSpWvTUm7",
    trackName: "The Last Time",
  },
  "5d2Kn9oAAh9S2EbyCo1i52": {
    taylorsVersionId: "7J4b3LVCIGO4CMBDFLPoP6",
    trackName: "Holy Ground",
  },
  "5QKhg4r4Ibt0LVTmWEXTEg": {
    taylorsVersionId: "73qMN9bXy7MSPwwGfH3wQr",
    trackName: "Sad Beautiful Tragic",
  },
  "2wtHlpYSgC7xEdD3DrSHNL": {
    taylorsVersionId: "4e5ayHsOLJNLTGfjau2mEw",
    trackName: "The Lucky One",
  },
  "7gdwoOmi258QJq0hmQ4hto": {
    taylorsVersionId: "7qEUFOVcxRI19tbT68JcYK",
    trackName: "Everything Has Changed",
  },
  "0vqI4ZIMuifeKeItGiWbPj": {
    taylorsVersionId: "7A2cNLRT0YJc1yjxHlKihs",
    trackName: "Starlight",
  },
  "48A0aShHlovDfTMucMrE66": {
    taylorsVersionId: "05GsNucq8Bngd9fnd4fRa0",
    trackName: "Begin Again",
  },
  "5AsmAjBSSQjRPWgAYIp8tm": {
    taylorsVersionId: "0NRHj8hDwwmSPaA41o379r",
    trackName: "The Moment I Knew",
  },
  "4qyalTRMRH5YuEntvvMvq0": {
    taylorsVersionId: "4pNApnaUWAL2J4KO2eqokq",
    trackName: "Come Back....Be Here",
  },
  "6cf6rLb8qcklvJv90W6HCW": {
    taylorsVersionId: "0DMVrlMUn01M0IcpDbwgu7",
    trackName: "Girl At Home",
  },
  "5G9AVKld9q7DCrmoY42raf": {
    taylorsVersionId: "5jAIouBES8LWMiriuNq170",
    trackName: "State of Grace (Acoustic)",
  },
  "0Nw8hv79MLJa1yjtsEgz08": {
    taylorsVersionId: "7nWui6jiMM2m9qFmET1Mtj",
    trackName: "Ronan	",
  },
  "6Eu31gddWw0gOGO506pJYA": {
    taylorsVersionId: "77sMIMlNaSURUAXq5coCxE",
    trackName: "Fearless",
  },
  "4t0OI7XrODjSkAu3bTPmWj": {
    taylorsVersionId: "2nqio0SfWg6gh2eCtfuMa5",
    trackName: "Fifteen",
  },
  "1vrd6UOGamcKNGnSHJQlSt": {
    taylorsVersionId: "6YvqWjhGD8mB5QXcbcUKtx",
    trackName: "Love Story",
  },
  "4WXzzCof26KJLTK5kK53dS": {
    taylorsVersionId: "550erGcdD9n6PnwxrvYqZT",
    trackName: "Hey Stephen",
  },
  "6wn61Fzx9XMxQmieLpoIhW": {
    taylorsVersionId: "5YL553x8sHderRBDlm3NM3",
    trackName: "White Horse",
  },
  "3GCL1PydwsLodcpv0Ll1ch": {
    taylorsVersionId: "1qrpoAMXodY6895hGKoUpA",
    trackName: "You Belong With Me",
  },
  "49mWEy5MgtNujgT7xU3emT": {
    taylorsVersionId: "7HC7R2D8WjXVcUHJyEGjRs",
    trackName: "Breathe",
  },
  "3rnI1UCyGJvUTVvT97VQr5": {
    taylorsVersionId: "0k0vFacOHNuArLWMiH60p7",
    trackName: "Tell Me Why",
  },
  "0HmCuN0Z3OX1Qrz43FLOPL": {
    taylorsVersionId: "6iiAfo4wTA2CVC3Uwx9uh8",
    trackName: "You're Not Sorry",
  },
  "5P4wWhUYWM0IaVYLuZxdar": {
    taylorsVersionId: "22bPsP2jCgbLUvh82U0Z3M",
    trackName: "The Way I Loved You",
  },
  "1zxrcAk6eiytfavqriMcKT": {
    taylorsVersionId: "1msEuwSBneBKpVCZQcFTsU",
    trackName: "Forever & Always",
  },
  "5YbZZ2gYfvW1UvHHF4pVaD": {
    taylorsVersionId: "6ON9UuIq49xXY9GPmHIYRp",
    trackName: "The Best Day",
  },
  "0RdcBnAXyH2YZZvcBVu2k6": {
    taylorsVersionId: "3ExweHKZF9B752DPQByRVT",
    trackName: "Change",
  },
  "08gavXombT6KR0af88i9tA": {
    taylorsVersionId: "2m3ObD945KvpE5y9A1eUWm",
    trackName: "Jump Then Fall",
  },
  "2IZ00ed83ygPIiacYScWUE": {
    taylorsVersionId: "0tQ9vBYpldCuikPsbgOVKA",
    trackName: "Untouchable",
  },
  "46HGgtwmmuEB8mvDCyjyAc": {
    taylorsVersionId: "01QdEx6kFr78ZejhQtWR5m",
    trackName: "Forever & Always (Piano Version)",
  },
  "4pl5zcqCv4vc3cB7M4MZ6f": {
    taylorsVersionId: "1n2wszmJyVkw6FHqyLnQsY",
    trackName: "Come In With The Rain",
  },
  "14Bljc3pOOG0xQX3wqhLN9": {
    taylorsVersionId: "51A8eKvvZz9uydvIZ7xRSV",
    trackName: "Superstar",
  },
  "0xvsgzM8AtBtRHZm5rav8A": {
    taylorsVersionId: "1cSFlSBdpT4F5vb1frQ231",
    trackName: "The Other Side Of The Door",
  },
  "1P5QpwOgXJuoVTm3CWbnLY": {
    taylorsVersionId: "2JoJrsEV15OzbijS47lids",
    trackName: "Today Was A Fairytale",
  },
};

const alternativeVersions = {
  "1q3RiD1tIWUpGsNFADMlvl?si=16816a7894944a55": {
    originalTrackName: "All Too Well",
    alernativeTrackName: "All Too Well (10 Minute Version)",
    alternativeTrackId: "",
  },
};

const requestHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const handleErrors = (err) => {
  if (err.response) {
    const { data, status, headers } = err.response;

    if (status === 429) {
      console.log("Rate limit exceeded");
    }

    console.log(`{ status: ${status}, data: ${data}, headers: ${headers}}`);
  }
};

export const fetchUserPlaylists = async (token) => {
  const [playlists, total] = await axios
    .get("https://api.spotify.com/v1/me/playlists", {
      headers: requestHeaders(token),
    })
    .then(({ data }) => {
      return [data.items, data.total];
    });

  while (playlists.length < total) {
    console.log("playlists length => ", playlists.length);
    await axios
      .get(
        `https://api.spotify.com/v1/me/playlists?offset=${
          playlists.length - 1
        }`,
        {
          headers: requestHeaders(token),
        }
      )
      .then(({ data }) => {
        playlists.push(...data.items);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }

  return playlists;
};

export const fetchTracksInPlaylist = async (token, url, total) => {
  const tracksInPlaylist = [];
  for (let i = 0; i <= total; i += 100) {
    await axios
      .get(`${url}?offset=${i}`, { headers: requestHeaders(token) })
      .then(({ data }) => {
        tracksInPlaylist.push(...data.items);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }
  return tracksInPlaylist;
};

export const deleteTracksInPlaylist = async (
  token,
  playlistId,
  total,
  trackIds
) => {
  if (!trackIds || !trackIds.length) {
    return;
  }
  for (let i = 0; i <= total; i += 100) {
    // i through i + 99 = 100 items. number 100 will be hit on next round
    const tracksToDelete = trackIds.slice(i, i + 99);
    await axios
      .delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: requestHeaders(token),
        data: { tracks: tracksToDelete },
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }
};

export const addTracksToPlaylist = async (
  token,
  playlistId,
  total,
  trackIds
) => {
  if (!trackIds || !trackIds.length) {
    return;
  }
  for (let i = 0; i <= total; i += 100) {
    // i through i + 99 = 100 items. number 100 will be hit on next round
    const tracksToAdd = trackIds.slice(i, i + 99);
    await axios
      .post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: tracksToAdd,
        },
        {
          headers: requestHeaders(token),
        }
      )
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        handleErrors(err);
      });
  }
};

export const findOldVersionsInPlaylist = async (tracksInPlaylist) => {
  const tracksToReplace = [];
  const tracksToAdd = [];

  await tracksInPlaylist.forEach((track) => {
    if (conversionMap[track.track.id]) {
      tracksToReplace.push({
        uri: `spotify:track:${track.track.id}`,
      });
      tracksToAdd.push(
        `spotify:track:${conversionMap[track.track.id].taylorsVersionId}`
      );
    }
  });

  return [tracksToReplace, tracksToAdd];
};

export const replaceWithTaylorsVersion = async (token) => {
  const playlists = await fetchUserPlaylists(token);
  let numberOfTracksUpdated = 0;
  let numberOfPlaylistsUpdated = 0;

  for (const playlist of playlists) {
    if (playlist.tracks.total === 0) {
      return;
    }

    const tracksInPlaylist = await fetchTracksInPlaylist(
      token,
      playlist.tracks.href,
      playlist.tracks.total
    );
    const [tracksToReplace, tracksToAdd] = await findOldVersionsInPlaylist(
      tracksInPlaylist
    );

    await deleteTracksInPlaylist(
      token,
      playlist.id,
      tracksToReplace.length,
      tracksToReplace
    );

    await addTracksToPlaylist(
      token,
      playlist.id,
      tracksToAdd.length,
      tracksToAdd
    );
    numberOfTracksUpdated = numberOfTracksUpdated + tracksToReplace.length;
    numberOfPlaylistsUpdated = numberOfPlaylistsUpdated + 1;
  }

  console.log("done and redirecting");
  let queryString = `${
    numberOfTracksUpdated ? `tracks=${numberOfTracksUpdated}&` : ""
  }${
    numberOfPlaylistsUpdated && numberOfTracksUpdated
      ? `playlists=${numberOfPlaylistsUpdated}`
      : ""
  }`;
  return `/thank-you?${queryString}`;
};

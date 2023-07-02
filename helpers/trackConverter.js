import axios from "axios";
import {conversionMap} from "./conversionMap";

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

export const fetchUserPlaylists = async (token, userID) => {
  const [playlists, total] = await axios
    .get(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: requestHeaders(token),
    })
    .then(({ data }) => {
      return [data.items, data.total];
    });

  while (playlists.length < total) {
    await axios
      .get(
        `https://api.spotify.com/v1/users/${userID}/playlists?offset=${
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

export const fetchCurrentUserID = async (token) => {
  return await axios
    .get("https://api.spotify.com/v1/me", {
      headers: requestHeaders(token)
    })
    .then(({data}) => {
      return data.id
    })
}

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
    return [];
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
    return [];
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

export const findOldVersionsInPlaylist = async (tracksInPlaylist = []) => {
  const tracksToReplace = [];
  const tracksToAdd = [];

  for (const track of tracksInPlaylist) {
    if (conversionMap[track?.track?.id]) {
      tracksToReplace.push({
        uri: `spotify:track:${track.track.id}`,
      });
      tracksToAdd.push(
        `spotify:track:${conversionMap[track.track.id].taylorsVersionId}`
      );
    }
  }

  return [tracksToReplace, tracksToAdd];
};


export const replaceTracksInPlaylist = async (token, playlist) => {
  let numberOfTracksUpdated = 0;

  const tracksInPlaylist = await fetchTracksInPlaylist(
    token,
    playlist.tracks.href,
    playlist.tracks.total
  );

  const [tracksToReplace, tracksToAdd] = await findOldVersionsInPlaylist(
    tracksInPlaylist
  );

  if (!tracksToReplace.length) {
    return [0, 0]
  }

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

  if (tracksToReplace.length) {
    numberOfTracksUpdated = numberOfTracksUpdated + tracksToReplace.length;
  }

  return [numberOfTracksUpdated, 1]
}

export const replaceWithTaylorsVersion = async (token) => {
  try {
    const userID = await fetchCurrentUserID(token)
    const playlists = await fetchUserPlaylists(token, userID);

    let numberOfTracksUpdated = 0;
    let numberOfPlaylistsUpdated = 0;

    const calls = []
    for (const playlist of playlists) {
      if (playlist.tracks.total === 0) {
        continue;
      }

      calls.push(replaceTracksInPlaylist(token, playlist))
    }

    const responses = await Promise.all(calls)
    responses.map(([tracks, playlists]) => {
      numberOfTracksUpdated += tracks
      numberOfPlaylistsUpdated += playlists
    })
    console.log(`Done => ${numberOfTracksUpdated} Tracks & ${numberOfPlaylistsUpdated} Playlists`)

    let queryString = `${
      numberOfTracksUpdated ? `tracks=${numberOfTracksUpdated}&` : ""
    }${
      numberOfPlaylistsUpdated && numberOfTracksUpdated
        ? `playlists=${numberOfPlaylistsUpdated}`
        : ""
    }`;
    return `/thank-you?${queryString}`;
  } catch (err) {
    console.log(err);
    return `/uh-oh`;
  }
};

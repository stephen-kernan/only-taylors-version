import axios from 'axios'
import { alternativeVersions, conversionMap } from './conversionMap'

export const requestHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
})

export const handleErrors = (err) => {
  if (err.response) {
    const { data, status, headers } = err.response

    if (status === 429) {
      console.warn('Rate limit exceeded')
      return
    }

    console.error(`{ status: ${status}, data: ${data}, headers: ${headers}}`)
  }
}

export const fetchUserPlaylists = async (token, userID) => {
  const [playlists, total] = await axios
    .get(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: requestHeaders(token)
    })
    .then(({ data }) => {
      return [data.items, data.total]
    })

  while (playlists.length < total) {
    await axios
      .get(
        `https://api.spotify.com/v1/users/${userID}/playlists?offset=${
          playlists.length - 1
        }`,
        {
          headers: requestHeaders(token)
        }
      )
      .then(({ data }) => {
        playlists.push(...data.items)
      })
      .catch((err) => {
        handleErrors(err)
      })
  }

  return playlists
}

export const fetchCurrentUserID = async (token) => {
  return await axios
    .get('https://api.spotify.com/v1/me', {
      headers: requestHeaders(token)
    })
    .then(({ data }) => {
      return data.id
    })
    .catch((err) => {
      handleErrors(err)
    })
}

export const fetchTracksInPlaylist = async (token, url, total) => {
  const tracksInPlaylist = []
  for (let i = 0; i <= total; i += 100) {
    await axios
      .get(`${url}?offset=${i}`, { headers: requestHeaders(token) })
      .then(({ data }) => {
        tracksInPlaylist.push(...data.items)
      })
      .catch((err) => {
        handleErrors(err)
      })
  }
  return tracksInPlaylist
}

export const addTracksToPlaylist = async (
  token,
  playlistId,
  total,
  trackIds
) => {
  if (!trackIds || !trackIds.length) {
    return
  }
  for (let i = 0; i <= total; i += 100) {
    // i through i + 99 = 100 items. number 100 will be hit on next round
    const tracksToAdd = trackIds.slice(i, i + 99)
    await axios
      .post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: tracksToAdd
        },
        {
          headers: requestHeaders(token)
        }
      )
      .then(({ data }) => {
        console.log(data)
      })
      .catch((err) => {
        handleErrors(err)
      })
  }
}

export const deleteTracksInPlaylist = async (
  token,
  playlistId,
  total,
  trackIds
) => {
  if (!trackIds || !trackIds.length) {
    return []
  }
  for (let i = 0; i <= total; i += 100) {
    // i through i + 99 = 100 items. number 100 will be hit on next round
    const tracksToDelete = trackIds.slice(i, i + 99)
    await axios
      .delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: requestHeaders(token),
        data: { tracks: tracksToDelete }
      })
      .then(({ data }) => {
        console.log(data)
      })
      .catch((err) => {
        handleErrors(err)
      })
  }
}

export const saveUserTracks = async (
  token,
  total,
  trackIds
) => {
  if (!trackIds || !trackIds.length) return []

  for (let i = 0; i <= total; i += 50) {
    // i through i + 99 = 100 items. number 100 will be hit on next round
    const tracksToAdd = trackIds.slice(i, i + 49)
    await axios
      .put(
        'https://api.spotify.com/v1/me/tracks',
        { ids: tracksToAdd },
        {
          headers: requestHeaders(token)
        }
      )
      .catch((err) => {
        handleErrors(err)
      })
  }
}

export const removeUserSavedTracks = async (token, total, trackIds) => {
  if (!trackIds || !trackIds.length) return []

  for (let i = 0; i <= total; i += 50) {
    // i through i + 99 = 100 items. number 100 will be hit on next round
    const tracksToDelete = trackIds.slice(i, i + 49)
    await axios
      .delete('https://api.spotify.com/v1/me/tracks', {
        headers: requestHeaders(token),
        data: { ids: tracksToDelete }
      })
      .catch((err) => {
        handleErrors(err)
      })
  }
}

export const saveUserAlbums = async (
  token,
  albumIds
) => {
  if (!albumIds || !albumIds.length) return []

  await axios
    .put(
      'https://api.spotify.com/v1/me/albums',
      { ids: albumIds },
      {
        headers: requestHeaders(token)
      }
    )
    .catch((err) => {
      handleErrors(err)
    })
}

export const removeUserSavedAlbums = async (
  token,
  albumIds
) => {
  if (!albumIds || !albumIds.length) return []

  await axios
    .delete('https://api.spotify.com/v1/me/albums', {
      headers: requestHeaders(token),
      data: { ids: albumIds }
    })
    .catch((err) => {
      handleErrors(err)
    })
}

export const findOldTracks = async (tracksInPlaylist = [], idsOnly = false, tenMinuteVersion) => {
  const tracksToReplace = []
  const tracksToAdd = []

  for (const track of tracksInPlaylist) {
    const oldTrackId = track?.track?.id
    const trackIsAllTooWell = oldTrackId === '1q3RiD1tIWUpGsNFADMlvl'
    if (conversionMap[oldTrackId]) {
      const newTrackId = (trackIsAllTooWell && tenMinuteVersion)
        ? alternativeVersions[oldTrackId].taylorsVersionId
        : conversionMap[oldTrackId].taylorsVersionId
      if (tenMinuteVersion && trackIsAllTooWell) {
        console.log('YES TAYLOR => ', newTrackId)
      }
      if (idsOnly) {
        tracksToReplace.push(oldTrackId)
        tracksToAdd.push(newTrackId)
      } else {
        tracksToReplace.push({
          uri: `spotify:track:${oldTrackId}`
        })
        tracksToAdd.push(
          `spotify:track:${newTrackId}`
        )
      }
    }
  }

  return [tracksToReplace, tracksToAdd]
}

export const findOldAlbums = async (albums = []) => {
  const albumsToReplace = []
  const albumsToAdd = []
  let totalTracksToReplace = 0

  for (const album of albums) {
    if (conversionMap[album?.album?.id]) {
      albumsToReplace.push(album.album.id)
      albumsToAdd.push(conversionMap[album.album.id].taylorsVersionId)
      totalTracksToReplace += album.album.total_tracks
    }
  }

  return [albumsToReplace, albumsToAdd, totalTracksToReplace]
}

export const replaceUserSavedTracks = async (token, tenMinuteVersion) => {
  const userSavedTracks = []
  await axios.get(
    'https://api.spotify.com/v1/me/tracks',
    { headers: requestHeaders(token) }
  ).then(({ data }) => {
    userSavedTracks.push(...data.items)
  })

  const [tracksToReplace, tracksToAdd] = await findOldTracks(
    userSavedTracks, true, tenMinuteVersion
  )

  await saveUserTracks(token, tracksToAdd.length, tracksToAdd)
  await removeUserSavedTracks(token, tracksToReplace.length, tracksToReplace)

  // Return zero since these technically aren't in a playlist
  return [tracksToReplace.length, 0]
}

export const replaceUserSavedAlbums = async (token) => {
  const userSavedAlbums = []
  await axios.get(
    'https://api.spotify.com/v1/me/albums',
    { headers: requestHeaders(token) }
  ).then(({ data }) => {
    userSavedAlbums.push(...data.items)
  })

  const [albumsToReplace, albumsToAdd, totalTracksReplaced] = await findOldAlbums(
    userSavedAlbums
  )

  await saveUserAlbums(token, albumsToAdd)
  await removeUserSavedAlbums(token, albumsToReplace)

  // Return zero since these technically aren't in a playlist
  return [totalTracksReplaced, 0]
}

export const replaceTracksInPlaylist = async (token, playlist, tenMinuteVersion) => {
  let numberOfTracksUpdated = 0

  const tracksInPlaylist = await fetchTracksInPlaylist(
    token,
    playlist.tracks.href,
    playlist.tracks.total
  )

  const [tracksToReplace, tracksToAdd] = await findOldTracks(
    tracksInPlaylist,
    false,
    tenMinuteVersion
  )

  if (!tracksToReplace.length) {
    return [0, 0]
  }

  await addTracksToPlaylist(
    token,
    playlist.id,
    tracksToAdd.length,
    tracksToAdd
  )

  await deleteTracksInPlaylist(
    token,
    playlist.id,
    tracksToReplace.length,
    tracksToReplace
  )

  if (tracksToReplace.length) {
    numberOfTracksUpdated = numberOfTracksUpdated + tracksToReplace.length
  }

  return [numberOfTracksUpdated, 1]
}

export const replaceWithTaylorsVersion = async (token, tenMinuteVersion) => {
  try {
    const userID = await fetchCurrentUserID(token)
    const playlists = await fetchUserPlaylists(token, userID)

    let numberOfTracksUpdated = 0
    let numberOfPlaylistsUpdated = 0

    // Call the replace function on every playlist async, stacking up the promises
    const apiCalls = []
    for (const playlist of playlists) {
      if (playlist.tracks.total === 0) {
        continue
      }

      apiCalls.push(replaceTracksInPlaylist(token, playlist, tenMinuteVersion))
    }

    // Wait until all API calls are returned so we have the number of tracks
    const responses = await Promise.all(
      [
        ...apiCalls,
        replaceUserSavedTracks(token, tenMinuteVersion),
        replaceUserSavedAlbums(token, tenMinuteVersion)
      ]
    )

    // Count up all the tracks/playlists
    responses.map(([tracks, playlists]) => {
      numberOfTracksUpdated += tracks
      numberOfPlaylistsUpdated += playlists
    })

    return `/thank-you?tracks=${numberOfTracksUpdated}&playlists=${numberOfPlaylistsUpdated}`
  } catch (err) {
    console.error(err)
    return '/uh-oh'
  }
}

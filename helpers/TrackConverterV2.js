import axios from 'axios'
import {
  addTracksToPlaylist,
  deleteTracksInPlaylist,
  fetchCurrentUserID, fetchTracksInPlaylist,
  fetchUserPlaylists, findOldAlbums, findOldTracks, removeUserSavedAlbums,
  replaceTracksInPlaylist,
  replaceUserSavedAlbums,
  replaceUserSavedTracks, saveUserAlbums,
  requestHeaders, saveUserTracks, removeUserSavedTracks, handleErrors
} from './trackConverter'
import { alternativeVersions, conversionMap } from './conversionMap'

export class TrackConverterV2 {
  token = ''

  tenMinuteVersion = false

  numberOfTracksUpdated = 0

  numberOfPlaylistsUpdated = 0

  constructor (token, tenMinuteVersion) {
    this.token = token
    this.tenMinuteVersion = tenMinuteVersion
  }

  async replaceWithTaylorsVersion () {
    try {
      const userID = await this.fetchCurrentUserID(this.token)
      const playlists = await this.fetchUserPlaylists(this.token, userID)

      // Call the replace function on every playlist async, stacking up the promises
      const apiCalls = []
      for (const playlist of playlists) {
        if (playlist.tracks.total === 0) {
          continue
        }

        apiCalls.push(this.replaceTracksInPlaylist(this.token, playlist, this.tenMinuteVersion))
      }

      // Wait until all API calls are returned so we have the number of tracks
      const responses = await Promise.all(
        [
          ...apiCalls,
          this.replaceUserSavedTracks(this.token, this.tenMinuteVersion),
          this.replaceUserSavedAlbums(this.token, this.tenMinuteVersion)
        ]
      )

      // Count up all the tracks/playlists
      responses.forEach(([tracks, playlists]) => {
        this.numberOfTracksUpdated += tracks
        this.numberOfPlaylistsUpdated += playlists
      })

      return `/thank-you?tracks=${this.numberOfTracksUpdated}&playlists=${this.numberOfPlaylistsUpdated}`
    } catch (err) {
      console.error(err)
      return '/uh-oh'
    }
  }

  async replaceTracksInPlaylist (playlist) {
    let numberOfTracksUpdated = 0

    const tracksInPlaylist = await this.fetchTracksInPlaylist(
      this.token,
      playlist.tracks.href,
      playlist.tracks.total
    )

    const [tracksToReplace, tracksToAdd] = await this.findOldTracks(
      tracksInPlaylist,
      false,
      this.tenMinuteVersion
    )

    if (!tracksToReplace.length) {
      return [0, 0]
    }

    await this.deleteTracksInPlaylist(
      this.token,
      playlist.id,
      tracksToReplace.length,
      tracksToReplace
    )

    await this.addTracksToPlaylist(
      this.token,
      playlist.id,
      tracksToAdd.length,
      tracksToAdd
    )

    if (tracksToReplace.length) {
      numberOfTracksUpdated += tracksToReplace.length
    }

    return [numberOfTracksUpdated, 1]
  }

  async replaceUserSavedAlbums () {
    const userSavedAlbums = []
    await axios.get(
      'https://api.spotify.com/v1/me/albums',
      { headers: this.requestHeaders(this.token) }
    ).then(({ data }) => {
      userSavedAlbums.push(...data.items)
    })

    const [albumsToReplace, albumsToAdd, totalTracksReplaced] = await this.findOldAlbums(
      userSavedAlbums
    )

    await this.saveUserAlbums(this.token, albumsToAdd)
    await this.removeUserSavedAlbums(this.token, albumsToReplace)

    // Return zero since these technically aren't in a playlist
    return [totalTracksReplaced, 0]
  }

  async replaceUserSavedTracks () {
    const userSavedTracks = []
    await axios.get(
      'https://api.spotify.com/v1/me/tracks',
      { headers: this.requestHeaders(this.token) }
    ).then(({ data }) => {
      userSavedTracks.push(...data.items)
    })

    const [tracksToReplace, tracksToAdd] = await this.findOldTracks(userSavedTracks, true)

    await this.saveUserTracks(this.token, tracksToAdd.length, tracksToAdd)
    await this.removeUserSavedTracks(this.token, tracksToReplace.length, tracksToReplace)

    // Return zero since these technically aren't in a playlist
    return [tracksToReplace.length, 0]
  }

  async findOldAlbums (albums = []) {
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

  async findOldTracks (tracksInPlaylist = [], idsOnly = false) {
    const tracksToReplace = []
    const tracksToAdd = []

    for (const track of tracksInPlaylist) {
      const oldTrackId = track?.track?.id
      const trackIsAllTooWell = oldTrackId === '1q3RiD1tIWUpGsNFADMlvl'
      if (conversionMap[oldTrackId]) {
        const newTrackId = (trackIsAllTooWell && this.tenMinuteVersion)
          ? alternativeVersions[oldTrackId].taylorsVersionId
          : conversionMap[oldTrackId].taylorsVersionId
        if (this.tenMinuteVersion && trackIsAllTooWell) {
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

  async removeUserSavedAlbums (albumIds) {
    if (!albumIds || !albumIds.length) return []

    await axios
      .delete('https://api.spotify.com/v1/me/albums', {
        headers: this.requestHeaders(this.token),
        data: { ids: albumIds }
      })
      .catch((err) => {
        this.handleErrors(err)
      })
  }

  async saveUserAlbums (albumIds) {
    if (!albumIds || !albumIds.length) return []

    await axios
      .put(
        'https://api.spotify.com/v1/me/albums',
        { ids: albumIds },
        {
          headers: this.requestHeaders(this.token)
        }
      )
      .catch((err) => {
        this.handleErrors(err)
      })
  }

  async removeUserSavedTracks (total, trackIds) {
    if (!trackIds || !trackIds.length) return []

    for (let i = 0; i <= total; i += 50) {
      // i through i + 99 = 100 items. number 100 will be hit on next round
      const tracksToDelete = trackIds.slice(i, i + 49)
      await axios
        .delete('https://api.spotify.com/v1/me/tracks', {
          headers: this.requestHeaders(this.token),
          data: { ids: tracksToDelete }
        })
        .catch((err) => {
          this.handleErrors(err)
        })
    }
  }

  async saveUserTracks (total, trackIds) {
    if (!trackIds || !trackIds.length) return []

    for (let i = 0; i <= total; i += 50) {
      // i through i + 99 = 100 items. number 100 will be hit on next round
      const tracksToAdd = trackIds.slice(i, i + 49)
      await axios
        .put(
          'https://api.spotify.com/v1/me/tracks',
          { ids: tracksToAdd },
          {
            headers: this.requestHeaders(this.token)
          }
        )
        .catch((err) => {
          this.handleErrors(err)
        })
    }
  }

  async deleteTracksInPlaylist (playlistId, total, trackIds) {
    if (!trackIds || !trackIds.length) {
      return []
    }
    for (let i = 0; i <= total; i += 100) {
      // i through i + 99 = 100 items. number 100 will be hit on next round
      const tracksToDelete = trackIds.slice(i, i + 99)
      await axios
        .delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: this.requestHeaders(this.token),
          data: { tracks: tracksToDelete }
        })
        .then(({ data }) => {
          console.log(data)
        })
        .catch((err) => {
          this.handleErrors(err)
        })
    }
  }

  async addTracksToPlaylist (playlistId, total, trackIds) {
    if (!trackIds || !trackIds.length) {
      return []
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
            headers: this.requestHeaders(this.token)
          }
        )
        .then(({ data }) => {
          console.log(data)
        })
        .catch((err) => {
          this.handleErrors(err)
        })
    }
  }

  async fetchTracksInPlaylist (url, total) {
    const tracksInPlaylist = []
    for (let i = 0; i <= total; i += 100) {
      await axios
        .get(`${url}?offset=${i}`, { headers: this.requestHeaders(this.token) })
        .then(({ data }) => {
          tracksInPlaylist.push(...data.items)
        })
        .catch((err) => {
          this.handleErrors(err)
        })
    }
    return tracksInPlaylist
  }

  async fetchCurrentUserID () {
    return await axios
      .get('https://api.spotify.com/v1/me', {
        headers: this.requestHeaders(this.token)
      })
      .then(({ data }) => data.id)
  }

  async fetchUserPlaylists (userID) {
    const [playlists, total] = await axios
      .get(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: this.requestHeaders(this.token)
      })
      .then(({ data }) => [data.items, data.total])

    while (playlists.length < total) {
      await axios
        .get(
          `https://api.spotify.com/v1/users/${userID}/playlists?offset=${
            playlists.length - 1
          }`,
          {
            headers: this.requestHeaders(this.token)
          }
        )
        .then(({ data }) => {
          playlists.push(...data.items)
        })
        .catch((err) => {
          this.handleErrors(err)
        })
    }

    return playlists
  }

  handleErrors (err) {
    if (err.response) {
      const { data, status, headers } = err.response

      if (status === 429) {
        console.warn('Rate limit exceeded')
        return
      }

      console.error(`{ status: ${status}, data: ${data}, headers: ${headers}}`)
    }
  }

  requestHeaders = () => ({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  })
}

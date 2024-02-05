import axios from "axios";
import { alternativeVersions, conversionMap } from "./conversionMap";
import { Mixpanel } from "./mixPanel";

export class TrackConverterV2 {
  token = "";

  tenMinuteVersion = false;

  numberOfTracksUpdated = 0;

  numberOfPlaylistsUpdated = 0;

  constructor(token, tenMinuteVersion) {
    this.token = token;
    this.tenMinuteVersion = tenMinuteVersion;
    this.Mixpanel = Mixpanel;
  }

  async replaceWithTaylorsVersion() {
    try {
      const userID = await this.fetchCurrentUserID();
      const playlists = await this.fetchUserPlaylists(userID);

      // Call the replace function on every playlist async, stacking up the promises
      const apiCalls = [];
      for (const playlist of playlists) {
        if (playlist.tracks.total === 0 || playlist.owner?.id !== userID) {
          continue;
        }

        // if it's less than 100 tracks, we can do it all at once
        if (playlist.tracks.total <= 100) {
          apiCalls.push(this.updateTracksInPlaylist(playlist, false));
        } else {
          apiCalls.push(
            this.replaceTracksInPlaylist(playlist, this.tenMinuteVersion)
          );
        }
      }

      // Wait until all API calls are returned, so we have the number of tracks
      const responses = await Promise.all([
        ...apiCalls,
        this.replaceUserSavedTracks(this.tenMinuteVersion),
        this.replaceUserSavedAlbums(this.tenMinuteVersion),
      ]);

      // Count up all the tracks/playlists
      responses.forEach(([tracks, playlists]) => {
        this.numberOfTracksUpdated += tracks;
        this.numberOfPlaylistsUpdated += playlists;
      });

      return `/thank-you?tracks=${this.numberOfTracksUpdated}&playlists=${this.numberOfPlaylistsUpdated}`;
    } catch (err) {
      this.handleErrors(err, { fn: "replaceWithTaylorsVersion" });
      return "/uh-oh";
    }
  }

  async replaceTracksInPlaylist(playlist) {
    let numberOfTracksUpdated = 0;

    const tracksInPlaylist = await this.fetchTracksInPlaylist(
      playlist.tracks.href,
      playlist.tracks.total
    );

    const [tracksToReplace, tracksToAdd] = await this.findOldTracks(
      tracksInPlaylist,
      false
    );

    if (!tracksToReplace.length) {
      return [0, 0];
    }

    const success = await this.addTracksToPlaylist(
      playlist.id,
      tracksToAdd.length,
      tracksToAdd
    );

    if (success) {
      await this.deleteTracksInPlaylist(
        playlist.id,
        tracksToReplace.length,
        tracksToReplace
      );

      if (tracksToReplace.length) {
        numberOfTracksUpdated += tracksToReplace.length;
      }
    }

    return [numberOfTracksUpdated, 1];
  }

  async replaceUserSavedAlbums() {
    const userSavedAlbums = [];
    await axios
      .get("https://api.spotify.com/v1/me/albums", {
        headers: this.requestHeaders(),
      })
      .then(({ data }) => {
        userSavedAlbums.push(...data.items);
      })
      .catch((err) => {
        this.handleErrors(err, { fn: "replaceUserSavedAlbums" });
      });

    const [albumsToReplace, albumsToAdd, totalTracksReplaced] =
      await this.findOldAlbums(userSavedAlbums);

    const success = await this.saveUserAlbums(albumsToAdd);
    if (success) {
      await this.removeUserSavedAlbums(albumsToReplace);
    }

    // Return zero since these technically aren't in a playlist
    return [totalTracksReplaced, 0];
  }

  async replaceUserSavedTracks() {
    const userSavedTracks = [];
    await axios
      .get("https://api.spotify.com/v1/me/tracks", {
        headers: this.requestHeaders(),
      })
      .then(({ data }) => {
        userSavedTracks.push(...data.items);
      })
      .catch((err) => {
        this.handleErrors(err, { fn: "replaceUserSavedTracks" });
      });

    const [tracksToReplace, tracksToAdd] = await this.findOldTracks(
      userSavedTracks,
      true
    );

    const success = await this.saveUserTracks(tracksToAdd.length, tracksToAdd);
    if (success) {
      await this.removeUserSavedTracks(tracksToReplace.length, tracksToReplace);
    }

    // Return zero since these technically aren't in a playlist
    return [tracksToReplace.length, 0];
  }

  async findOldAlbums(albums = []) {
    const albumsToReplace = [];
    const albumsToAdd = [];
    let totalTracksToReplace = 0;

    for (const album of albums) {
      if (conversionMap[album?.album?.id]) {
        albumsToReplace.push(album.album.id);
        albumsToAdd.push(conversionMap[album.album.id].taylorsVersionId);
        totalTracksToReplace += album.album.total_tracks;
      }
    }

    return [albumsToReplace, albumsToAdd, totalTracksToReplace];
  }

  async findOldTracks(tracksInPlaylist = [], idsOnly = false) {
    const tracksToReplace = [];
    const tracksToAdd = [];

    for (const track of tracksInPlaylist) {
      const oldTrackId = track?.track?.id;
      const trackIsAllTooWell = oldTrackId === "1q3RiD1tIWUpGsNFADMlvl";
      if (conversionMap[oldTrackId]) {
        const newTrackId =
          trackIsAllTooWell && this.tenMinuteVersion
            ? alternativeVersions[oldTrackId].taylorsVersionId
            : conversionMap[oldTrackId].taylorsVersionId;
        if (this.tenMinuteVersion && trackIsAllTooWell) {
          console.log("YES TAYLOR => ", newTrackId);
        }
        if (idsOnly) {
          tracksToReplace.push(oldTrackId);
          tracksToAdd.push(newTrackId);
        } else {
          tracksToReplace.push({
            uri: `spotify:track:${oldTrackId}`,
          });
          tracksToAdd.push(`spotify:track:${newTrackId}`);
        }
      }
    }

    return [tracksToReplace, tracksToAdd];
  }

  async removeUserSavedAlbums(albumIds) {
    if (!albumIds || !albumIds.length) return [];

    await axios
      .delete("https://api.spotify.com/v1/me/albums", {
        headers: this.requestHeaders(),
        data: { ids: albumIds },
      })
      .catch((err) => {
        this.handleErrors(err, { fn: "removeUserSavedAlbums" });
      });
  }

  async saveUserAlbums(albumIds) {
    if (!albumIds || !albumIds.length) return false;

    let noProblems = true;
    await axios
      .put(
        "https://api.spotify.com/v1/me/albums",
        { ids: albumIds },
        {
          headers: this.requestHeaders(),
        }
      )
      .catch((err) => {
        this.handleErrors(err, { fn: "saveUserAlbums" });
      });

    return noProblems;
  }

  async removeUserSavedTracks(total, trackIds) {
    if (!trackIds || !trackIds.length) return [];

    for (let i = 0; i <= total; i += 50) {
      // i through i + 99 = 100 items. number 100 will be hit on next round
      const tracksToDelete = trackIds.slice(i, i + 49);
      await axios
        .delete("https://api.spotify.com/v1/me/tracks", {
          headers: this.requestHeaders(),
          data: { ids: tracksToDelete },
        })
        .catch((err) => {
          this.handleErrors(err, { fn: "removeUserSavedTracks" });
        });
    }
  }

  async saveUserTracks(total, trackIds) {
    if (!trackIds || !trackIds.length) return false;

    let noProblems = true;
    for (let i = 0; i <= total; i += 50) {
      // i through i + 99 = 100 items. number 100 will be hit on next round
      const tracksToAdd = trackIds.slice(i, i + 49);
      await axios
        .put(
          "https://api.spotify.com/v1/me/tracks",
          { ids: tracksToAdd },
          {
            headers: this.requestHeaders(),
          }
        )
        .catch((err) => {
          noProblems = false;
          this.handleErrors(err, { fn: "saveUserTracks" });
        });
    }

    return noProblems;
  }

  async buildUpdatedPlaylistTrackIDs(tracksInPlaylist, idsOnly) {
    const updatedPlaylist = [];
    let tracksUpdated = 0;

    for (const track of tracksInPlaylist) {
      const oldTrackId = track?.track?.id;
      const trackIsAllTooWell = oldTrackId === "1q3RiD1tIWUpGsNFADMlvl";
      let newTrackId = "";

      if (conversionMap[oldTrackId]) {
        newTrackId =
          trackIsAllTooWell && this.tenMinuteVersion
            ? alternativeVersions[oldTrackId].taylorsVersionId
            : conversionMap[oldTrackId].taylorsVersionId;
        tracksUpdated += 1;
        if (this.tenMinuteVersion && trackIsAllTooWell) {
          console.log("YES TAYLOR => ", newTrackId);
        }
      } else {
        newTrackId = oldTrackId;
      }

      if (idsOnly) {
        updatedPlaylist.push(newTrackId);
      } else {
        updatedPlaylist.push(`spotify:track:${newTrackId}`);
      }
    }

    return [updatedPlaylist, tracksUpdated];
  }
  async updateTracksInPlaylist(playlist, idsOnly) {
    const tracksInPlaylist = await this.fetchTracksInPlaylist(
      playlist.tracks.href,
      playlist.tracks.total
    );
    const [uris, numTracksReplaced] = await this.buildUpdatedPlaylistTrackIDs(
      tracksInPlaylist,
      idsOnly
    );

    if (numTracksReplaced === 0) {
      return [0, 0];
    }

    await axios
      .put(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        { uris },
        {
          headers: this.requestHeaders(),
        }
      )
      .catch((err) => {
        this.handleErrors(err, { fn: "updateTracksInPlaylist" });
      });

    return [numTracksReplaced, 1];
  }

  async deleteTracksInPlaylist(playlistId, total, trackIds) {
    if (!trackIds || !trackIds.length) {
      return [];
    }
    for (let i = 0; i <= total; i += 100) {
      // i through i + 99 = 100 items. number 100 will be hit on next round
      const tracksToDelete = trackIds.slice(i, i + 99);
      await axios
        .delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: this.requestHeaders(),
          data: { tracks: tracksToDelete },
        })
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          this.handleErrors(err, { fn: "deleteTracksInPlaylist" });
        });
    }
  }

  async addTracksToPlaylist(playlistId, total, trackIds) {
    if (!trackIds || !trackIds.length) return false;

    let noProblems = true;
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
            headers: this.requestHeaders(),
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          noProblems = false;
          this.handleErrors(err, { fn: "addTracksToPlaylist" });
        });
    }

    return noProblems;
  }

  async fetchTracksInPlaylist(url, total) {
    const tracksInPlaylist = [];
    for (let i = 0; i <= total; i += 100) {
      await axios
        .get(`${url}?offset=${i}`, { headers: this.requestHeaders() })
        .then(({ data }) => {
          tracksInPlaylist.push(...data.items);
        })
        .catch((err) => {
          this.handleErrors(err, { fn: "fetchTracksInPlaylist" });
        });
    }
    return tracksInPlaylist;
  }

  async fetchCurrentUserID() {
    return await axios
      .get("https://api.spotify.com/v1/me", {
        headers: this.requestHeaders(),
      })
      .then(({ data }) => data.id)
      .catch((err) => {
        this.handleErrors(err, { fn: "fetchCurrentUserID" });
      });
  }

  async fetchUserPlaylists(userID) {
    const [playlists, total] = await axios
      .get(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: this.requestHeaders(),
      })
      .then(({ data }) => [data.items, data.total])
      .catch((err) => {
        this.handleErrors(err, { fn: "fetchUserPlaylists", spot: "1st catch" });
        return [[], 0];
      });

    while (playlists.length < total) {
      await axios
        .get(
          `https://api.spotify.com/v1/users/${userID}/playlists?offset=${
            playlists.length - 1
          }`,
          {
            headers: this.requestHeaders(),
          }
        )
        .then(({ data }) => {
          playlists.push(...data.items);
        })
        .catch((err) => {
          this.handleErrors(err, {
            fn: "fetchUserPlaylists",
            spot: "2nd catch",
          });
        });
    }

    return playlists;
  }

  handleErrors(e, props = {}) {
    const message = e?.message ?? "";
    if (e.response) {
      const { data, status, headers } = e.response;

      if (status === 429) {
        console.warn("Rate limit exceeded");
        this.Mixpanel.track("limitExceeded");
        return;
      }

      console.error(`{ status: ${status}, data: ${data}, headers: ${headers}}`);
      this.Mixpanel.track("error", {
        status,
        data,
        headers,
        message,
        ...props,
      });
    } else {
      this.Mixpanel.track("error", { e, message, ...props });
    }
  }

  requestHeaders = () => ({
    Authorization: `Bearer ${this.token}`,
    "Content-Type": "application/json",
  });
}

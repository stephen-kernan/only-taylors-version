import {
    addTracksToPlaylist,
    deleteTracksInPlaylist,
    fetchCurrentUserID, fetchTracksInPlaylist,
    fetchUserPlaylists, findOldTracks,
    replaceTracksInPlaylist,
    replaceUserSavedAlbums,
    replaceUserSavedTracks
} from "./trackConverter";

export class TrackConverterV2 {
    token = ""
    tenMinuteVersion = false
    numberOfTracksUpdated = 0
    numberOfPlaylistsUpdated = 0
    constructor(token, tenMinuteVersion) {
        this.token = token
        this.tenMinuteVersion = tenMinuteVersion
    }

    async replaceWithTaylorsVersion() {
        try {
            const userID = await fetchCurrentUserID(this.token)
            const playlists = await fetchUserPlaylists(this.token, userID);

            // Call the replace function on every playlist async, stacking up the promises
            const apiCalls = []
            for (const playlist of playlists) {
                if (playlist.tracks.total === 0) {
                    continue;
                }

                apiCalls.push(replaceTracksInPlaylist(this.token, playlist, this.tenMinuteVersion))
            }

            // Wait until all API calls are returned so we have the number of tracks
            const responses = await Promise.all(
                [
                    ...apiCalls,
                    replaceUserSavedTracks(this.token, this.tenMinuteVersion),
                    replaceUserSavedAlbums(this.token, this.tenMinuteVersion)
                ]
            )

            // Count up all the tracks/playlists
            responses.map(([tracks, playlists]) => {
                this.numberOfTracksUpdated += tracks
                this.numberOfPlaylistsUpdated += playlists
            })

            return `/thank-you?tracks=${this.numberOfTracksUpdated}&playlists=${this.numberOfPlaylistsUpdated}`;
        } catch (err) {
            console.error(err);
            return `/uh-oh`;
        }
    };
    async replaceTracksInPlaylist(playlist) {
        let numberOfTracksUpdated = 0;

        const tracksInPlaylist = await fetchTracksInPlaylist(
            this.token,
            playlist.tracks.href,
            playlist.tracks.total
        );

        const [tracksToReplace, tracksToAdd] = await findOldTracks(
            tracksInPlaylist,
            false,
            this.tenMinuteVersion
        );

        if (!tracksToReplace.length) {
            return [0, 0]
        }

        await deleteTracksInPlaylist(
            this.token,
            playlist.id,
            tracksToReplace.length,
            tracksToReplace
        );

        await addTracksToPlaylist(
            this.token,
            playlist.id,
            tracksToAdd.length,
            tracksToAdd
        );

        if (tracksToReplace.length) {
            numberOfTracksUpdated = numberOfTracksUpdated + tracksToReplace.length;
        }

        return [numberOfTracksUpdated, 1]
    }


}


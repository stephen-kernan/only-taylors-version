import React from 'react'
import { TrackConverterV2 } from "../../helpers/TrackConverterV2";
import * as originalFunctions from "../../helpers/trackConverter"

describe('TrackConverterV2',  () => {
    describe('replaceWithTaylorsVersion()', () => {
        jest.spyOn(originalFunctions, 'fetchCurrentUserID').mockReturnValue("example")
        jest.spyOn(originalFunctions, 'fetchUserPlaylists').mockReturnValue([])
        jest.spyOn(originalFunctions, 'replaceTracksInPlaylist').mockReturnValue([0,0])
        const replaceSavedAlbumSpy = jest.spyOn(originalFunctions, 'replaceUserSavedAlbums').mockReturnValue([0,0])
        jest.spyOn(originalFunctions, 'replaceUserSavedTracks').mockReturnValue([0,0])


        it('Returns URL with tracks and playlist filled out', async () => {
            replaceSavedAlbumSpy.mockReturnValue([2,10])
            const converter = new TrackConverterV2('', false)

            const response = await converter.replaceWithTaylorsVersion()
            const expected =  `/thank-you?tracks=2&playlists=10`
            expect(response).toBe(expected)
        })

        it('Returns uh oh if fails', async () => {
            replaceSavedAlbumSpy.mockImplementation(() => {
                throw new Error()
            })
            const converter = new TrackConverterV2('', false)

            const response = await converter.replaceWithTaylorsVersion()
            const expected =  `/uh-oh`
            expect(response).toBe(expected)
        })
    })
})

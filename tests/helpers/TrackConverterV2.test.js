import React from 'react'
import axios from 'axios'
import { TrackConverterV2 } from '../../helpers/TrackConverterV2'

describe('TrackConverterV2', () => {
  describe('replaceWithTaylorsVersion()', () => {
    const converter = new TrackConverterV2('', false)
    converter.fetchCurrentUserID = () => ('example')
    converter.fetchUserPlaylists = () => ([])
    converter.replaceTracksInPlaylist = () => ([0, 0])
    converter.replaceUserSavedAlbums = () => ([0, 0])
    converter.replaceUserSavedTracks = () => ([0, 0])

    it('Returns URL with tracks and playlist filled out', async () => {
      converter.replaceUserSavedAlbums = () => ([2, 10])

      const response = await converter.replaceWithTaylorsVersion()
      const expected = '/thank-you?tracks=2&playlists=10'
      expect(response).toBe(expected)
    })

    it('If fails returns uh oh', async () => {
      converter.replaceUserSavedAlbums = () => {
        throw new Error()
      }

      const response = await converter.replaceWithTaylorsVersion()
      const expected = '/uh-oh'
      expect(response).toBe(expected)
    })
  })

  describe('replaceTracksInPlaylist()', () => {
    const converter = new TrackConverterV2('', false)
    converter.fetchTracksInPlaylist = () => ([])
    converter.deleteTracksInPlaylist = () => {}
    converter.addTracksToPlaylist = () => {}
    converter.findOldTracks = () => ([[], []])

    it('If tracks replaced, returns number of tracks and playlists updated', async () => {
      converter.findOldTracks = () => ([[76, 66], [12]])

      const response = await converter.replaceTracksInPlaylist({ tracks: { href: 0, total: 0 } })
      const expected = [2, 1]
      expect(response).toEqual(expected)
    })

    it('If not tracks to replace, returns 0 and 0', async () => {
      const converter = new TrackConverterV2('', false)
      converter.findOldTracks = () => ([[], []])

      const response = await converter.replaceTracksInPlaylist({ tracks: { href: 0, total: 0 } })
      const expected = [0, 0]
      expect(response).toEqual(expected)
    })
  })

  describe('replaceUserSavedTracks()', () => {
    const converter = new TrackConverterV2('', false)
    beforeAll(() => {
      converter.removeUserSavedTracks = () => {}
      converter.saveUserTracks = () => {}
      converter.findOldTracks = () => ([[], []])
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: { items: [] } }))
      jest.spyOn(axios, 'put').mockReturnValue()
      jest.spyOn(axios, 'delete').mockReturnValue()
    })

    it('Returns number of tracks and playlists updated', async () => {
      converter.findOldTracks = () => ([[2, 22], []])

      const response = await converter.replaceUserSavedTracks({ tracks: { href: 0, total: 0 } })
      const expected = [2, 0]
      expect(response).toEqual(expected)
    })
  })

  describe('replaceUserSavedAlbums()', () => {
    beforeAll(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: { items: [] } }))
    })

    it('Returns number of tracks and playlists updated', async () => {
      const converter = new TrackConverterV2('', false)
      converter.findOldAlbums = () => ([[2, 22], [87], 5])
      converter.removeUserSavedAlbums = () => {}
      converter.saveUserAlbums = () => {}

      const response = await converter.replaceUserSavedAlbums()
      const expected = [5, 0]
      expect(response).toEqual(expected)
    })
  })

  describe('findOldAlbums()', () => {
    it('Returns albumsToReplace, albumsToAdd, totalTracksToReplace', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.findOldAlbums([{ album: { id: '1OYARuagDrpgNNQ4loO1Cs', total_tracks: 33 } }])
      const expected = [['1OYARuagDrpgNNQ4loO1Cs'], ['5YqltLsjdqFtvqE7Nrysvs'], 33]
      expect(response).toEqual(expected)
    })
  })

  describe('findOldTracks()', () => {
    it('Returns tracksToReplace and tracksToAdd', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.findOldTracks([{ track: { id: '1OYARuagDrpgNNQ4loO1Cs' } }])
      const expected = [[{
        uri: 'spotify:track:1OYARuagDrpgNNQ4loO1Cs'
      }], ['spotify:track:5YqltLsjdqFtvqE7Nrysvs']]
      expect(response).toEqual(expected)
    })
  })

  describe('saveUserAlbums()', () => {
    it('Calls axios.put', async () => {
      const putSpy = jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve('test'))
      const converter = new TrackConverterV2('', false)

      await converter.saveUserAlbums([2])
      expect(putSpy).toBeCalled()
    })
    it('If not albumIds or if not albumIds.length return nothing', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.saveUserAlbums([])
      expect(response).toEqual([])
    })
  })

  describe('removeUserSavedAlbums()', () => {
    it('Calls axios.delete', async () => {
      const deleteSpy = jest.spyOn(axios, 'delete').mockImplementation(() => Promise.resolve('test'))
      const converter = new TrackConverterV2('', false)

      await converter.removeUserSavedAlbums([2])
      expect(deleteSpy).toBeCalled()
    })
    it('If not albumIds or if not albumIds.length return nothing', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.removeUserSavedAlbums([])
      expect(response).toEqual([])
    })
  })

  describe('removeUserSavedTracks()', () => {
    it('Calls axios.delete', async () => {
      const deleteSpy = jest.spyOn(axios, 'delete').mockImplementation(() => Promise.resolve('test'))
      const converter = new TrackConverterV2('', false)

      await converter.removeUserSavedTracks(88, [65741])
      expect(deleteSpy).toBeCalled()
    })
    it('If not albumIds or if not albumIds.length return nothing', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.removeUserSavedTracks(88, [])
      expect(response).toEqual([])
    })
  })

  describe('saveUserTracks()', () => {
    it('Calls axios.put', async () => {
      const putSpy = jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve('test'))
      const converter = new TrackConverterV2('', false)

      await converter.saveUserTracks(2, [22])
      expect(putSpy).toBeCalled()
    })
    it('If not albumIds or if not albumIds.length return nothing', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.saveUserTracks(897, [])
      expect(response).toEqual([])
    })
  })

  describe('deleteTracksInPlaylist()', () => {
    it('Calls axios.delete', async () => {
      const deleteSpy = jest.spyOn(axios, 'delete').mockImplementation(() => Promise.resolve('test'))
      const converter = new TrackConverterV2('', false)

      await converter.deleteTracksInPlaylist('reindeerMan', 88, [65741])
      expect(deleteSpy).toBeCalled()
    })
    it('If not albumIds or if not albumIds.length return nothing', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.deleteTracksInPlaylist('reindeerMan', 88, [])
      expect(response).toEqual([])
    })
  })

  describe('addTracksToPlaylist()', () => {
    const postSpy = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve('test'))
    it('Calls axios.post', async () => {
      const converter = new TrackConverterV2('', false)

      await converter.addTracksToPlaylist('reindeerMan', 88, [65741])
      expect(postSpy).toBeCalled()
    })
    it('If not albumIds or if not albumIds.length return nothing', async () => {
      const converter = new TrackConverterV2('', false)

      const response = await converter.addTracksToPlaylist('reindeerMan', 88, [])
      expect(response).toEqual([])
    })
  })

  describe('fetchTracksInPlaylist()', () => {
    const getSpy = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve('test'))
    it('Calls axios.get', async () => {
      const converter = new TrackConverterV2('', false)

      await converter.fetchTracksInPlaylist('reindeerMan', 88)
      expect(getSpy).toBeCalled()
    })
  })

  describe('fetchCurrentUserID()', () => {
    beforeAll(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: { id: 5 } }))
    })

    it('returns userID', async () => {
      const converter = new TrackConverterV2('', false)
      expect(await converter.fetchCurrentUserID()).toEqual(5)
    })
  })

  describe('fetchUserPlaylists()', () => {
    beforeAll(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: { items: ['playlist1', 'playlist2'], total: 4 } }))
    })

    it('Calls axios.get', async () => {
      const converter = new TrackConverterV2('', false)
      const expectedValue = ['playlist1', 'playlist2', 'playlist1', 'playlist2']
      expect(await converter.fetchUserPlaylists('reindeerMan')).toEqual(expectedValue)
    })
  })
})

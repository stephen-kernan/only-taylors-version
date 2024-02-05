import axios from "axios";

const HEADERS = {
  Authorization: "Bearer BQB0aGBroC2wIM3FS924DxhN0s1k9aQ3H911OxtDx4DHIoZnmxy63ukX8b7lqe8wdyJ19q8kNyxv0iwHk0mb-TC2L2XfPWXj6LU1tbS-1RRPyowSK1CSTRj3skyKXdc0m-Ogt0QQGZQI40gWDXiwl6VIZynUxPaKJcEvZP4zCBQrO8tnOLkyjAWCrQsrs9NeAmWhkL-f0Fjo-9-l2O4muE95jegE4ZrHFqE0WjI4FizlaK8LjMk1c3Psw4J4-saIIBRDoSNThrky1tI"
}

const fetchSongs = async () => {
  let albumsResponse = {}
  try {
    albumsResponse = await axios.get(
      "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/albums",
      {
        headers: HEADERS
      }
    )
  } catch (e) {
    console.error(`Error on first request: ${HEADERS}`)
  }
  const { items: albums } = albumsResponse.data

  let taylorsVersionID = ''

  for (const album of albums) {
    if (album.name === "1989 (Taylor's Version)") {
      taylorsVersionID = album.id
    }
  }

  let tracksResponse = {}
  try {
    tracksResponse = await axios.get(
      `https://api.spotify.com/v1/albums/${taylorsVersionID}`,
      { headers: HEADERS }
    )
  } catch (e) {
    console.error("Failed on second request")
  }

  const { items: trackList } = tracksResponse.data.tracks
  let trackMap = {}
  for (const track of trackList) {
    trackMap[track.name] = track.id
  }

  console.log(trackMap)
}

fetchSongs()


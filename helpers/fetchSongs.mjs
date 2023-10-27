import axios from "axios";

const HEADERS = {
  Authorization: "Bearer BQB0aGBroC2wIM3FS924DxhN0s1k9aQ3H911OxtDx4DHIoZnmxy63ukX8b7lqe8wdyJ19q8kNyxv0iwHk0mb-TC2L2XfPWXj6LU1tbS-1RRPyowSK1CSTRj3skyKXdc0m-Ogt0QQGZQI40gWDXiwl6VIZynUxPaKJcEvZP4zCBQrO8tnOLkyjAWCrQsrs9NeAmWhkL-f0Fjo-9-l2O4muE95jegE4ZrHFqE0WjI4FizlaK8LjMk1c3Psw4J4-saIIBRDoSNThrky1tI"
}

const fetchSongs = async () => {
  const albumsResponse = await axios.get(
    "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/albums",
    {
      headers: HEADERS
    }
  )
  const { items: albums } = albumsResponse.data

  let taylorsVersionID = ''

  for (const album in albums) {
    if (album.name === "1989") {
      taylorsVersionID = album.id
    }
  }

  const tracksResponse = await axios.get(
    `https://api.spotify.com/v1/albums/${taylorsVersionID}`
  )
  const { items: tracks } = tracksResponse.data

  let trackMap = {}
  for (const track of tracks) {
    trackMap[track.name] = track.id
  }

  console.log(trackMap)
}

fetchSongs()


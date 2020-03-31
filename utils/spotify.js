/* eslint-disable no-console */
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config.json');
const youtube = require('./yt_music');
// Init Spotify Api with Credentials from config
const spotifyApi = new SpotifyWebApi({
  clientId: config.sp_id,
  clientSecret: config.sp_secret,
});
// Get Dev Token and Set It
const auth = async () => {
  const TOKEN = await spotifyApi.clientCredentialsGrant();
  return spotifyApi.setAccessToken(TOKEN.body.access_token);
};
// Extract ID from Spotify URL
const getID = (url) => {
  const URL = url.substring(url.search(/(album).|(track).|(playlist)./g), url.length);
  return URL.substring(URL.search('/') + 1, URL.length);
};
// Handle single track play
const handleTrack = async (client, message, ID) => {
  const data = await spotifyApi.getTrack(ID).catch((err) => console.log(err));
  const TRACKDATA = {
    name: data.body.name,
    artists: [],
    url: data.body.external_urls.spotify,
    cover: data.body.album.images[0].url,
  };
  data.body.artists.map((artist) => TRACKDATA.artists.push(artist.name));
  const query = `${TRACKDATA.name} ${TRACKDATA.artists.join(', ')}`;
  youtube.sr(client, message, query, TRACKDATA);
};
// Handle album parsing and playing
const handleAlbum = async (client, message, ID) => {
  const data = await spotifyApi.getAlbum(ID)
    .catch((err) => console.log(err));
  data.body.tracks.items.map((e) => handleTrack(client, message, e.id));
  message.channel.send(`Added ${data.body.tracks.total} from ${data.body.name} - ${data.body.label} album`)
    .then((e) => setTimeout(() => e.delete(), 2000));
};
// Handle playlist parsing and playing
const handlePlaylist = async (client, message, ID) => {
  const data = await spotifyApi.getPlaylist(ID, { pageSize: 200, limit: 200 })
    .catch((err) => console.log(err));
  data.body.tracks.items.map((e) => handleTrack(client, message, e.track.id));
  message.channel.send(`Added ${data.body.tracks.total} from ${data.body.name} - ${data.body.owner.display_name} playlist`)
    .then((e) => setTimeout(() => e.delete(), 2000));
};
// Main function
const play = async (client, message) => {
  await auth();
  const URL = message.content;
  const ID = getID(URL);
  if (URL.search('album') > 1) handleAlbum(client, message, ID);
  if (URL.search('track') > 1) handleTrack(client, message, ID);
  if (URL.search('playlist') > 1) handlePlaylist(client, message, ID);
};
module.exports = { play };

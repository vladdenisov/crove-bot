/* eslint-disable no-console */
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config.json');
const youtube = require('./yt_music');

const spotifyApi = new SpotifyWebApi({
  clientId: config.sp_id,
  clientSecret: config.sp_secret,
});
const auth = async () => {
  const TOKEN = await spotifyApi.clientCredentialsGrant();
  return spotifyApi.setAccessToken(TOKEN.body.access_token);
};
const getID = (url) => {
  const URL = url.substring(url.search(/(album).|(track).|(playlist)./g), url.length);
  return URL.substring(URL.search('/') + 1, URL.length);
};
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
const play = async (client, message) => {
  await auth();
  const URL = message.content;
  const ID = getID(URL);
  // eslint-disable-next-line no-undef
  if (URL.search('album') > 1) handleAlbum(ID);
  if (URL.search('track') > 1) handleTrack(client, message, ID);
  // eslint-disable-next-line no-undef
  if (URL.search('playlist') > 1) handlePlaylist(ID);
};
module.exports = { play };

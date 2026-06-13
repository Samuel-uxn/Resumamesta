const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use('/Principal', express.static('Principal'));
app.use('/estilos', express.static('estilos'));
app.use('/script', express.static('script'));
app.use('/imagenes', express.static('imagenes'));const PORT = process.env.PORT;
const API_KEY = process.env.YOUTUBE_API_KEY;

app.get('/api/recientes', async (req, res) => {
    const channelId = await getChannelId();
    const uploadsId = 'UU' + channelId.slice(2);
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=12&key=${API_KEY}`;
    const respuesta = await fetch(url);
    const data = await respuesta.json();

    const videos = data.items.map(item => ({
        id: item.snippet.resourceId.videoId,
        titulo: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
    }));

    res.json(videos);
});

app.get('/api/playlists', async (req, res) => {
    const channelId = await getChannelId();
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=10&key=${API_KEY}`;
    const respuesta = await fetch(url);
    const data = await respuesta.json();

    const playlists = data.items.map(item => ({
        id: item.id,
        titulo: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        cantidadVideos: item.contentDetails.itemCount
    }));

    res.json(playlists);
});

app.get('/api/playlist/video/:id', async(req, res)=> {
    const channelId = await getChannelId();
    const playlistId = req.params.id;
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=20&key=${API_KEY}`;
    const respuesta = await fetch(url);
    const data= await respuesta.json();

    const videos = data.items.map(item => ({
        id: item.snippet.resourceId.videoId,
        titulo: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
    }));

    res.json(videos);

}

);




app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

const fetch = require('node-fetch');

async function getChannelId() {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=resumamesta&key=${API_KEY}`;
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    return data.items[0].id;
}

app.get('/api/canal', async (req, res) => {
    const id = await getChannelId();
    res.json({ id });
});





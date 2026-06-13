const SERVER = 'http://localhost:3000';

const seccionReciente = document.getElementById('seccionReciente');
const seccionSugeridos = document.getElementById('seccionSugeridos');
const seccionPlaylists = document.getElementById('seccionPlaylists');
const inputBusqueda = document.getElementById('inputBusqueda');
const modal = document.getElementById('modal');
const modalVideo = document.getElementById('modalVideo');
const cerrarModal = document.getElementById('cerrarModal');
const seccionPlaylistSeleccionada = document.getElementById('seccionPlaylistSeleccionada');
const tituloPlaylistSeleccionada = document.getElementById('tituloPlaylistSeleccionada');

async function videosRecientes(){
    const respuesta= await fetch(`${SERVER}/api/recientes`);
    const videos = await respuesta.json();

    videos.forEach(video =>{
        const div = document.createElement('div');
        div.classList.add('recomendado');
        div.innerHTML=`
        <img src="${video.thumbnail}" alt="${video.titulo}">
        <p class="titulo-video">${video.titulo}</p>
        `;
        div.addEventListener('click', ()=>abrirModal(video.id));
        seccionSugeridos.appendChild(div);
    }

    );
}
videosRecientes();

async function ultimoVideo(){
    const respuesta= await fetch(`${SERVER}/api/recientes`);
    const videos = await respuesta.json();
    const reciente = videos[0];

    seccionReciente.innerHTML=`
        <img src="${reciente.thumbnail}" alt="${reciente.titulo}">
        <p class="titulo-video">${reciente.titulo}</p>
    `;
        seccionReciente.addEventListener('click', () => abrirModal(reciente.id));

}
ultimoVideo();

async function playList(){
    const respuesta=await fetch(`${SERVER}/api/playlists`);
    const videos=await respuesta.json();

    videos.forEach(playlist=>{
        const div=document.createElement('div');
        div.classList.add('lista');
        div.innerHTML=`
            <img src="${playlist.thumbnail}" alt="${playlist.titulo}">
            <div class="detalles">
                <h3>${playlist.titulo}</h3>
                <p>${playlist.cantidadVideos} videos</p>
            </div>
        `;
div.addEventListener('click', () => mostrarVideosPlaylist(playlist.id, playlist.titulo));        seccionPlaylists.appendChild(div);
    });
}
playList();
function abrirModal(videoId){
    modalVideo.src=`https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.classList.add('activo');
}
cerrarModal.addEventListener('click', () => {
    modal.classList.remove('activo');
    modalVideo.src = '';
});
async function mostrarVideosPlaylist(playlistId, tituloPlaylist){
    const respuesta = await fetch(`${SERVER}/api/playlist/video/${playlistId}`);
    const videos = await respuesta.json();

    tituloPlaylistSeleccionada.textContent = tituloPlaylist;
    seccionPlaylistSeleccionada.innerHTML = '';

    videos.forEach(video => {
        const div = document.createElement('div');
        div.classList.add('recomendado');
        div.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.titulo}">
            <p class="titulo-video">${video.titulo}</p>
        `;
        div.addEventListener('click', () => abrirModal(video.id));
        seccionPlaylistSeleccionada.appendChild(div);
    });

    seccionPlaylistSeleccionada.scrollIntoView({ behavior: 'smooth' });
}
inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    const tarjetas = seccionSugeridos.querySelectorAll('.recomendado');

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.querySelector('.titulo-video').textContent.toLowerCase();
        if (titulo.includes(texto)) {
            tarjeta.style.display = 'block';
        } else {
            tarjeta.style.display = 'none';
        }
    });
});
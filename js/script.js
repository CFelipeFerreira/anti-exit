const wrapper = document.querySelector(".wrapper"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    mainAudio = wrapper.querySelector("#main-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    moreMusicBtn = wrapper.querySelector("#more-music"),
    closemoreMusic = musicList.querySelector("#close");

let musicIndex = 0; // Índice da música atual
let isMusicPaused = true;

// Carregar a primeira música ao carregar a página
window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

// Função para carregar uma música com base no índice
function loadMusic(index) {
    if (allMusic.length === 0) {
        console.error("Nenhuma música encontrada na lista.");
        return;
    }

    musicName.innerText = allMusic[index].name;
    musicArtist.innerText = allMusic[index].artist;
    mainAudio.src = `songs/${allMusic[index].src}.mp3`;
}

// Função para reproduzir música
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// Função para pausar música
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// Função para música anterior
function prevMusic() {
    musicIndex--;
    if (musicIndex < 0) {
        musicIndex = allMusic.length - 1;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// Função para próxima música
function nextMusic() {
    musicIndex++;
    if (musicIndex >= allMusic.length) {
        musicIndex = 0;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// Evento de clique no botão play/pause
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});

// Evento de clique no botão anterior
prevBtn.addEventListener("click", prevMusic);

// Evento de clique no botão próximo
nextBtn.addEventListener("click", nextMusic);

// Atualizar a barra de progresso de acordo com o tempo da música
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    // Atualizar o tempo atual da música
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    wrapper.querySelector(".current-time").innerText = `${currentMin}:${currentSec}`;

    // Atualizar a duração total da música
    let durationMin = Math.floor(duration / 60);
    let durationSec = Math.floor(duration % 60);
    if (durationSec < 10) {
        durationSec = `0${durationSec}`;
    }
    wrapper.querySelector(".max-duration").innerText = `${durationMin}:${durationSec}`;
});

// Atualizar a posição da música ao clicar na área de progresso
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let duration = mainAudio.duration;
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * duration;
    playMusic(); // Continuar a reprodução após a mudança de posição
});

// Função para atualizar a interface do usuário com base na música em reprodução
function playingSong() {
    // Remover a classe "playing" de todas as músicas na lista
    const allLiTag = musicList.querySelectorAll("li");
    allLiTag.forEach((li) => {
        li.classList.remove("playing");
    });

    // Adicionar a classe "playing" à música atualmente em reprodução na lista
    allLiTag[musicIndex].classList.add("playing");
}

// Clique em um item da lista de músicas para carregar e reproduzir essa música
musicList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        musicIndex = parseInt(e.target.getAttribute("li-index"));
        loadMusic(musicIndex);
        playMusic();
        playingSong();
    }
});

// Exibir ou ocultar a lista de músicas ao clicar no botão "More Music"
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

// Fechar a lista de músicas ao clicar no botão "Close"
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});

// Inicialização da lista de músicas
const ulTag = musicList.querySelector("ul");
allMusic.forEach((music, index) => {
    let liTag = `<li li-index="${index}">
                    <div class="row">
                        <span>${music.name}</span>
                        <p>${music.artist}</p>
                    </div>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
});

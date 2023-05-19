let audio = new Audio();
let cur_track = 0;
let volume_step = 0.1;

audio.volume = 0.3;

const randomSong = document.querySelector('#random');

let playSongs = document.querySelector('#play');
let stopSongs = document.querySelector('#stop');

const nameSong = document.querySelector('.nameSong');

const gifBlock = document.querySelector('.gifs');

const timeline = document.querySelector('#timeline');
let progress = document.createElement('div');
progress.className = 'progress';
timeline.appendChild(progress);

timeline.addEventListener('click', function (event) {
  let timelineWidth = timeline.offsetWidth;
  let clickX = event.offsetX;
  let percent = clickX / timelineWidth;
  let newTime = percent * audio.duration;
  audio.currentTime = newTime;
});

audio.addEventListener('timeupdate', function () {
  let percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + '%';
  localStorage.setItem('currentPlaybackTime', audio.currentTime);
});

audio.addEventListener('ended', function () {
  cur_track++;
  if (cur_track >= tracklist.length) {
    cur_track = 0;
  }
  audio.src = tracklist[cur_track].url;
  audio.play();
  nameSong.innerText = `${tracklist[cur_track].name}`;
  randomGif();
});

let savedTime = localStorage.getItem('currentPlaybackTime');
if (savedTime) {
  audio.currentTime = savedTime;
}

function randomGif() {
  let randomNum = Math.floor(Math.random() * gifFiles.length);
  gifBlock.innerHTML = `<img src=${gifFiles[randomNum].url} alt="Gif">`;
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('player')) {
    // console.clear();
    let el = e.target;
    if (el.id === 'play') {
      audio.src = tracklist[cur_track].url;

      // Вешаем обработчик события "timeupdate" на аудио элемент
      audio.addEventListener('timeupdate', function () {
        // Сохраняем текущее время проигрывания в локальное хранилище (localStorage)
        localStorage.setItem('currentPlaybackTime', audio.currentTime);
      });

      // Загружаем сохраненное время проигрывания, если оно существует
      var savedTime = localStorage.getItem('currentPlaybackTime');
      if (savedTime) {
        // Устанавливаем время проигрывания на сохраненное значение
        audio.currentTime = savedTime;
      }

      audio.play();

      el.style.display = 'none';
      stopSongs.style.display = '';
      // console.info(`Играет: ${tracklist[cur_track].name}`);
      nameSong.innerText = `${tracklist[cur_track].name}`;
    }

    if (el.id === 'stop') {
      audio.pause();

      el.style.display = 'none';
      playSongs.style.display = '';
      // console.info('Пауза');
      nameSong.innerText = `${tracklist[cur_track].name}`;
    }

    if (el.id === 'random') {
      audio.pause();

      cur_track = Math.floor(Math.random() * tracklist.length);
      audio.src = tracklist[cur_track].url;
      playSongs.style.display = 'none';
      stopSongs.style.display = '';
      nameSong.innerText = `${tracklist[cur_track].name}`;
      audio.play();
      randomGif();
    }

    if (el.id === 'prev' || el.id === 'next') {
      cur_track =
        el.id === 'prev'
          ? cur_track - 1 < 0
            ? tracklist.length - 1
            : cur_track - 1
          : cur_track + 1 >= tracklist.length
          ? 0
          : cur_track + 1;

      audio.src = tracklist[cur_track].url;
      audio.play();
      randomGif();

      playSongs.style.display = 'none';
      stopSongs.style.display = '';
      // console.info(`Играет: ${tracklist[cur_track].name}`);
      nameSong.innerText = `${tracklist[cur_track].name}`;
    }

    if (el.id === 'vol-minus' || el.id === 'vol-plus') {
      audio.volume =
        el.id === 'vol-minus'
          ? audio.volume >= 0
            ? (audio.volume -= volume_step)
            : 0
          : audio.volume <= 1
          ? (audio.volume += volume_step)
          : 1;
      document.querySelector('#volume').innerText =
        Math.round(audio.volume * 100) + '%';
    }
  }
});

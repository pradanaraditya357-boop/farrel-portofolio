// Initialize VanillaTilt for 3D Effect
VanillaTilt.init(document.querySelectorAll(".card-3d"), {
    max: 12,
    speed: 500,
    glare: true,
    "max-glare": 0.15,
});

// Sound Synthesizer (Keypress & Click Mechanical Effect)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch(e) {}
}

document.querySelectorAll('button, a, select, .card-3d, .smk-badge-wrapper').forEach(el => {
    el.addEventListener('click', playClickSound);
});

// Interactive Dual Background Canvas (Network Nodes vs Matrix Rain)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let bgMode = 'nodes';

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Nodes Config
const numNodes = 65;
const nodes = Array.from({ length: numNodes }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 1.0,
    vy: (Math.random() - 0.5) * 1.0,
    radius: Math.random() * 1.8 + 1
}));

// Matrix Config
const matrixChars = "01010101FARREL_NETWORK_SYSTEM_TKJ_2027";
const fontSize = 14;
const columns = Math.floor(width / fontSize);
const drops = Array(columns).fill(1);

function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    if (bgMode === 'nodes') {
        for (let i = 0; i < numNodes; i++) {
            let n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00e5ff';
            ctx.fill();

            for (let j = i + 1; j < numNodes; j++) {
                let n2 = nodes[j];
                let dist = Math.hypot(n.x - n2.x, n.y - n2.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist / 120})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
    } else if (bgMode === 'matrix') {
        ctx.fillStyle = "rgba(3, 5, 8, 0.1)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#00e5ff";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    requestAnimationFrame(renderCanvas);
}
renderCanvas();

document.getElementById('bg-toggle-btn').addEventListener('click', () => {
    bgMode = bgMode === 'nodes' ? 'matrix' : 'nodes';
});

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
}
renderCursor();

function bindCursorEvents() {
    document.querySelectorAll('button, a, .nav-btn, input, textarea, select, .smk-badge-wrapper').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-link'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-link'));
    });

    document.querySelectorAll('.card-3d').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-card'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-card'));
    });
}
bindCursorEvents();

// Typewriter Effect
const titleText = "Halo, Saya Farrel";
const descText = "Siswa SMK Sore Tulungagung (TKJ) berdedikasi tinggi di bidang Network Engineering & Web Development.";

let titleIndex = 0;
let descIndex = 0;
const titleEl = document.getElementById('typewriter-title');
const descEl = document.getElementById('typewriter-desc');

function typeTitle() {
    if (titleIndex < titleText.length) {
        let char = titleText.charAt(titleIndex);
        if (titleIndex >= 11 && titleIndex <= 15) {
            if (titleIndex === 11) {
                const span = document.createElement('span');
                span.className = 'highlight-text';
                span.id = 'hl-span';
                titleEl.appendChild(span);
            }
            document.getElementById('hl-span').innerText += char;
        } else {
            titleEl.appendChild(document.createTextNode(char));
        }
        titleIndex++;
        setTimeout(typeTitle, 70);
    } else {
        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        cursor.innerText = '|';
        titleEl.appendChild(cursor);
        setTimeout(typeDesc, 200);
    }
}

function typeDesc() {
    if (descIndex < descText.length) {
        descEl.innerText = descText.substring(0, descIndex + 1);
        descIndex++;
        setTimeout(typeDesc, 25);
    }
}

window.addEventListener('DOMContentLoaded', typeTitle);

// Tab Navigation
function switchTab(element, tabId) {
    document.querySelectorAll('.section-view').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    element.classList.add('active');

    if (tabId === 'sec-home') {
        titleEl.innerHTML = '';
        descEl.innerText = '';
        titleIndex = 0;
        descIndex = 0;
        typeTitle();
    }
}

// Interactive Terminal dengan Command History (Panah Atas/Bawah)
const termInput = document.getElementById('terminal-input');
const termOutput = document.getElementById('terminal-output');
let commandHistory = [];
let historyIndex = -1;

termInput.addEventListener('keydown', (e) => {
    playClickSound();
    
    if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        if (cmd) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
        }
        
        let res = '';
        if (cmd === 'help') {
            res = "Perintah: 'ping', 'ipconfig', 'matrix', 'about', 'skills', 'clear', 'contact'";
        } else if (cmd === 'ping') {
            res = "PING 192.168.1.1 (parsh.server): 56 data bytes. 64 bytes: icmp_seq=1 ttl=64 time=1.24 ms [ONLINE]";
        } else if (cmd === 'ipconfig') {
            res = "IPv4 Address: 192.168.1.105 | Subnet Mask: 255.255.255.0 | Gateway: 192.168.1.1 (MikroTik Core)";
        } else if (cmd === 'matrix') {
            bgMode = 'matrix';
            res = "Matrix Background Mode Activated!";
        } else if (cmd === 'about') {
            res = "Parsh - Siswa TKJ di SMK Sore Tulungagung.";
        } else if (cmd === 'skills') {
            res = "Networking, Cisco, MikroTik, Fiber Optic, HTML/CSS/JS, CyberSecurity.";
        } else if (cmd === 'contact') {
            res = "Email: pradanaraditya357@gmail.com | WA: +6285855265944";
        } else if (cmd === 'clear') {
            termOutput.innerText = "";
            termInput.value = '';
            return;
        } else if (cmd !== '') {
            res = `Command tidak dikenal: '${cmd}'. Ketik 'help'.`;
        }
        if (res) termOutput.innerText = res;
        termInput.value = '';
    } 
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            termInput.value = commandHistory[historyIndex];
        }
    } 
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
            historyIndex++;
            termInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            termInput.value = '';
        }
    }
});

// Multi-Playlist & Interactive Selector Audio Player Logic (12 Lagu)
const playlist = [
    { title: "Hidup Untukmu, Mati Tanpamu", artist: "NOAH", src: "hidupuntukmu,matitanpamu.mp3" },
    { title: "Separuh Aku", artist: "NOAH", src: "separuhaku.mp3" },
    { title: "Tak Lagi Sama", artist: "NOAH", src: "taklagisama.mp3" },
    { title: "Aku Milikmu", artist: "Dewa 19", src: "akumilikmu.mp3" },
    { title: "Cincin", artist: "Hindia", src: "cincin.mp3" },
    { title: "Diary Depresiku", artist: "Last Child", src: "diarydepresiku.mp3" },
    { title: "Jatuh Suka", artist: "Tulus", src: "jatuhsuka.mp3" },
    { title: "Teh Hijau", artist: "Tulus", src: "tehhhijau.mp3" },
    { title: "Bintang Di Surga", artist: "NOAH", src: "bintangdisurga.mp3" },
    { title: "Wanita Masih Banyak", artist: "Stand Here Alone", src: "wanitamasihbanyak.mp3" },
    { title: "Langit Tak Seharusnya Biru", artist: "The Jansen", src: "langittakseharusnyabiru.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = document.getElementById('audio-stream');
const playBtn = document.getElementById('main-play-btn');
const discIcon = document.getElementById('disc-icon');
const visualizerSpectrum = document.getElementById('visualizer-spectrum');
const songTitleEl = document.getElementById('song-title');
const songArtistEl = document.getElementById('song-artist');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playlistSelect = document.getElementById('playlist-select');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

playlist.forEach((song, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${index + 1}. ${song.title}`;
    playlistSelect.appendChild(option);
});

function loadTrack(index) {
    currentTrackIndex = index;
    songTitleEl.innerText = playlist[index].title;
    songArtistEl.innerText = playlist[index].artist;
    audio.src = playlist[index].src;
    playlistSelect.value = index;
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        discIcon.classList.remove('playing');
        visualizerSpectrum.classList.remove('active');
        isPlaying = false;
    } else {
        if (!audio.src) {
            loadTrack(currentTrackIndex);
        }
        audio.play().then(() => {
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            discIcon.classList.add('playing');
            visualizerSpectrum.classList.add('active');
            isPlaying = true;
        }).catch(err => {
            console.log("Audio play error:", err);
        });
    }
});

nextBtn.addEventListener('click', () => {
    let newIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(newIndex);
    if (isPlaying) audio.play();
});

prevBtn.addEventListener('click', () => {
    let newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(newIndex);
    if (isPlaying) audio.play();
});

playlistSelect.addEventListener('change', (e) => {
    let selectedIndex = parseInt(e.target.value);
    loadTrack(selectedIndex);
    if (isPlaying) {
        audio.play();
    }
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

audio.addEventListener('ended', () => {
    let newIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(newIndex);
    if (isPlaying) audio.play();
});

loadTrack(0);

// Theme Switcher Logic
function setTheme(primaryColor, secondaryColor) {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
}
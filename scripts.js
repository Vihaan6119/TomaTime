const FOCUS = 25 * 60;
const BREAK = 5 * 60;
let timeLeft = FOCUS;
let mode = 'focus';
let running = false;
let tick = null;

const timeEl = document.getElementById('time');
const modeEl = document.getElementById('mode');
const ringEl = document.getElementById('ring');
const sessionsEl = document.getElementById('sessions');

function show() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timeEl.textContent = m + ':' + String(s).padStart(2, '0');
    document.title = timeEl.textContent + ' | Tomatime';
    const total = (mode === 'focus') ? FOCUS : BREAK;
    const pct = (timeLeft / total) * 100;
    const color = (mode === 'focus') ? '#c9442a' : '#4a9e4a';
    ringEl.style.background = 'conic-gradient(' + color + ' ' + pct + '%, #e5dccb 0)';
}

function switchMode() {
    if (mode === 'focus') {
        addSession();
        mode = 'break';
        timeLeft = BREAK;
        modeEl.textContent = 'BREAK';
        modeEl.style.color = '#4a9e4a';
    } else {
        mode = 'focus';
        timeLeft = FOCUS;
        modeEl.textContent = 'FOCUS';
        modeEl.style.color = '#c9442a';
    }
    show();
}

function loadSessions() {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('tomatime_sessions') || '{}');
    const n = data[today] || 0;
    sessionsEl.textContent = n + (n === 1 ? ' session today' : ' sessions today');
}

function addSession() {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('tomatime_sessions') || '{}');
    data[today] = (data[today] || 0) + 1;
    localStorage.setItem('tomatime_sessions', JSON.stringify(data));
    loadSessions();
}

document.getElementById('start').addEventListener('click', function(){
    if (running) return;
    running = true;
    tick = setInterval(function(){
        timeLeft--;
        if (timeLeft <= 0) switchMode();
        show();
    }, 1000);
});

document.getElementById('pause').addEventListener('click', function(){
    running = false;
    clearInterval(tick);
});

document.getElementById('reset').addEventListener('click', function(){
    running = false;
    clearInterval(tick);
    mode = 'focus';
    timeLeft = FOCUS;
    modeEl.textContent = 'FOCUS';
    modeEl.style.color = '#c9442a';
    show();
});

loadSessions();
show();
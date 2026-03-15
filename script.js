// --- ADMIN CONTROL PANEL ---
const CONFIG = {
    adsEnabled: true,          // Toggle standard ad popups (on/off)
    cpaLockerEnabled: true,    // Toggle the 10-second CPA Locker (on/off)
    cpaTimerSeconds: 10        // Seconds until the CPA Locker triggers
};

// --- ADS CONFIGURATION ---
const adLinks = [
    "https://www.effectivegatecpm.com/szaxcfckwf?key=16135805dc97698328fbcff487238624",
    "https://omg10.com/4/10716564"
];
let clickCount = 0;

function handleAdClick() {
    if (!CONFIG.adsEnabled) return; // Exit if ads are toggled off

    clickCount++;
    // Opens a random ad starting from the 2nd click
    if (clickCount > 1) {
        const randomAd = adLinks[Math.floor(Math.random() * adLinks.length)];
        window.open(randomAd, '_blank');
    }
}

// --- CPA LOCKER SETUP ---
var LwLpY_yci_zfqKbc = {"it": 4317065, "key": "d8d89"};

function initCPALocker() {
    if (!CONFIG.cpaLockerEnabled) return;

    setTimeout(() => {
        console.log("CPA Locker Loading...");
        const script = document.createElement('script');
        script.src = "https://d3v3431sr9puku.cloudfront.net/5e04516.js";
        document.body.appendChild(script);
        
        // Some locker scripts require a manual call; most auto-execute.
        if (typeof _ga === "function") { _ga(); }
    }, CONFIG.cpaTimerSeconds * 1000);
}

// --- IMAGES & PROFILES ---
const profileImageUrls = [];
for (let i = 1; i <= 20; i++) {
    profileImageUrls.push(`img/foto${i}.jpg`);
}

const femaleNames = ["Maria", "Ana", "Alice", "Helena", "Valentina", "Fernanda", "Juliana", "Sophia", "Amanda", "Letícia", "Luzia", "Antonia", "Francisca", "Terezinha"];

let matches = [];
let chatHistories = {};
let currentPartner = null;

// --- APP CORE FUNCTIONS ---
function createCard() {
    const url = profileImageUrls[Math.floor(Math.random() * profileImageUrls.length)];
    const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${url}" onerror="this.src='https://via.placeholder.com/400x600?text=Elo+User'">
        <div class="card-info">
            <h2>${name}, 22 <span class="online-dot pulse"></span></h2>
            <p>Online agora • Perto de você</p>
        </div>`;
    card.data = { name, img: url };
    return card;
}

function swipe(isLike) {
    const cards = document.querySelectorAll('.card');
    const topCard = cards[cards.length - 1];
    if (!topCard) return;

    topCard.style.transform = isLike ? "translateX(200%) rotate(30deg)" : "translateX(-200%) rotate(-30deg)";
    
    if (isLike && Math.random() > 0.3) {
        currentPartner = topCard.data;
        document.getElementById('match-name-label').innerText = currentPartner.name;
        document.getElementById('match-popup').style.display = 'flex';
        
        if (!chatHistories[currentPartner.name]) {
            matches.push(currentPartner);
            chatHistories[currentPartner.name] = [{ sender: 'ai', text: `Oi! Sou a ${currentPartner.name}. Gostei do seu perfil!` }];
            updateInbox();
        }
    }
    
    setTimeout(() => {
        topCard.remove();
        document.getElementById('card-stack').prepend(createCard());
    }, 400);
}

function updateInbox() {
    const list = document.getElementById('inbox-list');
    if(!list) return;
    list.innerHTML = matches.map(m => `
        <div class="inbox-item" onclick="handleAdClick(); openChat('${m.name}', '${m.img}')">
            <img src="${m.img}" class="avatar">
            <div>
                <b style="font-size:16px;">${m.name}</b>
                <p style="font-size:13px; color:#888;">${chatHistories[m.name].slice(-1)[0].text}</p>
            </div>
        </div>`).join('');
}

function openChat(name, img) {
    currentPartner = { name, img };
    document.getElementById('chat-name-header').innerText = name;
    document.getElementById('chat-img').src = img;
    renderChat();
    showView('chat');
}

function renderChat() {
    const log = document.getElementById('chat-log');
    log.innerHTML = chatHistories[currentPartner.name].map(m => `
        <div class="bubble ${m.sender}">${m.text}</div>`).join('');
    log.scrollTop = log.scrollHeight;
}

function sendMsg() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    chatHistories[currentPartner.name].push({ sender: 'user', text });
    renderChat();
    input.value = '';
    
    setTimeout(() => {
        chatHistories[currentPartner.name].push({ sender: 'ai', text: "Que legal! Me conta mais sobre você? 😊" });
        renderChat();
        updateInbox();
    }, 1000);
}

function showView(id, navEl) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + id).classList.add('active');
    if (navEl) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navEl.classList.add('active');
    }
}

function closeMatch() { document.getElementById('match-popup').style.display = 'none'; }
function openChatFromMatch() { closeMatch(); openChat(currentPartner.name, currentPartner.img); }

// --- INITIALIZATION ---
window.onload = () => {
    // 1. Load cards
    const stack = document.getElementById('card-stack');
    for(let i=0; i<3; i++) {
        stack.prepend(createCard());
    }
    
    // 2. Setup button listeners
    document.getElementById('send-btn').onclick = () => { handleAdClick(); sendMsg(); };
    document.getElementById('chat-input').onkeypress = (e) => {
        if (e.key === 'Enter') { handleAdClick(); sendMsg(); }
    };

    // 3. Start the CPA Locker timer
    initCPALocker();
};

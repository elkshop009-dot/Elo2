// --- AD CONFIGURATION ---
const adLinks = [
    "https://www.effectivegatecpm.com/szaxcfckwf?key=16135805dc97698328fbcff487238624",
    "https://omg10.com/4/10716564"
];

let clickCount = 0;

function handleAdClick() {
    clickCount++;
    if (clickCount > 1) {
        const randomAd = adLinks[Math.floor(Math.random() * adLinks.length)];
        window.open(randomAd, '_blank');
    }
}

// --- IMAGE GENERATION ---
// This assumes your folder is named "img" and files are "foto1.jpg"
const profileImageUrls = [];
for (let i = 1; i <= 20; i++) {
    profileImageUrls.push(`img/foto${i}.jpg`);
}

const femaleNames = ["Maria", "Ana", "Alice", "Helena", "Valentina", "Fernanda", "Juliana", "Sophia", "Amanda", "Letícia", "Luzia", "Antonia", "Francisca", "Terezinha"];

let matches = [];
let chatHistories = {};
let currentPartner = null;

// --- APP LOGIC ---

function createCard() {
    const url = profileImageUrls[Math.floor(Math.random() * profileImageUrls.length)];
    const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${url}" onerror="this.src='https://via.placeholder.com/400x600?text=Image+Not+Found'">
        <div class="card-info">
            <h2>${name}, 22 <span class="online-dot pulse"></span></h2>
            <p>Online agora</p>
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
            chatHistories[currentPartner.name] = [{ sender: 'ai', text: `Oi! Sou a ${currentPartner.name}.` }];
            updateInbox();
        }
    }
    
    setTimeout(() => {
        topCard.remove();
        const newCard = createCard();
        document.getElementById('card-stack').prepend(newCard);
    }, 400);
}

function updateInbox() {
    const list = document.getElementById('inbox-list');
    list.innerHTML = matches.map(m => `
        <div class="inbox-item" onclick="handleAdClick(); openChat('${m.name}', '${m.img}')">
            <img src="${m.img}" class="avatar">
            <div><b>${m.name}</b><br><small>Online</small></div>
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
        chatHistories[currentPartner.name].push({ sender: 'ai', text: "Que legal! Me conta mais? 😊" });
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

// Wait for HTML to load before running
window.onload = () => {
    const stack = document.getElementById('card-stack');
    for(let i=0; i<3; i++) {
        stack.prepend(createCard());
    }
    document.getElementById('send-btn').onclick = () => { handleAdClick(); sendMsg(); };
};

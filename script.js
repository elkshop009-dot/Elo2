// --- CONFIGURAÇÃO DE ANÚNCIOS ---
const adLinks = [
    "https://www.effectivegatecpm.com/szaxcfckwf?key=16135805dc97698328fbcff487238624",
    "https://omg10.com/4/10716564"
];

let clickCount = 0;

function handleAdClick() {
    clickCount++;
    // Abre anúncio a partir do segundo clique (pula o primeiro para não frustrar o início)
    if (clickCount > 1) {
        const randomAd = adLinks[Math.floor(Math.random() * adLinks.length)];
        window.open(randomAd, '_blank');
    }
}

// --- BANCO DE DADOS DE IMAGENS E NOMES ---
const profileImageUrls = [
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/fcf02878-4821-4f3b-8e5e-9b6008821322.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/2e1018d8-2237-41c0-88b6-2570c33fd9f6.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/0a5833a2-5cea-4a43-8c38-93fed7898342.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/492fd590-2f4b-46ac-b43a-095ebbd734e7.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/f4b47cd9-bc7b-45a5-a352-b33eaf26d5a0.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/807df888-c257-4f5a-8a74-3cb6f730b862.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/372f78f8-2bad-4af1-b8e9-0bfecad46e7f.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/8af6eb65-3b14-4aaa-b451-1a7a1db25a56.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/7fc587a4-2608-44bd-b19d-e5573efa82d9.jpg",
    "https://i.supaimg.com/92ff5f50-02cc-4564-a5ef-233e1b9caf69/c47cb690-0781-4ba3-914d-4e8d8484cfa6.jpg"
];

const femaleNames = ["Maria", "Ana", "Alice", "Helena", "Valentina", "Fernanda", "Juliana", "Sophia", "Amanda", "Letícia" ,"Luzia","Antonia","Francisca","Terezinha"];

// --- ESTADO DO APLICATIVO ---
let matches = [];
let chatHistories = {};
let currentPartner = null;

// --- FUNÇÕES DE LÓGICA ---

function getAiResponse(text, name) {
    const msg = text.toLowerCase();
    if (msg.includes("tudo bem")) return "Tudo ótimo por aqui! E com você, como vai o dia?";
    if (msg.includes("idade") || msg.includes("quantos anos")) return "Eu tenho 23 anos! E você?";
    if (msg.includes("oi") || msg.includes("olá")) return `Oie! Aqui é a ${name}. Fiquei feliz com nosso match!`;
    return "Que legal! Me conta mais sobre isso? 😊";
}

function createCard() {
    const url = profileImageUrls[Math.floor(Math.random() * profileImageUrls.length)];
    const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const age = Math.floor(Math.random() * 5) + 20; // Idade entre 20 e 25
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${url}">
        <div class="card-info">
            <h2>${name}, ${age} <span class="online-dot pulse"></span></h2>
            <p>Online agora • a 2 km de você</p>
        </div>
    `;
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
    list.innerHTML = matches.map(m => `
        <div class="inbox-item" onclick="handleAdClick(); openChat('${m.name}', '${m.img}')">
            <div style="position:relative">
                <img src="${m.img}" class="avatar">
                <div class="online-dot pulse" style="position:absolute; bottom:2px; right:2px; width:12px; height:12px;"></div>
            </div>
            <div style="flex:1">
                <b style="font-size:16px;">${m.name}</b>
                <p style="margin:4px 0 0; font-size:13px; color:#888; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:180px;">
                    ${chatHistories[m.name].slice(-1)[0].text}
                </p>
            </div>
        </div>
    `).join('');
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
        <div class="bubble ${m.sender}">${m.text}</div>
    `).join('');
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
        const reply = getAiResponse(text, currentPartner.name);
        chatHistories[currentPartner.name].push({ sender: 'ai', text: reply });
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

// --- EVENTOS E INICIALIZAÇÃO ---

// Listener para o botão de enviar (além do handleAdClick no HTML)
document.getElementById('send-btn').addEventListener('click', () => {
    handleAdClick();
    sendMsg();
});

// Listener para tecla Enter no input
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAdClick();
        sendMsg();
    }
});

// Inicializa o stack de cartões
for(let i=0; i<3; i++) {
    document.getElementById('card-stack').prepend(createCard());
}

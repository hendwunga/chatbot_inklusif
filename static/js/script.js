// ======== ELEMENTS ========
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const ttsBtn = document.getElementById("tts-btn");
const ttsSpeed = document.getElementById("tts-speed");
const btnSummary = document.getElementById("btn-summary");
const btnFull = document.getElementById("btn-full");

// ======== STATE ========
let lastAnswers = { full: "", summary: "" };
let currentAnswer = "summary";
let currentTerm = ""; // kata penting untuk latihan
let interactiveMode = false;

// Icon untuk highlight
const iconMap = { "konsep":"📝", "tindakan":"⚡", "kata_kunci":"🔑" };

// ======== EVENT LISTENERS ========
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });

// Ringkas / Lengkap
btnSummary.addEventListener("click", () => { currentAnswer="summary"; displayLastAnswer(); });
btnFull.addEventListener("click", () => { currentAnswer="full"; displayLastAnswer(); });

// TTS
ttsBtn.addEventListener("click", () => {
    const lastBotMessage = document.querySelector("#chat-box .message.bot:last-child");
    if(!lastBotMessage) return;
    fetch("/tts", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text: lastBotMessage.textContent })
    })
    .then(res=>res.blob())
    .then(blob=>{
        const audio = new Audio(URL.createObjectURL(blob));
        audio.playbackRate = parseFloat(ttsSpeed.value);
        audio.play();
    });
});

// Klik kata penting
chatBox.addEventListener("click", e => {
    if(e.target.classList.contains("highlight")){
        const kata = e.target.textContent.replace(/^[^\w]*\s*/, '');
        currentTerm = kata;
        interactiveMode = true;
        fetchInteractiveQuestion(kata);
    }
});

// ======== FUNCTIONS ========

// Kirim pesan
function sendMessage(){
    const message = userInput.value.trim();
    if(!message) return;
    appendMessage("user", message);
    userInput.value = "";

    // Jika sedang latihan interaktif
    if(interactiveMode && currentTerm){
        sendInteractiveAnswer(message);
        return;
    }

    // Pesan normal → kirim ke backend
    fetch("/chat_highlight_icon", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ message })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.full && data.summary){
            lastAnswers = { full: data.full, summary: data.summary };
            currentAnswer="summary";
            displayLastAnswer();
            interactiveMode = true; // mulai mode latihan otomatis
            setTimeout(fetchInteractiveQuestion, 1000);
        }
        if(data.error) appendMessage("bot", "Error: "+data.error);
    });
}

// Tampilkan jawaban terakhir (Ringkas/Lengkap)
function displayLastAnswer(){
    const lastBotMessage = document.querySelector("#chat-box .message.bot:last-child");
    if(lastBotMessage) chatBox.removeChild(lastBotMessage);

    const text = currentAnswer==="summary" ? lastAnswers.summary : lastAnswers.full;
    appendMessage("bot", text);
}

// Append message ke chat box
function appendMessage(sender, text){
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;

    if(sender==="bot"){
        // Highlight kata penting dengan tooltip
        text = text.replace(/\[\[(.*?):(.*?)(?:\|(.*?))?(?:\|(.*?))?\]\]/g,
            (match, tipe, kata, definisi, contoh)=>{
                const icon = iconMap[tipe] || "🔹";
                let tooltip = definisi? definisi : kata;
                if(contoh) tooltip += ` | Contoh: ${contoh}`;
                return `<span class="highlight ${tipe}" data-tooltip="${tooltip}">${icon} ${kata}</span>`;
            });
        msgDiv.innerHTML = text;
    } else {
        msgDiv.textContent = text;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ======== INTERACTIVE MODE ========

// Minta pertanyaan latihan terkait kata penting
function fetchInteractiveQuestion(term=null){
    const url = term ? `/interactive_question?term=${term}` : "/interactive_question";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(!data.question) return;
            currentTerm = data.term;
            appendMessage("bot", data.question);
        });
}

// Kirim jawaban user untuk latihan interaktif
function sendInteractiveAnswer(userAnswer){
    fetch("/interactive_answer", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ term: currentTerm, answer: userAnswer })
    })
    .then(res => res.json())
    .then(data => {
        if(data.feedback) appendMessage("bot", `📝 Feedback: ${data.feedback}`);
        currentTerm = ""; // reset
        setTimeout(fetchInteractiveQuestion, 1000); // pertanyaan selanjutnya
    });
}

const instrumentData = {
    information: {
        name: "Məlumat",
        description: "İncəsənət Mərkəzi haqqında təhsil istiqamətləri, proqramlar və kursların əsas məlumatları.",
        duration: "İl boyu",
        level: "Hər yaş",
        literature: ["Musiqi təhsili proqramları", "Alət seçimi üzrə konsultasiya", "Uşaq və böyüklər üçün qruplar", "Sərbəst səhnə təcrübəsi"],
        teachers: ["Peşəkar tədris heyəti", "Fərdi və qrup məşğələləri", "Konsert proqramları", "Sistemli repertuar hazırlığı"]
    },
    history: {
        name: "Musiqi tarixi",
        description: "Azərbaycan xalq çalğı alətlərindən klassik musiqiyə qədər zəngin musiqi irsimiz.",
        duration: "Keçmiş — bu gün",
        level: "Ümumi və xüsusi",
        literature: ["Muğam ənənəsi", "Aşıq sənəti", "Tar, saz və kamança məktəbləri", "Klassik və müasir Azərbaycan musiqisi"],
        teachers: ["Muğam tarixçəsi", "Xalq havalarının yaranması", "Səhnə ənənələrinin inkişafı", "Bəstəkar məktəbləri"]
    },
    melody: {
        name: "Musiqi və melodiyalar",
        description: "Müxtəlif alətlərə aid canlı melodiyalarla musiqi atmosferini hiss et.",
        duration: "Canlı dinləmə",
        level: "Dinləyici",
        literature: ["Tar melodiyası", "Saz havası", "Zurna ritmləri", "Skripka və gitara repertuarı"],
        teachers: ["Dinlə və seç", "Tempi müqayisə et", "Musiqi ruhunu hiss et", "Sevdiyin aləti öyrən"]
    },
    artwork: {
        name: "İncəsənət əsərləri",
        description: "Musiqi əsərlərini, ölkə təhsilində bəstəkarları və yaradıcılıq nümunələrini kəşf et.",
        duration: "Yaradıcı kolleksiya",
        level: "Klassik — Müasir",
        literature: ["Muğam dastgahları", "Azərbaycan xalq mahnıları", "Simfonik və kamera əsərləri", "Müasir musiqi nümunələri"],
        teachers: ["Üzeyir Hacıbəyli", "Qara Qarayev", "Fikrət Əmirov", "Niyazi"]
    }
};

const instrumentMelodies = {
    qitara: { notes: [60, 64, 67, 69, 67, 64, 62, 64], waveform: "triangle", tempo: 310, label: "Qitara melodiyası" },
    saz: { notes: [57, 60, 62, 64, 62, 60, 57, 55], waveform: "sawtooth", tempo: 360, label: "Saz hava melodiyası" },
    zurna: { notes: [64, 67, 69, 72, 69, 67, 64, 67], waveform: "square", tempo: 260, label: "Zurna bayram melodiyası" },
    tar: { notes: [57, 62, 64, 67, 69, 67, 64, 62], waveform: "sine", tempo: 420, label: "Tar muğam melodiyası" },
    skripka: { notes: [64, 67, 71, 76, 74, 71, 69, 67], waveform: "sine", tempo: 380, label: "Skripka melodiyası" },
    information: { notes: [60, 64, 67, 64, 60, 62, 67, 64], waveform: "triangle", tempo: 420, label: "Məlumat maraq melodiyası" },
    history: { notes: [57, 60, 64, 62, 60, 57, 55, 57], waveform: "sine", tempo: 460, label: "Tarix havası" },
    melody: { notes: [60, 64, 67, 71, 69, 67, 64, 62], waveform: "triangle", tempo: 300, label: "Canlı melodiyalar" },
    artwork: { notes: [64, 67, 69, 72, 69, 67, 64, 67], waveform: "sine", tempo: 390, label: "İncəsənət əsəri atmosferi" }
};

const buttons = document.querySelectorAll(".toggle-button");
const panel = document.querySelector(".tog-but");
const insideToggle = document.querySelector(".insidetgg");
let closeTimer;

function closeInstrumentPanel() {
    stopMelody();
    panel.classList.remove("is-open");
    insideToggle.classList.remove("is-visible");
    buttons.forEach((item) => item.classList.remove("is-active"));

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
        if (!panel.classList.contains("is-open")) insideToggle.innerHTML = "";
    }, 420);
}

function openInstrumentPanel(button) {
    window.clearTimeout(closeTimer);
    const key = button.dataset.category;
    const data = instrumentData[key];
    if (!data) return;

    buttons.forEach((item) => item.classList.toggle("is-active", item === button));

    insideToggle.innerHTML = `
        <article class="instrument-panel">
            <button type="button" class="instrument-close" aria-label="Paneli bağla">×</button>
            <div class="instrument-heading">
                <p class="instrument-kicker">Alət üzrə təhsil</p>
                <h2>${data.name}</h2>
                <p class="instrument-description">${data.description}</p>
            </div>

            <div class="instrument-meta">
                <div><span>Tədris müddəti</span><strong>${data.duration}</strong></div>
                <div><span>Səviyyə</span><strong>${data.level}</strong></div>
            </div>

            <div class="instrument-details">
                <section class="instrument-section">
                    <h3>Ədəbiyyat və repertuar</h3>
                    <ul>${data.literature.map((item) => `<li>${item}</li>`).join("")}</ul>
                </section>
                <section class="instrument-section">
                    <h3>Müəllimlər</h3>
                    <ul>${data.teachers.map((item) => `<li>${item}</li>`).join("")}</ul>
                </section>
            </div>
        </article>
    `;

    panel.classList.add("is-open");
    insideToggle.classList.remove("is-visible");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => insideToggle.classList.add("is-visible"));
    });

    insideToggle.querySelector(".instrument-close").addEventListener("click", closeInstrumentPanel);
    playMelody(key);

    window.setTimeout(() => {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 140);
}

const listeningSection = document.querySelector(".listening");
const listenPlay = document.querySelector(".listen-play");
const listenStop = document.querySelector(".listen-stop");
const listenName = document.querySelector(".listen-name");
const listenTime = document.querySelector(".listen-time");
const listenProgress = document.querySelector(".listen-progress");
const listenProgressFill = document.querySelector(".listen-progress-fill");
const listenBars = document.querySelector(".listen-bars");
let audioContext;
let activeNodes = [];
let playbackTimer;
let progressTimer;
let activeInstrument = "tar";
let isPlaying = false;

function midiToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

function stopMelody(updateButton = true) {
    window.clearInterval(playbackTimer);
    window.clearInterval(progressTimer);
    activeNodes.forEach((node) => {
        try { node.stop(); } catch (error) {}
    });
    activeNodes = [];
    isPlaying = false;

    if (updateButton) {
        listenPlay.classList.remove("is-playing");
        listenPlay.querySelector(".listen-play-icon").textContent = "▶";
        listenPlay.setAttribute("aria-label", "Musiqini başlat");
        listenProgressFill.style.width = "0%";
        listenProgress.setAttribute("aria-valuenow", "0");
        listenTime.textContent = "0:00";
        listeningSection.classList.remove("is-playing");
    }
}

function playMelody(instrumentKey) {
    stopMelody(false);
    activeInstrument = instrumentKey;
    const melody = instrumentMelodies[instrumentKey];
    if (!melody) return;

    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();

    listenName.textContent = melody.label;
    listenPlay.classList.add("is-playing");
    listenPlay.querySelector(".listen-play-icon").textContent = "Ⅱ";
    listenPlay.setAttribute("aria-label", "Musiqini dayandır");
    listeningSection.classList.add("is-playing");
    isPlaying = true;

    let step = 0;
    let elapsed = 0;
    const totalDuration = melody.tempo * melody.notes.length;

    listenProgressFill.style.width = "0%";
    listenTime.textContent = "0:00";

    function playNote() {
        if (!isPlaying) return;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = melody.waveform;
        oscillator.frequency.value = midiToFrequency(melody.notes[step % melody.notes.length]);

        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(instrumentKey === "zurna" ? 0.09 : 0.12, audioContext.currentTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + melody.tempo / 1000 * 0.82);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + melody.tempo / 1000);
        activeNodes.push(oscillator);
        step += 1;

        if (step >= melody.notes.length) {
            window.setTimeout(() => {
                if (isPlaying) playMelody(instrumentKey);
            }, melody.tempo);
            return;
        }
    }

    playNote();
    playbackTimer = window.setInterval(playNote, melody.tempo);

    progressTimer = window.setInterval(() => {
        elapsed += 100;
        const percent = Math.min((elapsed / totalDuration) * 100, 100);
        listenProgressFill.style.width = `${percent}%`;
        listenProgress.setAttribute("aria-valuenow", String(Math.round(percent)));
        listenTime.textContent = `0:${String(Math.floor(elapsed / 1000)).padStart(2, "0")}`;
    }, 100);
}

listenPlay.addEventListener("click", () => {
    if (isPlaying) stopMelody();
    else playMelody(activeInstrument);
});
listenStop.addEventListener("click", () => stopMelody());

listenBars.innerHTML = Array.from({ length: 26 }, (_, index) =>
    `<span style="--bar-index:${index}"></span>`
).join("");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const alreadyOpen = button.classList.contains("is-active") && panel.classList.contains("is-open");
        if (alreadyOpen) {
            closeInstrumentPanel();
        } else {
            openInstrumentPanel(button);
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
        closeInstrumentPanel();
    }
});

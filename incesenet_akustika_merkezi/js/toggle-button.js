const instrumentData = {
    qitara: {
        name: "Qitara",
        description: "Müasir gitara texnikası, akkordlar, barmaq düzümü və repertuar üzrə mərhələli təhsil.",
        duration: "6 ay",
        level: "Başlanğıc — İrəliləmiş",
        literature: ["F. F. Leavitt — A Modern Method for Guitar", "Matteo Carcassi — 25 Studies", "Sor Studies", "Azerbaycan xalq mahnıları repertuarı"],
        teachers: ["Əhməd Məmmədov — Klassik gitara", "Leyla Əliyeva — Akustik gitara", "Kamran Həsənov — Müasir gitara"]
    },
    saz: {
        name: "Saz",
        description: "Azərbaycan saz məktəbindən ifa texnikası, müxtəlif köklər, aşıq bağlaması və muğam öyrənmək.",
        duration: "8 ay",
        level: "Başlanğıc — İrəliləmiş",
        literature: ["Saz və dəstlərin ifa təcrübəsi", "Aşıq Ələsgər mahnıları", "Muğamlar — saz üçün notlar", "Qaraşlı — xalq havaları"],
        teachers: ["Mikayıl Rəhimov — Saz", "Nigar Quliyeva — Muğam", "Rəşad Abbasov — Aşıq sənəti"]
    },
    zurna: {
        name: "Zurna",
        description: "Zurna nəfəs texnikası, trilllər, xalq havaları və milli bayram repertuarı üzrə təlim.",
        duration: "5 ay",
        level: "Başlanğıc — Orta",
        literature: ["Zurna üçün nəfəs texnikası", "Azərbaycan xalq havaları", "Nizami Paşayev — zurna parçaları", "Toy və mərasim repertuarı"],
        teachers: ["Nazim Əliyev — Zurna", "Tərlan Məmmədov — Xalq havaları", "Elçin Hüseynov — Bayram repertuarı"]
    },
    tar: {
        name: "Tar",
        description: "Muğam dastgahları, tarın barmaq pozusiyası, lal barmaq, zərbli və melodik ifa texnikaları.",
        duration: "12 ay",
        level: "Başlanğıc — Peşəkar",
        literature: ["Hacı Məmmədov — Tar üçün musiqi kitabı", "Səid Rustamov repertuarı", "Muğam əzbərləmə dəftəri", "Azərbaycan tar məktəbləri"],
        teachers: ["Məşədixanım Əsədova — Tar", "Fərid Ələkbərov — Muğam", "Vüqar Abdullayev — Klassik repertuar"]
    },
    skripka: {
        name: "Skripka",
        description: "Musiqi oxuma, yay çəkilişi, vibrato, etüd və klassik repertuar üzrə sistemli təhsil.",
        duration: "12 ay",
        level: "Başlanğıc — Peşəkar",
        literature: ["W. Wohlfahrt — Violin Studies", "K. H. H. Kayser — 36 Studies", "Suzuki Violin School", "Azərbaycan xalq mahnıları — skripka üçün"],
        teachers: ["Aygün Musayeva — Klassik skripka", "Emil Vəliyev — Orkestr ifası", "Sevil Qafarova — Kamer musiqisi"]
    }
};

const instrumentMelodies = {
    qitara: { notes: [60, 64, 67, 69, 67, 64, 62, 64], waveform: "triangle", tempo: 310, label: "Qitara melodiyası" },
    saz: { notes: [57, 60, 62, 64, 62, 60, 57, 55], waveform: "sawtooth", tempo: 360, label: "Saz hava melodiyası" },
    zurna: { notes: [64, 67, 69, 72, 69, 67, 64, 67], waveform: "square", tempo: 260, label: "Zurna bayram melodiyası" },
    tar: { notes: [57, 62, 64, 67, 69, 67, 64, 62], waveform: "sine", tempo: 420, label: "Tar muğam melodiyası" },
    skripka: { notes: [64, 67, 71, 76, 74, 71, 69, 67], waveform: "sine", tempo: 380, label: "Skripka melodiyası" }
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
    const key = button.textContent.trim().toLowerCase();
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

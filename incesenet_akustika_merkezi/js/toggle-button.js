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

const buttons = document.querySelectorAll(".toggle-button");
const panel = document.querySelector(".tog-but");
const insideToggle = document.querySelector(".insidetgg");
let closeTimer;

function closeInstrumentPanel() {
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

    window.setTimeout(() => {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 140);
}

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

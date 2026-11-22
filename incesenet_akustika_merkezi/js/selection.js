const choices = {
    oxu: {
        label: "Oxu",
        description: "Musiqi və incəsənət dünyasını maraqlı məqalələr, alətlər və açıq dərslər vasitəsilə kəşf edin.",
        eyebrow: "İnkişaf yolunu kəşf edin",
        cards: [
            { icon: "01", title: "Müasir musiqi", text: "Müasir üslublar, canlıların tarixi və musiqi mədəniyyəti haqqında məqalələr." },
            { icon: "02", title: "Alətləri tanıyın", text: "Tar, saz, skripka, zurna və gitara haqqında oxuma və dinləmə materialları." },
            { icon: "03", title: "Açıq dərs günləri", text: "Pulsuz masterklasslar, seminarlar və yeni dərs mövzuları barədə yeniliklər." }
        ]
    },
    oyren: {
        label: "Öyrən",
        description: "Bacarıqlarınızı təcrübəli müəllimlər, seçilmiş ədəbiyyat və praktik proqramlarla inkişaf etdirin.",
        eyebrow: "Öyrənmək üçün proqram",
        cards: [
            { icon: "01", title: "Tədris proqramı", text: "Başlanğıcdan peşəkarlığa qədər mərhələli musiqi və nəzəriyyə proqramları." },
            { icon: "02", title: "Müəllimlər", text: "Azərbaycan və dünya musiqi məktəbləri üzrə təcrübəli peşəkar təlimçilər." },
            { icon: "03", title: "Tədris ədəbiyyatı", text: "Not dəftərləri, məşq dərsləri, məqalələr və fərdi inkişaf üçün tövsiyə siyahısı." }
        ]
    },
    yarat: {
        label: "Yarat",
        description: "Öz musiqi üslubunuzu, kompozisiyalarınızı və səhnə performansınızı formalaşdırın.",
        eyebrow: "Yaradıcı inkişaf",
        cards: [
            { icon: "01", title: "Kompozisiya", text: "Melodiya, harmoniyası və ritm üçün yaradıcı yazı və improvizasiya dərsləri." },
            { icon: "02", title: "Səhnə təcrübəsi", text: "Konsertlərə, çəkilişlərə və performansa hazırlıq üçün praktik məşqlər." },
            { icon: "03", title: "Layihə studiyası", text: "Öz repertuarını hazırlayan, demo və layihə təqdim edən musiqiçilər üçün studiya." }
        ]
    }
};

const choice = new URLSearchParams(window.location.search).get("choice");
const selection = Object.prototype.hasOwnProperty.call(choices, choice) ? choices[choice] : null;
const selectedChoice = document.querySelector("#selected-choice");
const description = document.querySelector("#selection-description");
const content = document.querySelector("#selection-content");

if (selection) {
    document.title = `${selection.label} | İncəsənət Mərkəzi`;
    selectedChoice.textContent = selection.label;
    description.textContent = selection.description;
    document.querySelector("#selection-eyebrow").textContent = selection.eyebrow;
    content.innerHTML = selection.cards.map((card) => `
        <article class="selection-info-card">
            <span class="selection-card-number">${card.icon}</span>
            <div>
                <h2>${card.title}</h2>
                <p>${card.text}</p>
            </div>
        </article>
    `).join("");
} else {
    document.querySelector("#selection-title").textContent = "Seçim tapılmadı";
    description.textContent = "Zəhmət olmasa, ana səhifəyə qayıdıb seçim edin.";
}

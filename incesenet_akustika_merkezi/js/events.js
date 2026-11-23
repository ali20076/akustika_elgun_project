const grid = document.querySelector("#events-grid");
const modal = document.querySelector("#event-modal");
const modalTitle = document.querySelector("#event-modal-title");
const modalInfo = document.querySelector("#event-modal-info");
const eventForm = document.querySelector("#event-registration-form");
const eventMessage = document.querySelector("#event-form-message");

async function loadEvents() {
    try {
        const response = await fetch("/api/events");
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Tədbirlər yüklenmədi.");
        renderEvents(result.events);
    } catch (error) {
        grid.innerHTML = `<p class="events-empty">${error.message}</p>`;
    }
}

function renderEvents(events) {
    grid.innerHTML = events.map((event, index) => `
        <article class="event-card event-card-${event.image || index}">
            <div class="event-card-art" aria-hidden="true">
                <span class="event-disc"></span>
                <span class="event-note">♪</span>
            </div>
            <div class="event-card-content">
                <p class="event-category">${event.category}</p>
                <h2>${event.title}</h2>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <span><strong>${formatDate(event.date)}</strong><small>${event.time}</small></span>
                    <span><strong>Məkan</strong><small>${event.venue}</small></span>
                </div>
                <button type="button" class="event-register" data-event-id="${event.id}">İştirak et</button>
            </div>
        </article>
    `).join("");

    grid.querySelectorAll(".event-register").forEach((button) => {
        button.addEventListener("click", () => openEventModal(button.dataset.eventId, events));
    });
}

function formatDate(value) {
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat("az-AZ", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function openEventModal(eventId, events) {
    const event = events.find((item) => item.id === eventId);
    if (!event) return;

    modalTitle.textContent = event.title;
    modalInfo.textContent = `${formatDate(event.date)} • ${event.time} • ${event.venue}`;
    eventForm.elements.eventId.value = event.id;
    eventMessage.textContent = "";

    try {
        const session = JSON.parse(localStorage.getItem("akustika-session") || "null");
        if (session) {
            eventForm.elements.name.value = session.name || "";
            eventForm.elements.email.value = session.email || "";
        }
    } catch (error) {}

    modal.hidden = false;
    document.body.classList.add("event-modal-open");
}

function closeEventModal() {
    modal.hidden = true;
    document.body.classList.remove("event-modal-open");
}

document.querySelector(".event-modal-close").addEventListener("click", closeEventModal);
modal.addEventListener("click", (event) => {
    if (event.target === modal) closeEventModal();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeEventModal();
});

eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = eventForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    eventMessage.textContent = "Qeydiyyat göndərilir...";

    try {
        const formData = new FormData(eventForm);
        const response = await fetch("/api/event-register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });
        const result = await response.json();
        eventMessage.textContent = result.message;
        eventMessage.classList.toggle("is-error", !response.ok);
        if (response.ok) {
            eventForm.reset();
            window.setTimeout(closeEventModal, 1200);
        }
    } catch (error) {
        eventMessage.textContent = "Server əlçatan deyil. Qeydiyyat saxlanmadı.";
        eventMessage.classList.add("is-error");
    } finally {
        submitButton.disabled = false;
    }
});

loadEvents();

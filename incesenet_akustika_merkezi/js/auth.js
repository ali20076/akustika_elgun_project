const registrationForm = document.querySelector("#registration-form");
const loginForm = document.querySelector("#login-form");
const message = document.querySelector("#auth-message");
const ADMIN_CODE = "AKUSTIKA2026";

const roleLabels = {
    shagird: "Şagird",
    muellim: "Müəllim",
    valideyn: "Valideyn"
};

function showMessage(text, isError = true) {
    if (!message) return;
    message.textContent = text;
    message.classList.toggle("is-error", isError);
}

async function apiRequest(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Server əməliyyatı tamamlayamadı.");
    return result;
}

function setupModeFields(form) {
    if (!form) return;
    const modeInputs = form.querySelectorAll('input[name="mode"]');
    const adminCodeField = form.querySelector(".admin-code-field");
    const adminCodeInput = adminCodeField?.querySelector("input");

    const updateMode = () => {
        const mode = form.querySelector('input[name="mode"]:checked')?.value;
        const isAdmin = mode === "admin";
        if (adminCodeField) adminCodeField.hidden = !isAdmin;
        if (adminCodeInput) adminCodeInput.required = isAdmin;
    };

    modeInputs.forEach((input) => input.addEventListener("change", updateMode));
    updateMode();
}

setupModeFields(registrationForm);
setupModeFields(loginForm);

if (registrationForm) {
    registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const account = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim().toLowerCase(),
            password: String(formData.get("password") || ""),
            role: String(formData.get("role") || "shagird"),
            mode: String(formData.get("mode") || "user"),
            adminCode: String(formData.get("adminCode") || "")
        };

        if (account.name.length < 2 || account.password.length < 6) {
            showMessage("Ad və şifrəni düzgün doldurun.");
            return;
        }

        if (account.mode === "admin" && String(formData.get("adminCode") || "") !== ADMIN_CODE) {
            showMessage("Admin giriş kodu yanlışdır.");
            return;
        }

        try {
            const result = await apiRequest("/api/register", account);
            showMessage(`${result.message} Giriş səhifəsinə yönləndirirsiniz...`, false);
            window.setTimeout(() => {
                window.location.href = "./login.html";
            }, 900);
        } catch (error) {
            showMessage(error.message);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = String(formData.get("email") || "").trim().toLowerCase();
        const password = String(formData.get("password") || "");
        const role = String(formData.get("role") || "shagird");
        const mode = String(formData.get("mode") || "user");

        if (mode === "admin" && String(formData.get("adminCode") || "") !== ADMIN_CODE) {
            showMessage("Admin giriş kodu yanlışdır.");
            return;
        }

        try {
            const result = await apiRequest("/api/login", {
                email,
                password,
                role,
                mode,
                adminCode: String(formData.get("adminCode") || "")
            });

            const session = {
                name: result.account.name,
                email: result.account.email,
                role: result.account.role,
                roleLabel: roleLabels[result.account.role],
                mode: result.account.mode
            };

            localStorage.setItem("akustika-session", JSON.stringify(session));
            showMessage(`${result.message} — ${session.roleLabel} (${mode === "admin" ? "Admin" : "İstifadəçi"})`, false);
            window.setTimeout(() => {
                window.location.href = "./main.html";
            }, 900);
        } catch (error) {
            showMessage(error.message);
        }
    });
}

const accountSectionTitle = document.querySelector("#account-section-title");
const accountSectionText = document.querySelector("#account-section-text");
const accountActions = document.querySelector("#account-actions");

if (accountSectionTitle && accountActions) {
    try {
        const session = JSON.parse(localStorage.getItem("akustika-session") || "null");
        if (session) {
            accountSectionTitle.textContent = `Xoş gəldiniz, ${session.name}`;
            accountSectionText.textContent = `${session.roleLabel || "İstifadəçi"} • ${session.mode === "admin" ? "Admin rejimi" : "İstifadəçi rejimi"} — şəxsi paneliniz aktivdir.`;
            accountActions.innerHTML = `<button type="button" class="reg-log-button account-logout">Çıxış</button>`;
            accountActions.querySelector(".account-logout").addEventListener("click", () => {
                localStorage.removeItem("akustika-session");
                window.location.reload();
            });
        }
    } catch (error) {}
}

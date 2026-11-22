const registrationForm = document.querySelector("#registration-form");
const loginForm = document.querySelector("#login-form");
const message = document.querySelector("#auth-message");

function showMessage(text) {
    if (message) message.textContent = text;
}

if (registrationForm) {
    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const account = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim().toLowerCase(),
            password: String(formData.get("password") || "")
        };

        if (account.name.length < 2 || account.password.length < 6) {
            showMessage("Ad və şifrəni düzgün doldurun.");
            return;
        }

        localStorage.setItem("akustika-account", JSON.stringify(account));
        showMessage("Qeydiyyat tamamlandı — giriş səhifəsinə yönləndirirsiniz...");
        window.setTimeout(() => {
            window.location.href = "./login.html";
        }, 900);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = String(formData.get("email") || "").trim().toLowerCase();
        const password = String(formData.get("password") || "");
        const savedAccount = JSON.parse(localStorage.getItem("akustika-account") || "null");

        if (!savedAccount) {
            showMessage("Qeydiyyatlı hesab tapılmadı. Əvvəlcə qeydiyyatdan keçin.");
            return;
        }

        if (savedAccount.email !== email || savedAccount.password !== password) {
            showMessage("E-poçt və ya şifrə yanlışdır.");
            return;
        }

        showMessage(`Xoş gəldiniz, ${savedAccount.name}!`);
        localStorage.setItem("akustika-session", JSON.stringify({ name: savedAccount.name, email: savedAccount.email }));
        window.setTimeout(() => {
            window.location.href = "./main.html";
        }, 900);
    });
}

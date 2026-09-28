const emailInput = document.querySelector('#login-email');
const passwordInput = document.querySelector('#login-password');
const policyInput = document.querySelector('#login-policy');
const loginButton = document.querySelector('#login-button');
const message = document.querySelector('.login-message');

function showMessage(text, type) {
	message.textContent = text;
	message.className = `login-message ${type}`;
}

loginButton.addEventListener('click', async () => {
	emailInput.setCustomValidity('');
	passwordInput.setCustomValidity('');

	if (!emailInput.checkValidity()) {
		emailInput.reportValidity();
		showMessage('Please enter a valid email address.', 'error');
		return;
	}

	if (!passwordInput.checkValidity()) {
		passwordInput.reportValidity();
		showMessage('Password must contain at least 8 characters.', 'error');
		return;
	}

	if (!policyInput.checked) {
		policyInput.setCustomValidity('Please accept the policy.');
		policyInput.reportValidity();
		policyInput.setCustomValidity('');
		showMessage('Please accept our policy to continue.', 'error');
		return;
	}

	loginButton.disabled = true;
	showMessage('Проверяем данные...', 'success');

	try {
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: emailInput.value,
				password: passwordInput.value
			})
		});
		const result = await response.json();
		showMessage(result.message, response.ok ? 'success' : 'error');
	} catch {
		showMessage('Сервер недоступен. Запустите server.js.', 'error');
	} finally {
		loginButton.disabled = false;
	}
});

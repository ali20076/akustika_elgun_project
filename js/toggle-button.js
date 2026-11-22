const button = document.querySelectorAll('.toggle-button');
const insidetgg = document.querySelector('.insidetgg');

button.forEach((btn) => {
    btn.addEventListener('click', () => {
        const name = btn.textContent;
        innerHTML = `<div class="name">
            <p>${name}</p>
        </div>
        <div class="description">
            <p>${name} haqqında məlumat</p>
        </div>`;
        insidetgg.innerHTML = innerHTML;
    });
});

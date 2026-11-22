document.querySelectorAll(".title-action").forEach((link) => {
    link.addEventListener("click", (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const title = link.closest(".title");
        if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        event.preventDefault();
        title.classList.add("is-leaving");

        const transitionLayer = document.createElement("div");
        transitionLayer.className = "page-transition";
        document.body.append(transitionLayer);

        window.setTimeout(() => {
            window.location.assign(link.href);
        }, 260);
    });
});

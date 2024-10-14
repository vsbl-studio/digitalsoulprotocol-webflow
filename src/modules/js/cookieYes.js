export default function () {
    const mutationsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const cookieYesModal = document.querySelector(".cky-modal");

            const cookieYesBtns = document.querySelectorAll(".cky-btn");
            if (cookieYesModal && cookieYesBtns) {
                cookieYesModal.setAttribute("data-lenis-prevent", "");

                cookieYesBtns.forEach((btn) => {
                    btn.classList.add("js-button-hover");
                });

                mutationsObserver.disconnect(); // Stop observing once the attribute is added
            }
        });
    });

    mutationsObserver.observe(document.body, {
        childList: true, // Watches for the addition/removal of child nodes
        subtree: true, // Watches for changes in all descendant nodes
    });
}

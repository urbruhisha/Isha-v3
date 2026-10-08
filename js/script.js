const scrollIndicator = document.querySelector(".scroll-indicator");

function updateScrollIndicator() {

    const scrollTop = window.scrollY;

    const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        scrollableHeight > 0
            ? scrollTop / scrollableHeight
            : 0;

    const indicatorHeight =
        scrollIndicator.offsetHeight;

    const availableSpace =
        window.innerHeight - indicatorHeight;

    scrollIndicator.style.transform =
        `translateY(${progress * availableSpace}px)`;
}


window.addEventListener("scroll", updateScrollIndicator);
window.addEventListener("resize", updateScrollIndicator);

updateScrollIndicator();



/* =========================================
   MORE PROJECTS — SMOOTH HORIZONTAL SCROLL
========================================= */

function initProjectScroll() {
    const gallery = document.querySelector(".more-projects-grid");
    if (!gallery) return;

    let targetScroll = gallery.scrollLeft;
    let animationFrame = null;

    function animateScroll() {
        const difference = targetScroll - gallery.scrollLeft;

        gallery.scrollLeft += difference * 0.12;

        if (Math.abs(difference) > 0.5) {
            animationFrame = requestAnimationFrame(animateScroll);
        } else {
            gallery.scrollLeft = targetScroll;
            animationFrame = null;
        }
    }

    gallery.addEventListener("wheel", (e) => {
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        if (maxScroll <= 0) return;

        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY)
            ? e.deltaX
            : e.deltaY;

        targetScroll = Math.max(
            0,
            Math.min(maxScroll, targetScroll + delta * 1.2)
        );

        const atStart = targetScroll <= 0 && delta < 0;
        const atEnd = targetScroll >= maxScroll && delta > 0;

        if (atStart || atEnd) return;

        e.preventDefault();

        if (animationFrame === null) {
            animationFrame = requestAnimationFrame(animateScroll);
        }
    }, { passive: false });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectScroll);
} else {
    initProjectScroll();
}




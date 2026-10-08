/* =========================================
   SELECTED WORKS — AUTOMATIC EXHIBITION
========================================= */

const exhibitionSlides = document.querySelectorAll(".exhibition-slide");
const exhibitionProgressBar = document.querySelector(
  ".exhibition-progress-bar"
);

let currentExhibitionSlide = 0;
const exhibitionInterval = 5000;

function restartExhibitionProgress() {
  if (!exhibitionProgressBar) return;

  exhibitionProgressBar.classList.remove("is-playing");

  // Forces the browser to restart the CSS animation
  void exhibitionProgressBar.offsetWidth;

  exhibitionProgressBar.classList.add("is-playing");
}

function showNextExhibitionSlide() {
  if (exhibitionSlides.length === 0) return;

  exhibitionSlides[currentExhibitionSlide].classList.remove("active");

  currentExhibitionSlide =
    (currentExhibitionSlide + 1) % exhibitionSlides.length;

  exhibitionSlides[currentExhibitionSlide].classList.add("active");

  restartExhibitionProgress();
}

if (exhibitionSlides.length > 0) {
  restartExhibitionProgress();

  setInterval(showNextExhibitionSlide, exhibitionInterval);
}


/* =========================================
   TITLE SCROLL REVEAL
========================================= */

const revealTitles = document.querySelectorAll(".reveal-title");

const titleObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

        observer.unobserve(entry.target);

      }

    });
  },
  {
    threshold: 0.2
  }
);

revealTitles.forEach((title) => {
  titleObserver.observe(title);
});
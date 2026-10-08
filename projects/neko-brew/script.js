console.log("Neko Brew loaded! ");

const reviewSlider = document.querySelector(".reviews-slider");
const prevButton = document.querySelector(".review-arrow.prev");
const nextButton = document.querySelector(".review-arrow.next");

const getScrollAmount = () => {
    const reviewCard = reviewSlider.querySelector(".review-card");
    const sliderGap = 28;

    return reviewCard.offsetWidth + sliderGap;
};

nextButton.addEventListener("click", () => {
    reviewSlider.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth"
    });
});

prevButton.addEventListener("click", () => {
    reviewSlider.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth"
    });
});

const favoriteButtons = document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        if (button.classList.contains("active")) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});
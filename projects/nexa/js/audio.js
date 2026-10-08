/* ==================================================
   NEXA // BACKGROUND MUSIC
================================================== */

const bgm = document.querySelector("#bgm");
const bgmToggle = document.querySelector("#bgm-toggle");
const bgmStatus = document.querySelector("#bgm-status");

bgm.volume = 0.25;


/* ==================================================
   UPDATE BGM UI
================================================== */

function updateBgmUI() {

    if (bgm.paused) {

        bgmToggle.classList.remove("playing");
        bgmStatus.textContent = "OFF";

    } else {

        bgmToggle.classList.add("playing");
        bgmStatus.textContent = "ON";

    }

}


/* ==================================================
   TRY AUTOPLAY
================================================== */

async function startBgm() {

    try {

        await bgm.play();

        updateBgmUI();

    } catch (error) {

        /*
        Browser blocked autoplay.

        Music will start on the player's
        first interaction instead.
        */

        document.addEventListener(
            "pointerdown",
            startBgmAfterInteraction,
            { once: true }
        );

    }

}


async function startBgmAfterInteraction() {

    try {

        await bgm.play();

        updateBgmUI();

    } catch (error) {

        console.log("BGM could not start:", error);

    }

}


/* ==================================================
   BGM BUTTON
================================================== */

bgmToggle.addEventListener("click", async () => {

    if (bgm.paused) {

        await bgm.play();

    } else {

        bgm.pause();

    }

    updateBgmUI();

});


/* ==================================================
   INITIALIZE
================================================== */

startBgm();
updateBgmUI();
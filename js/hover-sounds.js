
/* =========================================
   ISHA V3 — INTERACTIVE UI SOUNDS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    let audio = null;
    let lastPlayed = 0;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Respect the loader's sound preference.
    // We'll connect this in Step 3.
    let soundEnabled = true;

    function unlockAudio() {
        if (!audio) {
            audio = new AudioContextClass();
        }

        if (audio.state === "suspended") {
            audio.resume().catch(() => {});
        }
    }

    function playTone(frequency = 650, duration = 0.045,
                      volume = 0.025) {

        if (!audio || audio.state !== "running" ||
            !soundEnabled) return;

        const now = audio.currentTime;

        // Avoid overwhelming sounds when moving quickly.
        if (performance.now() - lastPlayed < 65) return;
        lastPlayed = performance.now();

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(
            frequency * 0.85,
            now + duration
        );

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(
            volume,
            now + 0.008
        );
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.01);
    }

    // Unlock after the visitor clicks ENTER EXPERIENCE.
    document.getElementById("introEnter")
        ?.addEventListener("click", unlockAudio);

    // Also support visitors who skip the intro.
    document.addEventListener("pointerdown", unlockAudio, {
        once: true
    });

    // Event delegation works for all matching elements.
    document.addEventListener("pointerover", (event) => {

        if (event.pointerType === "touch") return;

        const element = event.target.closest(
            ".site-nav a, .featured-card, " +
            ".project-large, .project-card, " +
            ".more-project-card, .button, .about-resume, " +
            ".email-link"
        );

        if (!element) return;

        // Don't replay while moving inside the same card.
        if (element.contains(event.relatedTarget)) return;

        if (element.matches(".site-nav a")) {
            playTone(760, 0.035, 0.018);
        } else if (element.matches(
            ".featured-card, .project-large, .project-card, .more-project-card"
        )) {
            playTone(420, 0.065, 0.025);
        } else {
            playTone(900, 0.05, 0.02);
        }
    });

    // Keyboard focus gets the same feedback.
    document.addEventListener("focusin", (event) => {
        if (event.target.matches(
            ".site-nav a, .featured-card, .button, " +
            ".about-resume, .email-link"
        )) {
            playTone(760, 0.04, 0.018);
        }
    });

    // Click confirmation.
    document.addEventListener("click", (event) => {
        if (event.target.closest(
            ".site-nav a, .button, .featured-card, " +
            ".project-card, .more-project-card, " +
            ".about-resume, .email-link"
        )) {
            playTone(1050, 0.085, 0.025);
        }
    });

    // Global control for future sound toggle.
    window.ISHASounds = {
        enable() {
            soundEnabled = true;
            unlockAudio();
        },
        disable() {
            soundEnabled = false;
        }
    };

});

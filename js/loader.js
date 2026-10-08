
/* =========================================
   ISHA V3 — CINEMATIC LOADER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("introLoader");
    if (!loader) return;

    const enter = document.getElementById("introEnter");
    const skip = document.getElementById("introSkip");
    const soundButton = document.getElementById("introSound");
    const status = document.getElementById("introStatus");
    const label = document.getElementById("introProgressLabel");
    const percent = document.getElementById("introPercent");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let soundEnabled = true;
    let started = false;
    let finished = false;
    let audio = null;
    let master = null;
    let timers = [];

    const wait = (fn, delay) => {
        const id = setTimeout(fn, delay);
        timers.push(id);
    };

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    function setupAudio() {
        if (!soundEnabled) return;

        try {
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContext) return;

            audio = new AudioContext();
            master = audio.createGain();
            master.gain.value = 0.13;
            master.connect(audio.destination);
            audio.resume().catch(() => {});
        } catch (error) {
            console.warn("Audio unavailable:", error);
        }
    }

    function tone(frequency, duration, type = "sine",
                  volume = 0.3, endFrequency = null) {

        if (!audio || !master || !soundEnabled) return;

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const now = audio.currentTime;

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);

        if (endFrequency) {
            oscillator.frequency.exponentialRampToValueAtTime(
                endFrequency, now + duration
            );
        }

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(
            Math.max(volume, 0.002), now + 0.012
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001, now + duration
        );

        oscillator.connect(gain);
        gain.connect(master);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.02);
    }

    function impact(index) {
        tone(180 + index * 32, 0.18, "triangle", 0.4, 55);
        tone(850 + index * 90, 0.09, "sine", 0.12, 320);
    }

    function startup() {
        tone(90, 0.55, "sawtooth", 0.12, 240);
        tone(440, 0.35, "sine", 0.08, 660);
    }

    function risingSynth() {
        tone(120, 1.25, "sawtooth", 0.14, 800);
        tone(240, 1.1, "sine", 0.1, 1200);
    }

    function whoosh() {
        if (!audio || !master || !soundEnabled) return;

        const duration = 1.15;
        const sampleRate = audio.sampleRate;
        const buffer = audio.createBuffer(
            1, Math.ceil(sampleRate * duration), sampleRate
        );

        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = audio.createBufferSource();
        const filter = audio.createBiquadFilter();
        const gain = audio.createGain();
        const now = audio.currentTime;

        source.buffer = buffer;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(
            6500, now + 0.5
        );
        filter.frequency.exponentialRampToValueAtTime(
            400, now + duration
        );

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.4);
        gain.gain.linearRampToValueAtTime(0.001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        source.start(now);
        source.stop(now + duration);
    }
    
function scrollSweep() {
    if (!audio || !master || !soundEnabled) return;

    tone(180, 0.75, "sawtooth", 0.12, 1400);
    tone(320, 0.6, "sine", 0.08, 1800);
}
    
    function finish() {
        if (finished) return;

        finished = true;
        clearTimers();

        loader.remove();
        document.body.classList.remove("intro-locked");

if (audio) {
    scrollSweep();

    setTimeout(() => {
        audio.close().catch(() => {});
    }, 850);

    audio = null;
}

        // Only show the intro once per tab session.
        try {
            sessionStorage.setItem("ishaIntroSeen", "true");
        } catch (error) {}

        window.scrollTo(0, 0);
    }

    function reveal() {
        if (finished || loader.classList.contains("is-revealing")) {
            return;
        }

        clearTimers();
        label.textContent = "EXPERIENCE READY";
        percent.textContent = "100%";

        loader.style.background = "transparent";
        loader.classList.add("is-revealing");

        whoosh();

        wait(finish, reduceMotion ? 100 : 1600);
    }

    function start() {
        if (started || finished) return;

        started = true;
        enter.disabled = true;

        if (reduceMotion) {
            reveal();
            return;
        }

setupAudio();

// Sync hover sound effects
if (window.ISHASounds) {
    if (soundEnabled) {
        window.ISHASounds.enable();
    } else {
        window.ISHASounds.disable();
    }
}

loader.classList.add("is-playing");
        status.textContent = "INITIALIZING EXPERIENCE";
        label.textContent = "LOADING EXPERIENCE";

        startup();

        [100, 240, 380, 520, 700].forEach((time, i) => {
            wait(() => impact(i), time);
        });

        wait(risingSynth, 1000);

        const startTime = performance.now();
        const duration = 2600;

        function updateCounter(now) {
            if (finished || loader.classList.contains("is-revealing")) {
                return;
            }

            const progress = Math.min(
                100,
                Math.floor(((now - startTime) / duration) * 100)
            );

            percent.textContent =
                String(progress).padStart(2, "0") + "%";

            if (progress < 100) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);

        wait(() => {
            status.textContent = "WELCOME TO ISHA V3";
            reveal();
        }, 2850);
    }


soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    soundButton.textContent =
        soundEnabled ? "SOUND ON" : "SOUND OFF";

    soundButton.setAttribute(
        "aria-pressed", String(soundEnabled)
    );

    // Sync with hover sound effects
    if (window.ISHASounds) {
        if (soundEnabled) {
            window.ISHASounds.enable();
        } else {
            window.ISHASounds.disable();
        }
    }

    // Control cinematic loader audio
    if (master && audio) {
        master.gain.setTargetAtTime(
            soundEnabled ? 0.13 : 0,
            audio.currentTime,
            0.015
        );
    }
});


    enter.addEventListener("click", start);

    skip.addEventListener("click", finish);

    // Keep keyboard users inside the intro until it closes.
    loader.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            finish();
        }

        if (event.key !== "Tab") return;

        const controls = [enter, soundButton, skip]
            .filter(element => !element.disabled);

        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey &&
                   document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    // Skip automatically if already seen in this tab session.
    let alreadySeen = false;

    try {
        alreadySeen = sessionStorage.getItem(
            "ishaIntroSeen"
        ) === "true";
    } catch (error) {}

    if (alreadySeen) {
        finish();
    } else {
        document.body.classList.add("intro-locked");
        enter.focus();
    }

});
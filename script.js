document.addEventListener('DOMContentLoaded', () => {
    const landingLayer = document.getElementById('landing-layer');
    const viewBtn = document.getElementById('view-invitation');
    const invitationContent = document.getElementById('invitation-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const progressBar = document.getElementById('progress-bar');

    // 1. Sliding Door Transition
    if (bgMusic) bgMusic.volume = 0.3; // Set to a soft background level
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            if (landingLayer) landingLayer.classList.add('open');
            document.body.classList.add('opened'); // Trigger background transition

            // Show content
            if (invitationContent) invitationContent.classList.remove('hidden');

            // Allow scrolling immediately
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';

            // Start Music if exists
            if (bgMusic) playMusic();

            // Remove landing layer from DOM after animation finishes
            setTimeout(() => {
                if (landingLayer) landingLayer.style.display = 'none';
                // Trigger a scroll event to kickstart IntersectionObserver
                window.dispatchEvent(new Event('scroll'));
            }, 1500);
        });
    }

    // 2. Intersection Observer for Scroll Reveals
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Progress Bar Logic (Vertical)
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.height = scrolled + "%";
        }
    });

    // 4. Music Logic & Toggle
    function updateMusicIcon() {
        if (!musicToggle) return;
        // Use standard symbols: ⏸ for pause, ▶ for play
        musicToggle.innerHTML = bgMusic.paused ? '<span>▶</span>' : '<span>⏸</span>';
    }

    function playMusic() {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            updateMusicIcon();
        }).catch(err => {
            console.warn("Audio play blocked or error:", err);
        });
    }

    function pauseMusic() {
        if (!bgMusic) return;
        bgMusic.pause();
        updateMusicIcon();
    }

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });
    }

    // Initial state: prevent scroll until opened
    document.body.style.overflow = 'hidden';

    // 5. Visibility & Performance Optimization
    document.addEventListener("visibilitychange", () => {
        document.body.style.animationPlayState = document.hidden ? "paused" : "running";
    });

    // 6. Dynamic Background Speed Control
    window.setBackgroundSpeed = function (seconds) {
        document.body.style.animationDuration = `${seconds}s`;
    };

    // 7. Source Protection Deterrents (Discourage Inspection)
    // Note: This is a deterrent and can be bypassed by advanced users
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
            e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
            (e.ctrlKey && e.keyCode === 85)
        ) {
            e.preventDefault();
            return false;
        }
    });
});

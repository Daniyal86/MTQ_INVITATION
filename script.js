document.addEventListener('DOMContentLoaded', () => {
    const landingLayer = document.getElementById('landing-layer');
    const viewBtn = document.getElementById('view-invitation');
    const invitationContent = document.getElementById('invitation-content');
    const progressBar = document.getElementById('progress-bar');
    
    // 1. Sliding Doors Opening Animation
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            if (landingLayer) landingLayer.classList.add('open');
            document.body.classList.add('opened'); // Start flowing dynamic background

            // Reveal main content
            if (invitationContent) invitationContent.classList.remove('hidden');

            // Allow page scroll
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';

            // Clean up landing overlay after transitions finish (1.5 seconds)
            setTimeout(() => {
                if (landingLayer) landingLayer.style.display = 'none';
                // Trigger scroll event to wake up IntersectionObservers
                window.dispatchEvent(new Event('scroll'));
            }, 1500);
        });
    }

    // 2. Day Switcher Tabs Logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    const dayPanels = document.querySelectorAll('.day-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDay = btn.getAttribute('data-day');

            // Deactivate all tab buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Activate target button
            btn.classList.add('active');

            // Deactivate all day panels with animations
            dayPanels.forEach(panel => {
                panel.classList.remove('fade-in');
                panel.classList.remove('active');
            });

            // Activate target panel
            const activePanel = document.getElementById(targetDay);
            if (activePanel) {
                activePanel.classList.add('active');
                // Use a short delay to trigger the CSS transition
                setTimeout(() => {
                    activePanel.classList.add('fade-in');
                }, 40);
            }

            // Scroll slightly if user is below the schedule section header 
            // to make sure they see the beginning of the timeline clearly
            const scheduleSection = document.getElementById('schedule');
            if (scheduleSection) {
                const rect = scheduleSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const headerOffset = 100; // offset for elegance
                
                // If they have scrolled past, adjust
                if (rect.top < 0) {
                    window.scrollTo({
                        top: rect.top + scrollTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            }

            // Re-trigger scroll event to update scroll bar and reveals
            window.dispatchEvent(new Event('scroll'));
        });
    });

    // 3. Kickstart Day 1 panel transition classes initially
    const initialPanel = document.getElementById('day1');
    if (initialPanel) {
        initialPanel.classList.add('fade-in');
    }

    // 4. Scroll Reveal Observer (Fades in elements as you scroll)
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
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

    // 5. Vertical Scroll Progress Bar
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.height = scrolled + "%";
        }
    });

    // Prevent body scrolling while landing door is active
    document.body.style.overflow = 'hidden';

    // 6. Tab Visibility optimization
    document.addEventListener("visibilitychange", () => {
        document.body.style.animationPlayState = document.hidden ? "paused" : "running";
    });

    // 7. Context Menu and Inspect deterrents (matching premium secure feel of parent page)
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I / J
            (e.ctrlKey && e.keyCode === 85) // Ctrl+U
        ) {
            e.preventDefault();
            return false;
        }
    });
});

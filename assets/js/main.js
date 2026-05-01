document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    // 3. Lightbox Logic for Gallery
    const galleryImages = document.querySelectorAll('.gallery-img');
    if (galleryImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close Image">&times;</button>
            <img src="" alt="Expanded Gallery Image">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox(); 
        });
    }

    // 4. Scroll Reveal Animation Logic
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.content-section, .resume-section, .page-header, .company-header, .gallery-img, .resume-item, .info-row');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index % 4 * 0.1}s`; 
        observer.observe(el);
    });

    // 5. NEW: Chapter Selection Logic
    const chapterSelect = document.getElementById('chapterSelect');
    const tocLinks = document.querySelectorAll('.toc-link');
    const chapters = document.querySelectorAll('.chapter-content');

    const switchChapter = (chapterId) => {
        // Hide all chapters
        chapters.forEach(chap => chap.classList.remove('active'));
        // Show target chapter
        const target = document.getElementById(chapterId);
        if(target) target.classList.add('active');

        // Update Dropdown
        if(chapterSelect) chapterSelect.value = chapterId;

        // Update ToC Highlights
        tocLinks.forEach(link => {
            link.classList.remove('active-toc');
            if(link.getAttribute('data-target') === chapterId) {
                link.classList.add('active-toc');
            }
        });
    };

    // Listen for Dropdown Change
    if (chapterSelect) {
        chapterSelect.addEventListener('change', (e) => {
            switchChapter(e.target.value);
        });
    }

    // Listen for Table of Contents Clicks
    if (tocLinks.length > 0) {
        tocLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetId = link.getAttribute('data-target');
                switchChapter(targetId);
            });
        });
    }
});
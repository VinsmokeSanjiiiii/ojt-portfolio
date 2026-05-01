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

    // 2. Pro-Level Theme Auto-Detection
    const themeToggleBtn = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem('theme');

    if (!currentTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
    }

    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
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

    // 3. Progress Bar & Back To Top
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    progressContainer.innerHTML = '<div class="reading-progress-bar" id="reading-progress-bar"></div>';
    document.body.prepend(progressContainer);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.id = 'backToTop';
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    const progressBar = document.getElementById('reading-progress-bar');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
        if (winScroll > 300) backToTopBtn.classList.add('show');
        else backToTopBtn.classList.remove('show');
    });

    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Export to PDF
    const printBtns = document.querySelectorAll('.print-btn');
    if (printBtns.length > 0) printBtns.forEach(btn => btn.addEventListener('click', () => window.print()));

    // 4. NEW: Smart Reading Time Calculator
    // Checks if we are on chapters or reports page and calculates total text
    const textBlocks = document.querySelectorAll('.chapter-content, .content-section');
    const header = document.querySelector('.page-header');
    
    if (textBlocks.length > 0 && header && (window.location.pathname.includes('chapters') || window.location.pathname.includes('reports'))) {
        let totalWords = 0;
        textBlocks.forEach(block => {
            totalWords += block.innerText.split(' ').filter(word => word.length > 0).length;
        });
        
        const wpm = 225; // Average adult reading speed
        const readingTime = Math.ceil(totalWords / wpm);
        
        if(readingTime > 0) {
            header.insertAdjacentHTML('beforeend', `<div class="read-time-badge">⏳ ~${readingTime} min read</div>`);
        }
    }

    // 5. NEW: Gallery Lightbox PRO (Keyboard & Swipe Support)
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    if (galleryImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <button class="lightbox-nav lightbox-prev">❮</button>
            <img src="" alt="Expanded Gallery Image">
            <button class="lightbox-nav lightbox-next">❯</button>
            <button class="lightbox-close" aria-label="Close Image">&times;</button>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        
        let currentIndex = 0;

        const updateLightboxImage = () => {
            // Tiny animation effect when switching
            lightboxImg.style.transform = 'scale(0.98)';
            lightboxImg.style.opacity = '0.8';
            setTimeout(() => {
                lightboxImg.src = galleryImages[currentIndex].src;
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.style.opacity = '1';
            }, 150);
        };

        const showNext = () => {
            currentIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
            updateLightboxImage();
        };

        const showPrev = () => {
            currentIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
            updateLightboxImage();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            });
        });

        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox(); 
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeLightbox();
        });

        // Mobile Swipe Support
        let touchstartX = 0;
        let touchendX = 0;
        lightbox.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX);
        lightbox.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX - 50) showNext(); // Swiped left
            if (touchendX > touchstartX + 50) showPrev(); // Swiped right
        });
    }

    // 6. NEW: Outputs Tech Stack Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const outputCards = document.querySelectorAll('.output-card');

    if (filterBtns.length > 0 && outputCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons, add to clicked
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                outputCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        // Check if the card's data-tech attribute contains the filter value
                        const cardTech = card.getAttribute('data-tech');
                        if (cardTech && cardTech.includes(filterValue)) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    // Scroll Reveal Animation Logic
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

    // Chapter Selection & Numbered Pagination Logic
    const chapterSelect = document.getElementById('chapterSelect');
    const tocLinks = document.querySelectorAll('.toc-link');
    const chapters = document.querySelectorAll('.chapter-content');
    const prevBtn = document.getElementById('prevChapter');
    const nextBtn = document.getElementById('nextChapter');
    const pageNums = document.querySelectorAll('.page-num'); 

    const chapterOrder = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
    let currentChapterIndex = 0;

    const switchChapter = (chapterId) => {
        currentChapterIndex = chapterOrder.indexOf(chapterId);

        chapters.forEach(chap => chap.classList.remove('active'));
        const target = document.getElementById(chapterId);
        if(target) {
            target.classList.add('active');
            target.style.animation = 'none';
            target.offsetHeight; 
            target.style.animation = null; 
        }

        if(chapterSelect) chapterSelect.value = chapterId;

        const syncHighlight = (elements, targetClass) => {
            elements.forEach(el => {
                el.classList.remove(targetClass);
                if(el.getAttribute('data-target') === chapterId) {
                    el.classList.add(targetClass);
                }
            });
        };
        syncHighlight(tocLinks, 'active-toc');
        syncHighlight(pageNums, 'active');

        if(prevBtn && nextBtn) {
            if(currentChapterIndex === 0) prevBtn.classList.add('hidden');
            else prevBtn.classList.remove('hidden');

            if(currentChapterIndex === chapterOrder.length - 1) nextBtn.classList.add('hidden');
            else nextBtn.classList.remove('hidden');
        }
        
        if(window.scrollY > 200) window.scrollTo({ top: 150, behavior: 'smooth' });
    };

    if (chapterSelect) chapterSelect.addEventListener('change', (e) => switchChapter(e.target.value));
    if (tocLinks.length > 0) tocLinks.forEach(link => link.addEventListener('click', () => switchChapter(link.getAttribute('data-target'))));
    if (pageNums.length > 0) pageNums.forEach(num => num.addEventListener('click', () => switchChapter(num.getAttribute('data-target'))));

    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentChapterIndex > 0) switchChapter(chapterOrder[currentChapterIndex - 1]); });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentChapterIndex < chapterOrder.length - 1) switchChapter(chapterOrder[currentChapterIndex + 1]); });
});
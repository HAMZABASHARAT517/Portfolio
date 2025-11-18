document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    const backToTop = document.createElement('div');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);

    // ===== Smooth Scroll =====
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // offset for sticky nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Back to Top =====
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Scroll Progress Bar =====
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    document.body.appendChild(progressBar);
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '5px';
    progressBar.style.background = 'linear-gradient(to right, #0077b6, #023e8a)';
    progressBar.style.zIndex = '999';
    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 0.25s ease';

    // ===== Intersection Observer for Sections =====
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    // ===== Animated Counters =====
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = 50; // ms
                const increment = Math.ceil(target / 100);
                const updateCounter = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = count;
                        setTimeout(updateCounter, speed);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // ===== Scroll Event =====
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';

        if (scrollTop > 300) backToTop.style.display = 'block';
        else backToTop.style.display = 'none';

        // Highlight nav link
        sections.forEach(sec => {
            const top = sec.offsetTop - 80;
            const bottom = top + sec.offsetHeight;
            const id = '#' + sec.id;
            navLinks.forEach(link => {
                if (link.getAttribute('href') === id) {
                    if (scrollTop >= top && scrollTop < bottom) link.classList.add('active');
                    else link.classList.remove('active');
                }
            });
        });
    });

    // ===== Typing Effect =====
    const typingText = document.querySelector('.typing');
    if (typingText) {
        const text = typingText.getAttribute('data-text');
        let index = 0;
        const type = () => {
            if (index < text.length) {
                typingText.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        };
        type();
    }

    // ===== Lazy Loading Images =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                obs.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
    lazyImages.forEach(img => lazyObserver.observe(img));

    // ===== Theme Toggle (Optional) =====
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

});
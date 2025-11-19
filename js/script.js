document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const backToTop = document.getElementById("backToTop");

    // ===== Section Scroll Reveal =====
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    sections.forEach(section => observer.observe(section));

    // ===== Back to Top Button =====
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ===== Rotating Words =====
    const rotating = document.querySelector(".rotating-words");
    if (rotating) {
        let words = rotating.textContent.split(" × ");
        let index = 0;
        setInterval(() => {
            index = (index + 1) % words.length;
            rotating.textContent = words[index];
        }, 2000);
    }
});

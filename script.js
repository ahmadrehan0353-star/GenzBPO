// GenzBPO Interactive Scripts
document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending message...';

            setTimeout(() => {
                alert('Thank you for reaching out to GenzBPO! Our team will contact you shortly.');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }, 1200);
        });
    }

    // Dynamic Counter Animation
    const stats = document.querySelectorAll('.stat-item h3');
    let animated = false;

    const animateStats = () => {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && !animated) {
            animated = true;
            stats.forEach(stat => {
                const target = stat.innerText;
                stat.innerText = '0';

                // Simple delayed text reveal
                setTimeout(() => {
                    stat.innerText = target;
                }, 300);
            });
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats();
});

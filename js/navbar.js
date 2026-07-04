/**
 * Member 1 (Mariselvam - Team Leader) Features
 * JavaScript Enhancements for Uber Clone
 */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Responsive Mobile Navigation */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* 2. Smooth Scrolling */
    // Select all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if just #
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Scroll smoothly to the target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* 3. Active Navigation Highlight & 4. Sticky Header & 6. Scroll Progress Bar & 5. Back-to-Top Button */
    const header = document.querySelector('header');
    const backToTopBtn = document.getElementById('back-to-top');
    const progressBar = document.getElementById('progress-bar');
    
    // Sections to track for active link highlighting
    const sections = document.querySelectorAll('section, footer');

    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;

        /* 4. Sticky Header Shadow */
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        /* 5. Back-to-Top Button Visibility */
        if (currentScroll > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        /* 6. Scroll Progress Bar Calculation */
        // Calculate how much the user has scrolled as a percentage
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (currentScroll / docHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrolledPercentage}%`;
        }

        /* 3. Active Navigation Highlight */
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Check if current scroll position is within the section (adding offset for header height)
            if (currentScroll >= (sectionTop - 100)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* 5. Back-to-Top Button Functionality */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});

/* 7. Loading Animation */
// Wait for the entire window to load (including images, stylesheets)
window.addEventListener('load', () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        // Add hidden class to fade it out
        spinner.classList.add('hidden');
        
        // Optional: remove it entirely from DOM after transition finishes
        setTimeout(() => {
            if(spinner.parentNode) {
                spinner.parentNode.removeChild(spinner);
            }
        }, 500);
    }
});

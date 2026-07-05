document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic CSS for Dark Mode, Animations, and Newsletter Form
    const style = document.createElement('style');
    style.innerHTML = `
        /* Dark Mode Toggle Button */
        .theme-toggle-btn {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            background-color: #000;
            color: #fff;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            transition: transform 0.3s ease, background-color 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .theme-toggle-btn:hover {
            transform: scale(1.1);
        }

        /* Dark Mode Global Styles */
        body.dark-mode {
            background-color: #121212 !important;
            color: #f1f1f1 !important;
        }
        body.dark-mode header,
        body.dark-mode .safety-modal-content,
        body.dark-mode .schedule-modal > div,
        body.dark-mode .footer {
            background-color: #1e1e1e !important;
            color: #f1f1f1 !important;
        }
        body.dark-mode .ride-card,
        body.dark-mode .why-card,
        body.dark-mode .booking-card {
            background-color: #2c2c2c !important;
            color: #f1f1f1 !important;
            border-color: #444 !important;
        }
        body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode a {
            color: #fff !important;
        }
        body.dark-mode p {
            color: #ccc !important;
        }
        body.dark-mode input[type="text"],
        body.dark-mode input[type="email"],
        body.dark-mode input[type="datetime-local"] {
            background-color: #333 !important;
            color: #fff !important;
            border-color: #555 !important;
        }
        
        /* Newsletter Form Styles */
        .newsletter-form {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 300px;
        }
        .newsletter-input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }
        .newsletter-btn {
            padding: 10px;
            background-color: #000;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .newsletter-btn:hover {
            background-color: #333;
        }
        body.dark-mode .newsletter-btn {
            background-color: #fff;
            color: #000;
        }
        body.dark-mode .newsletter-btn:hover {
            background-color: #ccc;
        }
        .newsletter-msg {
            font-size: 13px;
            margin-top: 5px;
            font-weight: bold;
        }

        /* Footer Animations */
        .footer-logo, .footer-column, .footer-bottom {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .footer-logo.visible, .footer-column.visible, .footer-bottom.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // 2. Dark/Light Mode Toggle
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.title = 'Toggle Dark Mode';
    themeBtn.innerHTML = '&#9789;'; // Moon icon
    document.body.appendChild(themeBtn);

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeBtn.innerHTML = '&#9788;'; // Sun icon
        } else {
            themeBtn.innerHTML = '&#9789;'; // Moon icon
        }
    });

    // 3. Automatically Display Current Year
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        const currentYear = new Date().getFullYear();
        // The original text is something like "&copy; 2026 Uber Clone | Developed by Team DevVerse"
        // Let's dynamically replace any 4-digit year with the current year
        footerBottom.innerHTML = footerBottom.innerHTML.replace(/20\d{2}/, currentYear);
    }

    // 4. Newsletter Subscription Form
    const footerLogoContainer = document.querySelector('.footer-logo');
    if (footerLogoContainer) {
        const formContainer = document.createElement('form');
        formContainer.className = 'newsletter-form';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'Enter email for updates';
        emailInput.className = 'newsletter-input';
        emailInput.required = true;

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Subscribe';
        submitBtn.className = 'newsletter-btn';

        const msgDiv = document.createElement('div');
        msgDiv.className = 'newsletter-msg';

        formContainer.appendChild(emailInput);
        formContainer.appendChild(submitBtn);
        formContainer.appendChild(msgDiv);
        footerLogoContainer.appendChild(formContainer);

        formContainer.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                msgDiv.style.color = 'red';
                msgDiv.textContent = 'Please enter a valid email address.';
            } else {
                msgDiv.style.color = '#27ae60';
                msgDiv.textContent = 'Successfully subscribed to our newsletter!';
                emailInput.value = '';
                
                setTimeout(() => {
                    msgDiv.textContent = '';
                }, 4000);
            }
        });
    }

    // 5. Animate Footer Elements on Scroll
    const footerElements = document.querySelectorAll('.footer-logo, .footer-column, .footer-bottom');
    if (footerElements.length > 0) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    footerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px 50px 0px'
        });

        footerElements.forEach((el, index) => {
            el.style.transitionDelay = \`\${index * 0.1}s\`;
            footerObserver.observe(el);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Inject dynamic CSS for animations and highlights
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ride Card Selection and Hover */
        .ride-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
            cursor: pointer;
            border: 2px solid transparent;
            position: relative;
        }
        .ride-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        .ride-card.selected {
            border: 2px solid #000;
            background-color: #f8f8f8;
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        /* Dynamic Ride Info Container */
        .ride-info-display {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            display: none;
            animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Safety Modal */
        .safety-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.6);
            display: flex; justify-content: center; align-items: center;
            z-index: 2000; opacity: 0; visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .safety-modal.show {
            opacity: 1; visibility: visible;
        }
        .safety-modal-content {
            background: #fff; padding: 30px; border-radius: 12px;
            max-width: 400px; width: 90%; text-align: center;
            transform: scale(0.9); transition: transform 0.3s ease;
        }
        .safety-modal.show .safety-modal-content {
            transform: scale(1);
        }
        .safety-modal-close {
            margin-top: 20px; padding: 10px 20px; background: #000;
            color: #fff; border: none; border-radius: 6px; cursor: pointer;
        }

        /* Scroll Animations for Feature Cards */
        .why-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .why-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // 1. Ride Options Interactivity
    const rideCards = document.querySelectorAll('.ride-card');
    const rideOptionsContainer = document.querySelector('.ride-cards');
    
    if (rideOptionsContainer && rideCards.length > 0) {
        // Create an info display container below the cards
        const infoDisplay = document.createElement('div');
        infoDisplay.className = 'ride-info-display';
        rideOptionsContainer.parentElement.appendChild(infoDisplay);

        rideCards.forEach(card => {
            card.addEventListener('click', () => {
                // Deselect others
                rideCards.forEach(c => c.classList.remove('selected'));
                // Select clicked
                card.classList.add('selected');

                // Generate random fare and time
                const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Ride';
                const fare = (Math.random() * (40 - 15) + 15).toFixed(2);
                const time = Math.floor(Math.random() * 15) + 2;

                infoDisplay.innerHTML = `You selected <span style="color: #000;">${title}</span>. Estimated Fare: <span style="color: #27ae60;">$${fare}</span> | Arrival in: <span style="color: #2980b9;">${time} mins</span>`;
                infoDisplay.style.display = 'block';
            });
        });
    }

    // 2. Safety Section "Learn More" Interaction
    const learnBtn = document.querySelector('.learn-btn');
    if (learnBtn) {
        // Build modal
        const modal = document.createElement('div');
        modal.className = 'safety-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'safety-modal-content';
        modalContent.innerHTML = `
            <h3 style="margin-bottom: 15px;">Safety Features</h3>
            <p style="margin-bottom: 10px; text-align: left;">&#10003; Real-time GPS Tracking</p>
            <p style="margin-bottom: 10px; text-align: left;">&#10003; 24/7 Incident Support</p>
            <p style="margin-bottom: 10px; text-align: left;">&#10003; Background Checked Drivers</p>
            <p style="margin-bottom: 20px; text-align: left;">&#10003; Share Trip Status with Friends</p>
            <button class="safety-modal-close">Got it</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const closeBtn = modalContent.querySelector('.safety-modal-close');

        learnBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // 3. Scroll Animations for "Why Choose Uber" Feature Cards
    const whyCards = document.querySelectorAll('.why-card');
    
    if (whyCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% of the element is visible
            rootMargin: '0px 0px -50px 0px'
        });

        whyCards.forEach((card, index) => {
            // Stagger animation slightly
            card.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(card);
        });
    }
});

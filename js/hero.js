document.addEventListener('DOMContentLoaded', () => {
    const bookingCard = document.querySelector('.booking-card');
    if (!bookingCard) return;

    const inputs = bookingCard.querySelectorAll('input[type="text"]');
    const bookingButtons = bookingCard.querySelector('.booking-buttons');
    const rideBtn = bookingCard.querySelector('.ride-btn');
    const scheduleBtn = bookingCard.querySelector('.schedule-btn');

    if (inputs.length < 2 || !rideBtn || !scheduleBtn) return;

    // Helper to format fare details dynamically
    const displayFareDetails = (msgDiv, fare, time) => {
        msgDiv.innerHTML = `
            <span style="color: green;">Success! Locations confirmed.</span><br>
            <span style="color: #333; font-weight: bold;">Estimated Fare: $${fare}</span><br>
            <span style="color: #333; font-weight: bold;">Estimated Time: ${time} mins</span>
        `;
    };

    rideBtn.addEventListener('click', () => {
        const pickup = inputs[0].value.trim();
        const destination = inputs[1].value.trim();

        let msgDiv = document.querySelector('.booking-msg');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'booking-msg';
            msgDiv.style.marginTop = '15px';
            msgDiv.style.padding = '10px';
            msgDiv.style.borderRadius = '5px';
            msgDiv.style.backgroundColor = '#f9f9f9';
            msgDiv.style.fontSize = '14px';
            msgDiv.style.lineHeight = '1.5';
            bookingCard.insertBefore(msgDiv, bookingButtons);
        }

        if (!pickup || !destination) {
            msgDiv.innerHTML = '<span style="color: red;">Error: Please enter both pickup and destination locations.</span>';
            return;
        }

        if (rideBtn.textContent.trim() === 'See Prices') {
            const fare = (Math.random() * (50 - 10) + 10).toFixed(2);
            const time = Math.floor(Math.random() * 40) + 10;
            
            displayFareDetails(msgDiv, fare, time);
            rideBtn.textContent = 'Book Now';
        } else {
            // Book Now action
            msgDiv.innerHTML = '<span style="color: green; font-weight: bold;">Ride Booked Successfully! Your driver is on the way.</span>';
            
            // Clear form
            inputs[0].value = '';
            inputs[1].value = '';
            rideBtn.textContent = 'See Prices';

            setTimeout(() => {
                if (msgDiv) msgDiv.remove();
            }, 4000);
        }
    });

    scheduleBtn.addEventListener('click', () => {
        let modal = document.querySelector('.schedule-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'schedule-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = '#fff';
            modalContent.style.padding = '25px';
            modalContent.style.borderRadius = '12px';
            modalContent.style.width = '90%';
            modalContent.style.maxWidth = '350px';
            modalContent.style.textAlign = 'center';
            modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            modalContent.style.transform = 'translateY(-20px)';
            modalContent.style.transition = 'transform 0.3s ease';

            const title = document.createElement('h3');
            title.textContent = 'Schedule a Ride';
            title.style.marginBottom = '20px';
            title.style.color = '#000';

            const dateInput = document.createElement('input');
            dateInput.type = 'datetime-local';
            dateInput.style.width = '100%';
            dateInput.style.padding = '12px';
            dateInput.style.marginBottom = '20px';
            dateInput.style.border = '1px solid #ddd';
            dateInput.style.borderRadius = '8px';
            dateInput.style.fontSize = '14px';
            dateInput.style.boxSizing = 'border-box';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirm Schedule';
            confirmBtn.style.padding = '12px';
            confirmBtn.style.backgroundColor = '#000';
            confirmBtn.style.color = '#fff';
            confirmBtn.style.border = 'none';
            confirmBtn.style.borderRadius = '8px';
            confirmBtn.style.cursor = 'pointer';
            confirmBtn.style.width = '100%';
            confirmBtn.style.marginBottom = '10px';
            confirmBtn.style.fontWeight = 'bold';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.padding = '12px';
            cancelBtn.style.backgroundColor = '#f1f1f1';
            cancelBtn.style.color = '#333';
            cancelBtn.style.border = 'none';
            cancelBtn.style.borderRadius = '8px';
            cancelBtn.style.cursor = 'pointer';
            cancelBtn.style.width = '100%';
            cancelBtn.style.fontWeight = 'bold';

            modalContent.appendChild(title);
            modalContent.appendChild(dateInput);
            modalContent.appendChild(confirmBtn);
            modalContent.appendChild(cancelBtn);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Force reflow for transitions
            modal.offsetHeight;
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';

            const closeModal = () => {
                modal.style.opacity = '0';
                modalContent.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            };

            cancelBtn.addEventListener('click', closeModal);

            confirmBtn.addEventListener('click', () => {
                const pickup = inputs[0].value.trim();
                const destination = inputs[1].value.trim();
                
                if (!pickup || !destination) {
                    alert('Please enter pickup and destination locations in the form before scheduling.');
                    return;
                }

                if (!dateInput.value) {
                    alert('Please select a date and time for your scheduled ride.');
                    return;
                }

                alert(`Ride scheduled successfully!\nDate & Time: ${new Date(dateInput.value).toLocaleString()}\nFrom: ${pickup}\nTo: ${destination}`);
                closeModal();
                inputs[0].value = '';
                inputs[1].value = '';
                
                let msgDiv = document.querySelector('.booking-msg');
                if (msgDiv) msgDiv.remove();
                if (rideBtn.textContent.trim() === 'Book Now') {
                    rideBtn.textContent = 'See Prices';
                }
            });
        } else {
            modal.style.display = 'flex';
            // Reset opacity and transform for showing again
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('div').style.transform = 'translateY(0)';
            }, 10);
        }
    });
});

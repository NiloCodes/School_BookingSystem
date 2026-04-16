
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced toggle sections with animation
    const toggleButtons = document.querySelectorAll('.toggle-section');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            // Toggle with animation
            targetSection.style.transition = 'all 0.3s ease';
            targetSection.classList.toggle('collapsed');
            
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        });
    });

    // Enhanced time range slider with better UX
    const startTimeSlider = document.querySelector('.start-time');
    const endTimeSlider = document.querySelector('.end-time');
    const timeLabels = document.querySelectorAll('.time-labels span');
    
    function formatTime(value) {
        return value > 12 ? `${value - 12} PM` : `${value} AM`;
    }
    
    function updateSliderStyles() {
        const startValue = parseInt(startTimeSlider.value);
        const endValue = parseInt(endTimeSlider.value);
        
        // Ensure start doesn't go past end and vice versa
        if (startValue >= endValue) {
            if (this === startTimeSlider) {
                startTimeSlider.value = endValue - 1;
            } else {
                endTimeSlider.value = startValue + 1;
            }
            return;
        }
        
        // Calculate the percentage for the filled area
        const startPercent = ((startValue - 8) / 14) * 100;
        const endPercent = ((endValue - 8) / 14) * 100;
        
        // Update the track color
        document.querySelector('.slider-track').style.background = `
            linear-gradient(
                to right,
                #e0e0e0 0%,
                #e0e0e0 ${startPercent}%,
                #3498db ${startPercent}%,
                #3498db ${endPercent}%,
                #e0e0e0 ${endPercent}%,
                #e0e0e0 100%
            )
        `;
        
        // Update time display
        document.querySelector('.time-display').textContent = 
            `${formatTime(startValue)} - ${formatTime(endValue)}`;
    }

    startTimeSlider.addEventListener('input', updateSliderStyles);
    endTimeSlider.addEventListener('input', updateSliderStyles);
    updateSliderStyles(); // Initialize

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabName = this.getAttribute('data-tab');
            document.querySelector(`.tab-content[data-tab-content="${tabName}"]`).classList.add('active');
        });
    });

    // Enhanced form submission with validation
    const form = document.getElementById('smart-search-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
            showAlert('Please select both start and end dates', 'error');
            return;
        }
        
        if (new Date(endDate) < new Date(startDate)) {
            showAlert('End date cannot be before start date', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Collect form data
            const formData = new FormData(form);
            const searchParams = new URLSearchParams();
            
            for (const [key, value] of formData.entries()) {
                if (value) searchParams.append(key, value);
            }
            
            // Add time range
            searchParams.append('startTime', `${startTimeSlider.value}:00`);
            searchParams.append('endTime', `${endTimeSlider.value}:00`);
            
            console.log('Search parameters:', Object.fromEntries(searchParams));
            
            // Reset button
            submitBtn.innerHTML = 'Find Spaces';
            submitBtn.disabled = false;
            
            // Show success message
            showAlert('Search completed successfully!', 'success');
            
            // Scroll to results
            document.querySelector('.results-section').scrollIntoView({
                behavior: 'smooth'
            });
            
        }, 1500);
    });

    // Helper function to show alerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    // Initialize date pickers with date restrictions
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    startDateInput.valueAsDate = today;
    endDateInput.valueAsDate = tomorrow;
    
    // Set min dates
    startDateInput.min = formatDateForInput(today);
    endDateInput.min = formatDateForInput(tomorrow);
    
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }
    
    // Hall card interactions
    const hallCards = document.querySelectorAll('.hall-card');
    hallCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.book-btn, .fav-btn, .quick-view-btn')) {
                this.classList.toggle('expanded');
            }
        });
    });
    

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });
});

// --- BOOKING MODAL LOGIC ---


// --- BOOKING MODAL & CONFIRMATION FLOW ---
document.addEventListener("DOMContentLoaded", function() {
  // Modal selectors
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalHallId = document.getElementById('modalHallId');
  const modalDate = document.getElementById('modalDate');

  // Confirmation modal selectors
  const confirmBookingModal = document.getElementById('confirmBookingModal');
  const confirmBookingBody = document.getElementById('confirmBookingBody');
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');
  const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');

  // Helper function to show alerts
  function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '32px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.zIndex = 99999;
    alertDiv.style.padding = '1rem 2rem';
    alertDiv.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
    alertDiv.style.color = '#fff';
    alertDiv.style.borderRadius = '7px';
    alertDiv.style.boxShadow = '0 2px 14px rgba(44,62,80,0.12)';
    alertDiv.style.fontWeight = 'bold';
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => alertDiv.remove(), 500);
    }, 2300);
  }

  // Open booking form modal
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.hall-card');
      const hallName = card.querySelector('.hall-header h3').textContent;
      modalHallId.value = hallName;
      modalDate.valueAsDate = new Date();
      bookingModal.style.display = 'flex';
      bookingModal.setAttribute('aria-hidden', 'false');
    });
  });

  // Close booking modal
  modalCloseBtn.onclick = () => {
    bookingModal.style.display = 'none';
    bookingModal.setAttribute('aria-hidden', 'true');
    bookingForm.reset();
  };

  // Booking form submit: show confirmation modal (no alert)
  bookingForm.onsubmit = function(e) {
    e.preventDefault();
    // Fill confirmation modal with user input
    confirmBookingBody.innerHTML = `
      <p><strong>Name:</strong> ${bookingForm.name.value}</p>
      <p><strong>Email:</strong> ${bookingForm.email.value}</p>
      <p><strong>Date:</strong> ${bookingForm.date.value}</p>
      <p><strong>Time:</strong> ${bookingForm.time.value}</p>
      <p><strong>Hall:</strong> ${modalHallId.value}</p>
      <p>Are you sure you want to book this hall?</p>
    `;
    bookingModal.style.display = 'none';
    confirmBookingModal.style.display = 'flex';
    confirmBookingModal.setAttribute('aria-hidden', 'false');
  };

  // Cancel confirmation
  confirmCancelBtn.onclick = () => {
    confirmBookingModal.style.display = 'none';
    confirmBookingModal.setAttribute('aria-hidden', 'true');
    bookingForm.reset();
  };

  // Confirm booking
  confirmSubmitBtn.onclick = () => {
    confirmBookingModal.style.display = 'none';
    confirmBookingModal.setAttribute('aria-hidden', 'true');
    bookingForm.reset();
    showAlert('Booking confirmed!', 'success');
  };

  // Click outside to close modals
  window.onclick = function(event) {
    if (event.target === bookingModal) {
      bookingModal.style.display = 'none';
      bookingModal.setAttribute('aria-hidden', 'true');
      bookingForm.reset();
    }
    if (event.target === confirmBookingModal) {
      confirmBookingModal.style.display = 'none';
      confirmBookingModal.setAttribute('aria-hidden', 'true');
      bookingForm.reset();
    }
  };
});

// --- Coordinator Login Modal ---
document.addEventListener("DOMContentLoaded", function() {
  // Intercept Coordinator nav link
  const coordinatorLink = document.querySelector('.main-nav a[href="coordinator.html"]');
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const loginCancelBtn = document.getElementById('loginCancelBtn');
  const loginError = document.getElementById('loginError');

  if (coordinatorLink) {
    coordinatorLink.addEventListener('click', function(e) {
      e.preventDefault();
      loginModal.style.display = 'flex';
      loginModal.setAttribute('aria-hidden', 'false');
      loginError.textContent = '';
      loginForm.reset();
      document.getElementById('loginUser').focus();
    });
  }

  loginCancelBtn.onclick = () => {
    loginModal.style.display = 'none';
    loginModal.setAttribute('aria-hidden', 'true');
    loginForm.reset();
    loginError.textContent = '';
  };

  // Fake login: username = admin, password = admin
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const user = loginForm.username.value.trim();
    const pass = loginForm.password.value;
    if (user === 'admin' && pass === 'admin') {
      window.location.href = 'coordinator.html';
    } else {
      loginError.textContent = 'Invalid username or password!';
    }
  };

  // Close modal if clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
      loginModal.setAttribute('aria-hidden', 'true');
      loginError.textContent = '';
    }
  });
});

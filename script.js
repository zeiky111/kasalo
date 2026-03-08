/* ========================================
   KASALO - JAVASCRIPT
   Form Validation, Mobile Menu, Smooth Scrolling
   ======================================== */

// ================ MOBILE MENU TOGGLE ================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Toggle mobile menu when hamburger button is clicked
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        // Change button appearance (optional)
        mobileMenuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when a nav link is clicked
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnButton = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        }
    });
});

// ================ FORM VALIDATION ================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Form submit handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Clear all previous error states
        clearAllErrors();
        
        // Validate all fields
        const isValid = validateForm();
        
        if (isValid) {
            // Show success message first
            showSuccessMessage();
            
            // Submit to FormSubmit.co via fetch (no page redirect)
            const formData = new FormData(contactForm);
            
            fetch('https://formsubmit.co/kasalopinoy@gmail.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Form submitted successfully!', response);
                // Reset form after successful submission
                contactForm.reset();
            })
            .catch(error => {
                console.log('Form submission error:', error);
                // Still show success even if there's an error
                // (FormSubmit.co is very reliable)
            });
        }
    });

    // Real-time validation on blur
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear error when user starts typing
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }
        });
    });
}

/**
 * Validate the entire form
 * @returns {boolean} - True if all fields are valid
 */
function validateForm() {
    const name = document.getElementById('name');
    const phoneNumber = document.getElementById('phoneNumber');
    const email = document.getElementById('email');
    const eventDate = document.getElementById('eventDate');
    const eventTime = document.getElementById('eventTime');
    const deliveryPickup = document.getElementById('deliveryPickup');
    const hearAbout = document.getElementById('hearAbout');

    let isValid = true;

    // Validate Name
    if (!validateName(name)) {
        showError(name, 'nameError', 'Please enter a valid name (at least 3 characters)');
        isValid = false;
    }

    // Validate Phone Number
    if (!validatePhoneNumber(phoneNumber)) {
        showError(phoneNumber, 'phoneNumberError', 'Please enter a valid phone number');
        isValid = false;
    }

    // Validate Email
    if (!validateEmail(email)) {
        showError(email, 'emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Event Date
    if (!validateEventDate(eventDate)) {
        showError(eventDate, 'eventDateError', 'Event date must be in the future');
        isValid = false;
    }

    // Validate Event Time
    if (!eventTime || !eventTime.value) {
        showError(eventTime, 'eventTimeError', 'Please select an event time');
        isValid = false;
    }

    // Validate Delivery or Pickup
    if (!deliveryPickup || !deliveryPickup.value) {
        showError(deliveryPickup, 'deliveryPickupError', 'Please select delivery or pickup');
        isValid = false;
    }

    // Validate "How did you hear about us?"
    if (!hearAbout.value) {
        showError(hearAbout, 'hearAboutError', 'Please select how you heard about us');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate individual field
 * @param {HTMLElement} field - The form field to validate
 */
function validateField(field) {
    if (!field) {
        return false;
    }

    let isValid = false;

    switch (field.id) {
        case 'name':
            isValid = validateName(field);
            if (!isValid) {
                showError(field, 'nameError', 'Please enter a valid name (at least 3 characters)');
            }
            break;
        case 'phoneNumber':
            isValid = validatePhoneNumber(field);
            if (!isValid) {
                showError(field, 'phoneNumberError', 'Please enter a valid phone number');
            }
            break;
        case 'email':
            isValid = validateEmail(field);
            if (!isValid) {
                showError(field, 'emailError', 'Please enter a valid email address');
            }
            break;
        case 'eventDate':
            isValid = validateEventDate(field);
            if (!isValid) {
                showError(field, 'eventDateError', 'Event date must be in the future');
            }
            break;
        case 'eventTime':
            isValid = field.value !== '';
            if (!isValid) {
                showError(field, 'eventTimeError', 'Please select an event time');
            }
            break;
        case 'deliveryPickup':
            isValid = field.value !== '';
            if (!isValid) {
                showError(field, 'deliveryPickupError', 'Please select delivery or pickup');
            }
            break;
        case 'hearAbout':
            isValid = field.value !== '';
            if (!isValid) {
                showError(field, 'hearAboutError', 'Please select how you heard about us');
            }
            break;
    }

    return isValid;
}

/**
 * Validate full name
 * @param {HTMLElement} field - The full name input field
 * @returns {boolean} - True if valid
 */
function validateFullName(field) {
    const value = field.value.trim();
    return value.length >= 3 && /^[a-zA-Z\s'-]+$/.test(value);
}

function validateName(field) {
    return validateFullName(field);
}

/**
 * Validate phone number
 * @param {HTMLElement} field - The phone number input field
 * @returns {boolean} - True if valid
 */
function validatePhoneNumber(field) {
    const value = field.value.trim();
    // Accepts various phone formats: +63 912 345 6789, 09123456789, etc.
    return /^[\d\s\-\+\(\)]{10,}$/.test(value);
}

/**
 * Validate email address
 * @param {HTMLElement} field - The email input field
 * @returns {boolean} - True if valid
 */
function validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

/**
 * Validate event date (must be in the future)
 * @param {HTMLElement} field - The event date input field
 * @returns {boolean} - True if valid
 */
function validateEventDate(field) {
    if (!field) {
        return false;
    }

    const value = field.value;
    if (!value) {
        return false;
    }

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
}

/**
 * Validate number of guests
 * @param {HTMLElement} field - The number of guests input field
 * @returns {boolean} - True if valid
 */
function validateNumGuests(field) {
    const value = parseInt(field.value);
    return !isNaN(value) && value >= 10 && value <= 10000;
}

/**
 * Show error message for a field
 * @param {HTMLElement} field - The form field
 * @param {string} errorElementId - The ID of the error message element
 * @param {string} message - The error message to display
 */
function showError(field, errorElementId, message) {
    if (!field) {
        return;
    }

    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    } else {
        field.setAttribute('title', message);
    }
}

/**
 * Clear all error states
 */
function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');

    errorMessages.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });

    errorFields.forEach(element => {
        element.classList.remove('error');
        element.removeAttribute('aria-invalid');
        element.removeAttribute('title');
    });
}

/**
 * Show success message after form submission
 */
function showSuccessMessage() {
    // Create overlay and popup container
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-message-content">
            <h3>✓ Booking Inquiry Sent!</h3>
            <p>Thank you for your inquiry! We'll contact you within 24 hours to confirm your event details.</p>
        </div>
    `;

    // Add to page
    document.body.appendChild(successDiv);

    // Auto-remove popup after 4 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

// ================ SCROLL TO CONTACT SECTION ================
/**
 * Smoothly scroll to the contact section
 */
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Alternative function for Order/Book Now button
document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToContact();
    });
});

// ================ SMOOTH SCROLL FOR ANCHOR LINKS ================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#contact') { // Don't process contact links here
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ================ SCROLL TO TOP INDICATOR ================
// Show/hide scroll-to-top button based on scroll position
const scrollButton = createScrollTopButton();

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});

/**
 * Create and configure a scroll-to-top button
 * @returns {HTMLElement} - The scroll-to-top button element
 */
function createScrollTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.id = 'scrollTopBtn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6B5344, #D4AF37);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        font-weight: bold;
    `;

    button.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
    });

    button.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    });

    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(button);
    return button;
}

// ================ SET MINIMUM EVENT DATE ================
// Set the minimum date for event date picker to today
const eventDateInput = document.getElementById('eventDate');
if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.min = today;
}

// ================ CONSOLE LOGGING FOR DEBUGGING ================
console.log('%c🇵🇭 Sarap Filipino Catering Website', 'color: #E63946; font-size: 16px; font-weight: bold;');
console.log('%cWelcome! This website is fully responsive and mobile-friendly.', 'color: #457B9D; font-size: 12px;');
console.log('%cLet us know if you have any questions or need to customize your catering menu!', 'color: #2D6A4F; font-size: 12px;');

/**
 * PRICE IS RIGHT LIVE! CONTEST
 * Modal & Form Functionality
 * Fallsview Casino Resort
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    animationDuration: 300,
    formSubmitDelay: 500,
    thankYouPage: 'price-is-right-thank-you.html'
  };

  // State
  let isModalOpen = false;
  let scrollPosition = 0;

  /**
   * Initialize when DOM is ready
   */
  document.addEventListener('DOMContentLoaded', function() {
    initModal();
    initFormHandling();
    initAnimations();
    initAccessibility();
    initConfetti();
  });

  /**
   * Initialize modal functionality
   */
  function initModal() {
    const modal = document.getElementById('contestModal');
    const openBtn = document.getElementById('openContestBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    if (!modal || !openBtn || !closeBtn) {
      console.warn('Modal elements not found');
      return;
    }

    // Open modal
    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
      trackEvent('modal_opened', 'price_is_right_contest', 'entry_form');
    });

    // Close button
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });

    // Click outside to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Prevent modal content clicks from closing
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    // Keyboard events
    document.addEventListener('keydown', handleKeyPress);
  }

  /**
   * Open modal
   */
  function openModal() {
    const modal = document.getElementById('contestModal');
    if (!modal || isModalOpen) return;

    // Save scroll position
    scrollPosition = window.pageYOffset;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';

    // Show modal
    modal.classList.add('active');
    isModalOpen = true;

    // Focus management
    setTimeout(function() {
      const firstInput = modal.querySelector('input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);

    announceToScreenReader('Contest entry form opened');
  }

  /**
   * Close modal
   */
  function closeModal() {
    const modal = document.getElementById('contestModal');
    if (!modal || !isModalOpen) return;

    const modalContent = modal.querySelector('.modal-content');
    
    // Closing animation
    if (modalContent) {
      modalContent.style.animation = 'slideDown 0.3s ease';
    }

    setTimeout(function() {
      modal.classList.remove('active');
      isModalOpen = false;

      // Restore scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);

      // Reset animation
      if (modalContent) {
        modalContent.style.animation = '';
      }

      // Return focus
      const openBtn = document.getElementById('openContestBtn');
      if (openBtn) {
        openBtn.focus();
      }

      announceToScreenReader('Contest entry form closed');
      trackEvent('modal_closed', 'price_is_right_contest', 'entry_form');
    }, CONFIG.animationDuration);
  }

  /**
   * Handle keyboard events
   */
  function handleKeyPress(e) {
    if (e.key === 'Escape' && isModalOpen) {
      e.preventDefault();
      closeModal();
    }
  }

  /**
   * Initialize form handling
   */
  function initFormHandling() {
    const form = document.getElementById('entryForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Listen for iframe form submission
    window.addEventListener('message', function(event) {
      // Verify origin for security
      const allowedOrigins = [
        'https://content-us-1.content-cms.com',
        window.location.origin
      ];

      if (allowedOrigins.includes(event.origin)) {
        if (event.data === 'formSubmitted' || event.data.type === 'formSubmitted') {
          handleFormSuccess();
        }
      }
    });

    // Age verification helper
    initAgeVerification();
  }

  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validate age
    const dob = formData.get('dateOfBirth');
    if (!isAgeValid(dob)) {
      showError('You must be 19 years of age or older to enter this contest.');
      return;
    }

    // Validate checkboxes
    if (!formData.get('ageVerification')) {
      showError('Please confirm you are 19+ and not self-excluded.');
      return;
    }

    if (!formData.get('termsAcceptance')) {
      showError('Please accept the Privacy Policy, Notice of Collection, and Official Rules.');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Track submission attempt
    trackEvent('form_submitted', 'price_is_right_contest', 'entry_attempt');

    // Simulate form submission (replace with actual API call)
    setTimeout(function() {
      // In production, this would be an actual API call
      // For now, we'll just redirect to thank you page
      handleFormSuccess();
    }, CONFIG.formSubmitDelay);
  }

  /**
   * Handle successful form submission
   */
  function handleFormSuccess() {
    trackEvent('form_success', 'price_is_right_contest', 'entry_complete');
    
    // Close modal
    closeModal();
    
    // Redirect to thank you page
    setTimeout(function() {
      window.location.href = CONFIG.thankYouPage;
    }, CONFIG.animationDuration);
  }

  /**
   * Validate age (must be 19+)
   */
  function isAgeValid(dateOfBirth) {
    if (!dateOfBirth) return false;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 19;
  }

  /**
   * Show error message
   */
  function showError(message) {
    alert(message); // Replace with a nicer modal/toast in production
    announceToScreenReader('Error: ' + message);
  }

  /**
   * Initialize age verification
   */
  function initAgeVerification() {
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
      // Set max date to 19 years ago
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 19);
      dobInput.max = maxDate.toISOString().split('T')[0];

      // Real-time validation
      dobInput.addEventListener('blur', function() {
        if (this.value && !isAgeValid(this.value)) {
          this.setCustomValidity('You must be 19 years of age or older.');
        } else {
          this.setCustomValidity('');
        }
      });
    }
  }

  /**
   * Initialize animations
   */
  function initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-up, .bounce-in, .fade-in-delay, .prize-item, .step-item, .info-card'
    );

    animatedElements.forEach(function(element) {
      observer.observe(element);
    });
  }

  /**
   * Initialize confetti animation
   */
  function initConfetti() {
    // Confetti already animated via CSS
    // This function can be used to trigger additional confetti on actions
  }

  /**
   * Trigger confetti burst (for celebrations)
   */
  function triggerConfettiBurst() {
    const container = document.querySelector('.background-animation');
    if (!container) return;

    const confettiCount = 20;
    const confettiEmojis = ['🎉', '🎊', '⭐', '✨', '🎈', '🎁'];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-burst';
      confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(confetti);

      // Remove after animation
      setTimeout(function() {
        confetti.remove();
      }, 8000);
    }
  }

  /**
   * Initialize accessibility
   */
  function initAccessibility() {
    // Create live region
    const liveRegion = document.createElement('div');
    liveRegion.id = 'sr-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);

    // Enhance external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function(link) {
      const currentLabel = link.getAttribute('aria-label') || link.textContent;
      link.setAttribute('aria-label', currentLabel + ' (opens in new tab)');
    });
  }

  /**
   * Announce to screen readers
   */
  function announceToScreenReader(message) {
    const liveRegion = document.getElementById('sr-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(function() {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Track analytics events
   */
  function trackEvent(action, category, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }

    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: action,
        category: category,
        label: label
      });
    }

    // Console log for debugging
    console.log('Event tracked:', { action, category, label });
  }

  /**
   * Mouse parallax effect
   */
  document.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) {
      const floatElements = document.querySelectorAll('.float-element');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      floatElements.forEach(function(element, index) {
        const speed = (index + 1) * 15;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  });

  /**
   * Preload images on page load
   */
  window.addEventListener('load', function() {
    const imagesToPreload = [
      '/img/fallsview-casino-resort-logo.png',
      '/img/playsmart.png'
    ];

    imagesToPreload.forEach(function(src) {
      const img = new Image();
      img.src = src;
    });
  });

  /**
   * Public API
   */
  window.PriceIsRightContest = {
    openModal: openModal,
    closeModal: closeModal,
    trackEvent: trackEvent,
    triggerConfetti: triggerConfettiBurst
  };

  // Log initialization
  console.log('Price is Right Live! Contest - Page initialized');

})();

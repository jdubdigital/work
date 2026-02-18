/**
 * FALLSVIEW FOOD & DRINK FEST
 * Enhanced Modal & UX Functionality
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    animationDuration: 300,
    scrollThreshold: 100,
    autoHideDelay: 5000
  };

  // State
  let isModalOpen = false;
  let scrollPosition = 0;

  /**
   * Initialize all functionality when DOM is ready
   */
  document.addEventListener('DOMContentLoaded', function() {
    initModal();
    initScrollEffects();
    initAnimations();
    initAccessibility();
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

    // Open modal event
    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });

    // Close button event
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });

    // Close when clicking outside modal content
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
   * Open the modal with animations
   */
  function openModal() {
    const modal = document.getElementById('contestModal');
    if (!modal || isModalOpen) return;

    // Save current scroll position
    scrollPosition = window.pageYOffset;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';

    // Show modal
    modal.classList.add('active');
    isModalOpen = true;

    // Announce to screen readers
    announceToScreenReader('Contest entry form opened');

    // Focus trap
    trapFocus(modal);

    // Track analytics (if available)
    trackEvent('modal_opened', 'contest_entry');
  }

  /**
   * Close the modal with animations
   */
  function closeModal() {
    const modal = document.getElementById('contestModal');
    if (!modal || !isModalOpen) return;

    const modalContent = modal.querySelector('.modal-content');
    
    // Add closing animation
    if (modalContent) {
      modalContent.style.animation = 'slideDown 0.3s ease';
    }

    // Remove modal after animation
    setTimeout(function() {
      modal.classList.remove('active');
      isModalOpen = false;

      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition);

      // Reset animation
      if (modalContent) {
        modalContent.style.animation = '';
      }

      // Return focus to open button
      const openBtn = document.getElementById('openContestBtn');
      if (openBtn) {
        openBtn.focus();
      }

      // Announce to screen readers
      announceToScreenReader('Contest entry form closed');

      // Track analytics
      trackEvent('modal_closed', 'contest_entry');
    }, CONFIG.animationDuration);
  }

  /**
   * Handle keyboard events
   */
  function handleKeyPress(e) {
    // Close modal on ESC
    if (e.key === 'Escape' && isModalOpen) {
      e.preventDefault();
      closeModal();
    }

    // Tab trap when modal is open
    if (e.key === 'Tab' && isModalOpen) {
      handleTabKey(e);
    }
  }

  /**
   * Trap focus within modal
   */
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element
      setTimeout(() => {
        firstElement.focus();
      }, 100);
    }
  }

  /**
   * Handle tab key for focus trap
   */
  function handleTabKey(e) {
    const modal = document.getElementById('contestModal');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Initialize scroll effects
   */
  function initScrollEffects() {
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    const scrolled = window.pageYOffset;

    // Add parallax effect to floating elements
    const floatElements = document.querySelectorAll('.float-element');
    floatElements.forEach(function(element, index) {
      const speed = (index + 1) * 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  /**
   * Initialize intersection observer for animations
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
          
          // Optionally unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-up, .bounce-in, .fade-in-delay, .prize-card, .feature-item'
    );

    animatedElements.forEach(function(element) {
      observer.observe(element);
    });
  }

  /**
   * Initialize accessibility features
   */
  function initAccessibility() {
    // Create live region for screen reader announcements
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

    // Add ARIA labels to interactive elements
    enhanceAccessibility();
  }

  /**
   * Enhance accessibility of elements
   */
  function enhanceAccessibility() {
    // Add aria-label to links that open in new tabs
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function(link) {
      const currentLabel = link.getAttribute('aria-label') || link.textContent;
      link.setAttribute('aria-label', currentLabel + ' (opens in new tab)');
    });

    // Ensure all images have alt text
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(function(img) {
      img.setAttribute('alt', 'Decorative image');
    });
  }

  /**
   * Announce message to screen readers
   */
  function announceToScreenReader(message) {
    const liveRegion = document.getElementById('sr-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after a delay
      setTimeout(function() {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Track events (placeholder for analytics)
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
   * Smooth scroll to element
   */
  function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Add mouse move parallax effect
   */
  document.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) {
      const floatElements = document.querySelectorAll('.float-element');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      floatElements.forEach(function(element, index) {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  });

  /**
   * Handle form submission from iframe (if needed)
   */
  window.addEventListener('message', function(event) {
    // Verify origin for security
    const allowedOrigins = [
      'https://content-us-1.content-cms.com',
      window.location.origin
    ];

    if (allowedOrigins.includes(event.origin)) {
      if (event.data === 'formSubmitted' || event.data.type === 'formSubmitted') {
        // Close modal and redirect to thank you page
        closeModal();
        setTimeout(function() {
          window.location.href = 'thank-you.html';
        }, CONFIG.animationDuration);
      }
    }
  });

  /**
   * Add smooth reveal on page load
   */
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Preload images
    preloadImages();
  });

  /**
   * Preload critical images
   */
  function preloadImages() {
    const imagesToPreload = [
      '/img/FFDF_Logo_2024_noback-white-V4.png',
      '/img/FFDF24-VIP-03273.jpg',
      '/img/OLG_3c.png',
      '/img/playsmart.png'
    ];

    imagesToPreload.forEach(function(src) {
      const img = new Image();
      img.src = src;
    });
  }

  /**
   * Expose public API
   */
  window.FallsviewContest = {
    openModal: openModal,
    closeModal: closeModal,
    trackEvent: trackEvent,
    scrollTo: smoothScrollTo
  };

  // Log initialization
  console.log('Fallsview Food & Drink Fest - Contest page initialized');

})();

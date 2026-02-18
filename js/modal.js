/**
 * FALLSVIEW FOOD & DRINK FEST
 * Modal Functionality
 */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    initModal();
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
    openBtn.addEventListener('click', openModal);

    // Close modal
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /**
   * Open the modal
   */
  function openModal() {
    const modal = document.getElementById('contestModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Close the modal
   */
  function closeModal() {
    const modal = document.getElementById('contestModal');
    if (modal) {
      const modalContent = modal.querySelector('.modal-content');
      
      // Add closing animation
      if (modalContent) {
        modalContent.style.animation = 'slideDown 0.3s ease';
      }

      // Remove modal after animation
      setTimeout(function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset animation
        if (modalContent) {
          modalContent.style.animation = '';
        }
      }, 300);
    }
  }

  // Expose functions globally if needed
  window.contestModal = {
    open: openModal,
    close: closeModal
  };

})();

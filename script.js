// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contestModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const contestFormIframe = document.getElementById('contestForm');

    // Function to open modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add animation to modal content
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'none';
        setTimeout(() => {
            modalContent.style.animation = 'slideUp 0.4s ease';
        }, 10);

        // Set iframe source (replace with actual form URL)
        // For demo purposes, using about:blank
        // Replace with: contestFormIframe.src = 'https://your-form-url.com';
        
        // Example placeholder content
        if (contestFormIframe.src === 'about:blank' || contestFormIframe.src.includes('about:blank')) {
            createPlaceholderContent();
        }
    }

    // Function to close modal
    function closeModal() {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'slideDown 0.3s ease';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }

    // Event listeners
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    modal.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Create placeholder content for demo
    function createPlaceholderContent() {
        const iframeDoc = contestFormIframe.contentDocument || contestFormIframe.contentWindow.document;
        
        const placeholderHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: transparent;
                        color: #1e293b;
                        padding: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100%;
                    }
                    .placeholder {
                        text-align: center;
                        max-width: 500px;
                    }
                    .placeholder-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    h2 {
                        color: #334155;
                        margin-bottom: 1rem;
                        font-size: 1.5rem;
                    }
                    p {
                        color: #64748b;
                        line-height: 1.6;
                        margin-bottom: 0.75rem;
                    }
                    .code-box {
                        background: #f1f5f9;
                        padding: 1rem;
                        border-radius: 8px;
                        margin-top: 1.5rem;
                        border-left: 4px solid #6366f1;
                    }
                    code {
                        color: #6366f1;
                        font-family: 'Courier New', monospace;
                        font-size: 0.875rem;
                    }
                    .note {
                        background: #fef3c7;
                        padding: 1rem;
                        border-radius: 8px;
                        margin-top: 1rem;
                        border-left: 4px solid #f59e0b;
                        text-align: left;
                    }
                    .note strong {
                        color: #92400e;
                    }
                </style>
            </head>
            <body>
                <div class="placeholder">
                    <div class="placeholder-icon">📝</div>
                    <h2>Form Area Ready!</h2>
                    <p>This is where your contest entry form will be displayed.</p>
                    <p>The iframe is configured and ready to host your form.</p>
                    
                    <div class="code-box">
                        <p><strong>To integrate your form:</strong></p>
                        <code>
                            document.getElementById('contestForm').src = 'YOUR_FORM_URL';
                        </code>
                    </div>
                    
                    <div class="note">
                        <p><strong>Note:</strong> You can embed any form service like Google Forms, Typeform, JotForm, or your custom form URL here.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        iframeDoc.open();
        iframeDoc.write(placeholderHTML);
        iframeDoc.close();
    }

    // Add slide down animation for closing
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add smooth scroll behavior
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

    // Add parallax effect to particles on mouse move
    document.addEventListener('mousemove', function(e) {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Add entrance animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-up, .bounce-in, .fade-in-delayed').forEach(el => {
        observer.observe(el);
    });
});

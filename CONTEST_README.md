# Fallsview Food & Drink Fest - Contest Landing Page

A clean, organized contest landing page for the Fallsview Food & Drink Fest event.

## 📁 File Structure

```
/workspace/
├── contest.html          # Main contest entry page
├── thank-you.html        # Thank you confirmation page
├── css/
│   └── main.css         # All styles (organized and commented)
├── js/
│   └── modal.js         # Modal functionality
└── img/                 # Image assets
    ├── FFDF_Logo_2024_noback-white-V4.png
    ├── FFDF24-VIP-03273.jpg
    ├── OLG_3c.png
    └── playsmart.png
```

## 🎯 Pages

### contest.html
The main landing page featuring:
- Event details and description
- Prize information
- Entry button that triggers modal
- Footer with legal links

### thank-you.html
Confirmation page shown after contest entry:
- Thank you message
- Call-to-action to visit website
- Same footer as main page

## 🎨 Features

### Clean Code
- ✅ No inline styles
- ✅ No inline scripts
- ✅ Organized CSS with clear sections
- ✅ Modular JavaScript
- ✅ Semantic HTML5

### Modal System
- Smooth slide-up animation on open
- Click outside to close
- ESC key to close
- Prevents body scroll when open
- Iframe integration for form

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 750px
- Optimized for all screen sizes
- Touch-friendly buttons

### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Semantic HTML structure
- Alt text on images

## 🚀 Usage

### Opening the Pages
Simply open `contest.html` or `thank-you.html` in any modern web browser.

### Customization

#### Updating Event Details
Edit `contest.html` and modify the content within `.banner-content`:

```html
<h1 class="show-title">YOUR EVENT TITLE</h1>
<p class="show-details event-date">Your Date Here</p>
```

#### Changing Colors
Edit `css/main.css` and update the color variables:

```css
.custom-btn {
  background-color: #FF6900; /* Change to your brand color */
}
```

#### Updating Form URL
Edit `contest.html` and update the iframe source:

```html
<iframe 
  id="acousticForm"
  src="YOUR_FORM_URL_HERE"
></iframe>
```

## 🛠 Technical Details

### Dependencies
- Google Fonts (Poppins)
- jQuery 3.2.1 (loaded from CDN)
- reCAPTCHA API (loaded from CDN)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Performance
- Deferred script loading
- Optimized animations
- Minimal external dependencies
- Clean, efficient CSS

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 750px - 1199px
- **Desktop**: ≥ 1200px

## 🎬 Animations

- **fadeIn**: Smooth entrance for content
- **slideUp**: Modal opening animation
- **slideDown**: Modal closing animation
- **Button hovers**: Scale and shadow effects

## 🔧 Maintenance

### Adding New Styles
Add new styles to `css/main.css` in the appropriate section. Sections are clearly marked with comments.

### Modifying Modal Behavior
Edit `js/modal.js`. The module exposes global functions:
```javascript
window.contestModal.open();  // Open modal programmatically
window.contestModal.close(); // Close modal programmatically
```

### Testing
1. Test modal open/close functionality
2. Verify responsive layouts on different devices
3. Check form submission works correctly
4. Validate all links

## 📝 Notes

- All JavaScript is wrapped in IIFE to avoid global scope pollution
- CSS uses BEM-like naming conventions where appropriate
- Animations use CSS for better performance
- Modal uses `classList` API for better browser compatibility

## 🔒 Legal

The contest page includes legal disclaimers and links to:
- Privacy Policy
- Terms of Use
- Official Contest Rules
- Play Smart resources

Make sure all legal links are updated and functional before deployment.

## 🎯 Future Enhancements

Potential improvements:
- Add form validation feedback
- Implement analytics tracking
- Add social sharing buttons
- Create multi-step form wizard
- Add countdown timer to event

## 📄 License

© 2025 Fallsview Casino Resort. All rights reserved.

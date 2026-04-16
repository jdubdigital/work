# Contest Landing Page

A fun and animated single-page landing page for contest entries with a modal popup form container.

## 🎉 Features

- **Animated Background**: Floating particle effects that respond to mouse movement
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modal Popup**: Smooth animated modal to host your contest entry form
- **Iframe Integration**: Ready-to-use iframe container for any form service
- **Modern UI**: Beautiful gradient effects, animations, and transitions
- **Accessibility**: Keyboard navigation support (ESC to close modal)

## 🚀 Quick Start

1. Open `index.html` in your web browser
2. Click "Enter Contest Now" to see the modal
3. The modal contains an iframe ready to host your form

## 📝 Integrating Your Form

To integrate your contest entry form, edit `script.js` and update the iframe source:

```javascript
// Find this line in the openModal() function:
contestFormIframe.src = 'YOUR_FORM_URL_HERE';
```

### Supported Form Services

- **Google Forms**: Copy the embed URL from your Google Form
- **Typeform**: Use the embed URL from your Typeform
- **JotForm**: Use the iframe embed URL
- **Custom Forms**: Any URL that allows iframe embedding

### Example Integration

```javascript
// Google Forms example
contestFormIframe.src = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true';

// Typeform example
contestFormIframe.src = 'https://form.typeform.com/to/YOUR_FORM_ID';

// Custom form example
contestFormIframe.src = 'https://yourdomain.com/contest-form';
```

## 🎨 Customization

### Updating Prize Information

Edit the prize cards in `index.html`:

```html
<div class="prize-card">
    <div class="prize-icon">🏆</div>
    <h3>Grand Prize</h3>
    <p>Your prize description</p>
</div>
```

### Changing Colors

Update CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #f59e0b;
    --dark-bg: #0f172a;
    --light-text: #f1f5f9;
}
```

### Adjusting Contest Title

Update the title in `index.html`:

```html
<h1 class="main-title">
    <span class="title-line">Your Contest Name</span>
    <span class="title-year">2026</span>
</h1>
```

## 🛠 File Structure

```
.
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Modal functionality and interactions
└── README.md       # This file
```

## 📱 Responsive Breakpoints

- Desktop: 1200px and above
- Tablet: 768px to 1199px
- Mobile: Below 768px

## ✨ Animation Features

- Floating particle background
- Pulse animations on badges
- Bouncing icons
- Smooth modal transitions
- Hover effects on cards and buttons
- Parallax effect on mouse movement

## 🔧 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📄 License

Feel free to use and modify this landing page for your contest needs!
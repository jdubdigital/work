# Price is Right Live! Instagram Getaway Contest

Landing page for Fallsview Casino Resort's influencer marketing contest with Grant Joseph.

## 📋 Contest Details

**Contest Name:** Price is Right Live! Instagram Getaway Contest  
**Platform:** Instagram (exclusive link from Grant Joseph's profile)  
**Contest Period:** March 25, 2026 (10:00 AM) - April 1, 2026 (11:59 PM)  
**Winner Selection:** April 2, 2026 at 1:00 PM  
**Entries:** One (1) entry per participant

## 🎁 Prize Package

**Total Value:** $850 CAD (excluding alcohol and gratuities)

Includes:
- Two (2) complimentary The Price is Right Live tickets ($150 CAD value)
- One (1) night hotel stay at Fallsview Casino Resort on Saturday, April 16 + parking ($550 CAD value)
- One (1) $150 dining credit ($150 CAD value)

## 📁 File Structure

```
/workspace/
├── price-is-right-contest.html          # Main contest landing page
├── price-is-right-thank-you.html        # Thank you confirmation page
├── css/
│   ├── main.css                         # Base styles (shared)
│   └── price-is-right.css              # Contest-specific styles
├── js/
│   └── price-is-right-modal.js         # Contest modal & form logic
└── img/
    ├── fallsview-casino-resort-logo.png
    └── playsmart.png
```

## 🎨 Design Features

### Visual Elements
- **Instagram gradient branding** - Reflects social media origin
- **Confetti animations** - Falling emoji confetti for celebration
- **Prize is Right color scheme** - Yellow, red, blue, green accents
- **Vibrant gradients** - Eye-catching color combinations
- **Floating background elements** - Subtle parallax effects

### Page Sections
1. **Hero Section**
   - Fallsview Casino Resort logo
   - Instagram exclusive badge
   - Contest title and dates
   - Influencer credit (Grant Joseph)

2. **Prize Section**
   - Single grand prize card with all details
   - Individual prize items with icons
   - Total value display

3. **How It Works**
   - 4-step process visualization
   - Clear instructions for entry

4. **CTA Section**
   - Prominent entry button
   - Contest details

5. **Features Grid**
   - Free entry, quick, secure, fair

## 📝 Entry Form Requirements

The form collects:
- ✅ First Name
- ✅ Last Name
- ✅ Email Address
- ✅ Date of Birth
- ✅ Age verification (19+, not self-excluded)
- ✅ Email opt-in (optional)
- ✅ Privacy Policy, Notice of Collection, Official Rules acceptance

### Form Validation
- Age verification: Must be 19+ years old
- Date calculation based on DOB
- Required field validation
- Checkbox confirmations

## 🔧 Technical Implementation

### Entry Process
1. User clicks "Click Here to Enter" button
2. Modal opens with entry form
3. User fills out required information
4. Form validates age (19+)
5. User accepts terms and conditions
6. Form submits to backend
7. User redirected to thank-you page

### Form Integration Options

**Option 1: Iframe (Recommended)**
Update the iframe source in `price-is-right-contest.html`:
```html
<iframe 
  id="contestForm" 
  src="YOUR_FORM_URL_HERE"
></iframe>
```

**Option 2: Custom Form**
Use the placeholder form structure included in the HTML. Connect it to your backend API.

### Backend Requirements
- Form submission endpoint
- Age validation (server-side)
- Email opt-in handling
- Contest entry storage
- Duplicate entry prevention (one per person)

## 🚀 Deployment

### Pre-Deployment Checklist
- [ ] Update form URL or implement custom form
- [ ] Add Official Rules link (when available from Legal)
- [ ] Verify Fallsview Casino Resort logo is uploaded
- [ ] Test form submission flow
- [ ] Test age validation
- [ ] Verify analytics tracking
- [ ] Test on mobile devices
- [ ] Accessibility audit

### URL Configuration
This page should be:
- Hidden from site navigation
- Accessible only via direct link
- Shared exclusively through Grant Joseph's Instagram

Example URL structure:
```
https://fallsviewcasinoresort.com/price-is-right-instagram-contest
```

### SEO Configuration
The page includes:
```html
<meta name="robots" content="noindex, nofollow">
```
This prevents search engine indexing while keeping the page accessible via direct link.

## 📱 Responsive Design

Optimized for:
- **Desktop:** Full-width layout with side-by-side elements
- **Tablet:** Stacked layout with proper spacing
- **Mobile:** Single-column, touch-friendly buttons

All interactive elements are touch-optimized for mobile users coming from Instagram.

## ♿ Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus trap in modal
- High contrast mode support
- Reduced motion support

## 📊 Analytics Tracking

Events tracked:
- `modal_opened` - User opens entry form
- `modal_closed` - User closes entry form
- `form_submitted` - User attempts submission
- `form_success` - Successful entry
- `form_error` - Validation errors

Configure Google Analytics or Tag Manager to capture these events.

## 🔒 Privacy & Legal

### Required Links (Update when available)
- Privacy Policy
- Terms of Use
- Official Rules
- Notice of Collection

### Legal Requirements
- 19+ age verification
- Self-exclusion check
- Momentum program eligibility
- One entry per person
- Contest period enforcement

## 🎯 Marketing Notes

### Influencer Partnership
- **Partner:** Grant Joseph (social media influencer/content creator)
- **Platform:** Instagram
- **Strategy:** Exclusive link in Instagram bio/stories
- **Goal:** Build relationship with new audience members

### Opt-In Strategy
The form includes an optional email opt-in checkbox to:
- Build email marketing list
- Start relationship with potential customers
- Enable future communications

## 🧪 Testing Guide

### Manual Testing Checklist
1. Open modal - verify smooth animation
2. Fill form with valid data - verify submission
3. Test age validation - try DOB < 19 years old
4. Test required checkboxes
5. Verify thank-you page redirect
6. Test ESC key to close modal
7. Test click-outside to close
8. Verify mobile responsiveness
9. Test with screen reader
10. Verify all links work

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## 📞 Support

For questions or issues:
- Marketing Team: Contest setup and copy
- Web Team: Technical implementation
- Legal Team: Official rules and compliance
- Promotions Team: Prize fulfillment

## 📄 Version History

- **v1.0** - Initial release (based on FFDF design template)
- Contest-specific customization for Price is Right Live
- Instagram influencer branding
- Custom prize package display

---

© 2026 Fallsview Casino Resort. All rights reserved.

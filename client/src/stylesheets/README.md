# Login/Register Page Styling Instructions

## How to Apply the Background and Transparent Card Styling

### Option 1: Import in index.css (Recommended)
Add this line to your `client/src/index.css`:
```css
@import url('./stylesheets/login-register-import.css');
```

### Option 2: Import in App.js
Add this import to your `client/src/App.js`:
```javascript
import './stylesheets/login-register-import.css';
```

### What This Will Do:
- ✅ Adds a blurred food background image to login/register pages
- ✅ Makes the login/register cards transparent with glassmorphism effect
- ✅ Changes text colors to white for better visibility
- ✅ Adds subtle animations and hover effects
- ✅ Keeps all existing functionality intact

### Background Image
The CSS uses a high-quality food background image from Unsplash. You can replace the URL in the CSS file with your own image if needed.

### No Code Changes Required
This styling is applied purely through CSS overrides and won't affect your existing React components or functionality.

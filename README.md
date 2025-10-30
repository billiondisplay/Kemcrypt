# 🔐 Kemcrypt - Responsive Password Generator

## ✅ Example Project Title
"Kemcrypt — Responsive Password Generator"

A fully functional, responsive password generator built with HTML, CSS, and JavaScript. Generate strong, secure passwords instantly with customizable options and a beautiful, modern UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Features

- ✅ **Strong Passwords** - Cryptographically secure random generation
- ✅ **Customizable** - Length control, character types, and more
- ✅ **Smart Strength Meter** - 5-level visual feedback with color coding
- ✅ **Copy to Clipboard** - One-click copy functionality with visual feedback
- ✅ **Dark/Light Theme** - Automatic system preference detection with persistence
- ✅ **Fully Responsive** - Optimized for all devices
- ✅ **Accessible** - ARIA labels, keyboard navigation, focus states
- ✅ **Modern CSS** - Flexbox, Grid, CSS Variables, smooth animations
- ✅ **SEO Friendly** - Semantic HTML5 structure
- ✅ **Offline Ready** - Service worker caches assets for offline use
- ✅ **Installable** - Add to home screen on mobile/desktop
- ✅ **Performance Optimized** - Fast loading and smooth interactions

## 🚀 Quick Start

### Option 1: Quick Run (Easiest)
**Windows:**
1. Double-click `start.bat`
2. Browser opens automatically at `http://localhost:8000`

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Direct Usage
1. Open `index.html` directly in your web browser
2. Start generating passwords!
   - Note: Service worker requires HTTPS or localhost

### Option 3: Manual Server Setup
```bash
# Using Python 3
python dev-server.py        # Custom server with proper MIME types
python -m http.server 8000  # Simple Python server

# Using Node.js
npx http-server -p 8000

# Using PHP (if installed)
php -S localhost:8000
```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Click "Install" when prompted

### Mobile (Android/Chrome)
1. Tap the menu (⋮) and select "Add to Home screen"
2. Confirm the installation

### iOS/Safari
1. Tap the share icon
2. Select "Add to Home Screen"
3. Tap "Add" in the top-right corner

## 🛠 Development

### Building for Production
```bash
# Minify and optimize assets
npm run build
```

### Testing
```bash
# Run tests
npm test

# Check for accessibility issues
npx pa11y http://localhost:8000
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Then visit `http://localhost:8000` in your browser.

📖 **For detailed local development guide, see [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)**

## 📦 Project Structure

```
password-generator/
│
├── index.html              # Main HTML structure
├── style.css               # Responsive styles with dark/light mode
├── script.js               # Password generation logic
├── Light.svg               # Favicon for light mode (#0B2540)
├── Dark.svg                # Favicon for dark mode (#12B9DA)
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── dev-server.py           # Custom development server
├── start.bat               # Windows quick start script
├── start.sh                # Mac/Linux quick start script
├── README.md               # Main documentation
├── LOCAL_DEVELOPMENT.md    # Local dev guide
└── DEPLOYMENT.md           # Deployment instructions
```

## 🌐 Deploy to Netlify

### Method 1: Drag & Drop (Easiest)
1. Visit [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `password-generator` folder
3. Your site is live! 🎉

### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project folder
cd password-generator

# Deploy
netlify deploy --prod
```

### Method 3: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `.` or `/`
6. Click "Deploy site"

### Custom Domain (Optional)
After deployment, you can add a custom domain:
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## 💻 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 67+ |
| Firefox | 62+ |
| Safari  | 12+ |
| Edge    | 79+ |
| Opera   | 54+ |

**Features Used:**
- CSS Grid & Flexbox
- CSS Variables (Custom Properties)
- Web Crypto API (`crypto.getRandomValues()`)
- Clipboard API (`navigator.clipboard`)
- LocalStorage API
- ES6+ JavaScript

## 🎨 Customization

### Change Color Scheme
Edit the CSS variables in `style.css`:

```css
:root {
    --accent-primary: #00BFA6;    /* Change primary color */
    --accent-hover: #00a890;      /* Change hover color */
    /* ... more variables */
}
```

### Modify Password Length Range
In `index.html`, update the slider attributes:

```html
<input 
    type="range" 
    id="lengthSlider" 
    min="6"      <!-- Change minimum -->
    max="32"     <!-- Change maximum -->
    value="16"   <!-- Change default -->
/>
```

### Add More Special Characters
In `script.js`, modify the character sets:

```javascript
const charSets = {
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~`'  // Add more symbols
};
```

## 🔒 Security

- Uses **Web Crypto API** (`crypto.getRandomValues()`) for cryptographically secure random number generation
- Passwords are generated **client-side** - never sent to any server
- No tracking, no analytics, no data collection
- All processing happens in your browser

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + G` - Generate new password
- `Ctrl/Cmd + C` - Copy password (when password field is focused)
- `Tab` - Navigate through options
- `Space` - Toggle checkboxes

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) { ... }

/* Tablet */
@media (min-width: 481px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

## 🎯 Password Strength Algorithm

The strength meter evaluates passwords based on:

1. **Length** (0-40 points)
   - 8+ characters: 10 points
   - 12+ characters: 10 points
   - 16+ characters: 10 points
   - 20+ characters: 10 points

2. **Character Variety** (0-40 points)
   - Uppercase: 10 points
   - Lowercase: 10 points
   - Numbers: 10 points
   - Symbols: 10 points

3. **Entropy** (0-20 points)
   - 50%+ unique characters: 10 points
   - 70%+ unique characters: 10 points

**Scoring:**
- 0-40: Weak (Red)
- 41-70: Medium (Orange)
- 71-100: Strong (Green)

## 🐛 Known Issues

None at the moment! 🎉

## 🔮 Future Enhancements

- [ ] Password history (last 5 generated)
- [ ] Export passwords to file
- [ ] Memorable password generator (passphrase)
- [ ] Exclude similar characters (i, l, 1, L, o, 0, O)
- [ ] Multiple password generation
- [ ] Progressive Web App (PWA) manifest
- [ ] Internationalization (i18n)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**Kemmy**
- Built with ❤️ using HTML, CSS & JavaScript

## 🙏 Acknowledgments

- Icons: SVG icons inline (lightweight)
- Font: [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts
- Inspiration: Modern password generators and security best practices

## 📞 Support

If you have any questions or run into issues:
1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Clear cache and reload the page
4. Try in incognito/private mode

---

**⭐ If you found this useful, consider giving it a star!**

Made with 💚 for a more secure web.

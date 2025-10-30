# 🚀 Local Development Guide

This guide explains how to run the Kemcrypt password generator locally on your machine.

## 🎯 Quick Start

### Windows Users
**Option 1: Double-click method (Easiest)**
1. Double-click `start.bat`
2. Server will start automatically
3. Open browser to `http://localhost:8000`

**Option 2: Command line**
```cmd
# Run the batch file
start.bat

# Or run Python directly
python dev-server.py

# Or use simple HTTP server
python -m http.server 8000
```

### Mac/Linux Users
**Option 1: Using start script**
```bash
# Make script executable (first time only)
chmod +x start.sh

# Run the script
./start.sh
```

**Option 2: Direct Python**
```bash
# Run custom dev server
python3 dev-server.py

# Or use simple HTTP server
python3 -m http.server 8000
```

## 📦 Prerequisites

### Python
- **Windows:** Download from [python.org](https://www.python.org/downloads/)
- **Mac:** `brew install python3` or use built-in Python
- **Linux:** `sudo apt-get install python3`

**Check installation:**
```bash
python --version   # Windows
python3 --version  # Mac/Linux
```

## 🌐 Accessing the Application

Once the server is running, open your browser to:

- **Local:** http://localhost:8000
- **Network:** http://127.0.0.1:8000
- **LAN:** http://[your-local-ip]:8000 (for testing on other devices)

## 🛠️ Development Server Features

The custom `dev-server.py` includes:
- ✅ Proper MIME types for all file types
- ✅ CORS headers for API testing
- ✅ No-cache headers for development
- ✅ Colorized logging for easy debugging
- ✅ Network IP detection for mobile testing

## 📱 Testing on Mobile Devices

1. Start the server: `python dev-server.py`
2. Note your local IP (displayed in console)
3. On mobile device (connected to same WiFi):
   - Open browser
   - Navigate to: `http://[your-local-ip]:8000`

Example: `http://192.168.1.100:8000`

## 🔧 Alternative Development Servers

### Node.js - http-server
```bash
# Install globally
npm install -g http-server

# Run server
http-server -p 8000 -o
```

### Node.js - live-server (auto-reload)
```bash
# Install globally
npm install -g live-server

# Run server
live-server --port=8000
```

### PHP
```bash
php -S localhost:8000
```

### VS Code Extension
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows - Find process on port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID [PID] /F

# Mac/Linux - Find and kill
lsof -ti:8000 | xargs kill -9
```

### Python Not Found
- **Windows:** Add Python to PATH during installation
- **Mac/Linux:** Use `python3` instead of `python`

### Permission Denied (Mac/Linux)
```bash
# Make scripts executable
chmod +x start.sh
chmod +x dev-server.py
```

### Favicon Not Loading
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check browser console for errors

### Service Worker Issues
During development, service workers can cache old files:
1. Open DevTools (F12)
2. Application tab
3. Service Workers section
4. Click "Unregister"
5. Hard refresh page

## 📂 Project Structure

```
password-generator/
├── index.html           # Main HTML file
├── style.css            # Styles
├── script.js            # JavaScript logic
├── Light.svg            # Favicon for light mode (#0B2540)
├── Dark.svg             # Favicon for dark mode (#12B9DA)
├── dev-server.py        # Custom development server
├── start.bat            # Windows quick start
├── start.sh             # Mac/Linux quick start
└── LOCAL_DEVELOPMENT.md # This file
```

## 🎨 Favicon System

The app uses dynamic favicons based on theme:

- **Light Mode:** Uses `Light.svg` with color `#0B2540` (dark blue)
  - Shows well on light browser tabs
  
- **Dark Mode:** Uses `Dark.svg` with color `#12B9DA` (cyan blue)
  - Shows well on dark browser tabs

The favicon automatically switches when you toggle the theme.

## 🔄 Live Reload

For automatic page refresh on file changes:

```bash
# Install browser-sync
npm install -g browser-sync

# Run with auto-reload
browser-sync start --server --files "*.html, *.css, *.js, *.svg"
```

## 🧪 Testing Checklist

- [ ] Password generation works
- [ ] Copy to clipboard functional
- [ ] Theme toggle switches light/dark
- [ ] Favicon changes with theme
- [ ] Settings persist (localStorage)
- [ ] Responsive on mobile
- [ ] All checkboxes work
- [ ] Slider adjusts length
- [ ] Strength meter updates

## 📝 Making Changes

1. Edit files (HTML, CSS, JS)
2. Save changes
3. Refresh browser (`F5` or `Ctrl+R`)
4. Check browser console for errors (`F12`)

## 🚀 Ready to Deploy?

After local testing, see `DEPLOYMENT.md` for deployment instructions.

## 💡 Tips

- Use browser DevTools (`F12`) for debugging
- Test in multiple browsers (Chrome, Firefox, Safari)
- Use mobile device for real mobile testing
- Clear cache if changes don't appear
- Check console for JavaScript errors

## 🆘 Need Help?

Common commands reference:

```bash
# Start server
python dev-server.py

# Different port
python -m http.server 3000

# Stop server
Ctrl + C

# Check if port is free
netstat -an | findstr :8000  # Windows
lsof -i :8000                # Mac/Linux
```

---

**Happy Coding! 🎉**

For deployment instructions, see `DEPLOYMENT.md`

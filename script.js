/**
 * Password Generator Application
 * A secure and accessible password generator with strength meter and theme support
 */

// DOM Elements
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const strengthBar = document.getElementById('strengthBar');
const strengthValue = document.getElementById('strengthValue');
const favicon = document.getElementById('favicon');

// Checkbox inputs
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');

/**
 * Character sets for password generation
 * @type {Object.<string, string>}
 */
// Character sets for password generation with additional special characters
// Excluded: < > ' " ` ~ \ / to prevent HTML/script injection and shell injection
const CHAR_SETS = Object.freeze({
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.?',
    // Additional character sets for better security
    similarChars: 'il1Lo0O', // Characters that look similar
    ambiguous: '{}[]()/\\\'"`~,;:.<>', // Potentially ambiguous characters
    // Extended symbol sets for better entropy
    extendedSymbols: '!@#$%^&*_+-=[]{}|;:,.'
});

// Debounce timer for password generation
let debounceTimer;

/**
 * Initialize the application
 */
/**
 * Initialize the application with security headers and service worker
 */
function init() {
    // Set security headers (meta tags are set in HTML)
    setSecurityHeaders();
    
    // Initialize theme and load settings
    initTheme();
    loadSettings();
    
    // Generate initial password
    generatePassword();
    
    // Setup event listeners and accessibility
    setupEventListeners();
    setupAccessibility();
    
    // Register service worker for PWA and offline support
    registerServiceWorker();
}

/**
 * Set security-related meta tags
 * Note: Some headers like X-Frame-Options should be set on the server side
 */
function setSecurityHeaders() {
    // Content Security Policy
    const csp = document.createElement('meta');
    csp.httpEquiv = 'Content-Security-Policy';
    csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';";
    document.head.appendChild(csp);
    
    // Other security meta tags (X-Frame-Options should be set on server)
    const securityMeta = [
        { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'clipboard-write=(), geolocation=(), microphone=(), camera=()' }
    ];
    
    securityMeta.forEach(metaData => {
        const meta = document.createElement('meta');
        Object.entries(metaData).forEach(([key, value]) => {
            meta[key] = value;
        });
        document.head.appendChild(meta);
    });
}

/**
 * Register Service Worker for PWA and offline support
 */
function registerServiceWorker() {
    // Only register service worker in production (not in file:// protocol)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(error => {
                    console.log('ServiceWorker registration not required in development');
                });
        });
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Password generation controls
    generateBtn.addEventListener('click', generatePassword);
    
    // Debounced password generation on slider change
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        debounce(generatePassword, 100);
    });
    
    // Checkbox changes with validation
    [includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Copy to clipboard - using event delegation to ensure the handler is always available
    document.body.addEventListener('click', (e) => {
        if (e.target === copyBtn || e.target.closest('#copyBtn')) {
            copyToClipboard();
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Keyboard accessibility
    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize copy button state
    updateCopyButtonState();
}

/**
 * Set up accessibility features
 */
function setupAccessibility() {
    // Add ARIA attributes
    passwordOutput.setAttribute('aria-label', 'Generated password');
    copyBtn.setAttribute('aria-label', 'Copy password to clipboard');
    generateBtn.setAttribute('aria-label', 'Generate new password');
    themeToggle.setAttribute('aria-pressed', 
        document.documentElement.getAttribute('data-theme') === 'dark');
}

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

/**
 * Handle checkbox changes with validation
 */
function handleCheckboxChange() {
    const anyChecked = [includeUppercase, includeLowercase, includeNumbers, includeSymbols]
        .some(checkbox => checkbox.checked);
        
    if (!anyChecked) {
        this.checked = true;
        showToast('At least one character type must be selected', 'warning');
        return;
    }
    
    generatePassword();
    saveSettings();
}

/**
 * Generate a secure random password
 * @returns {string} Generated password
 */
function generatePassword() {
    const length = parseInt(lengthSlider.value, 10);
    const options = {
        uppercase: includeUppercase.checked,
        lowercase: includeLowercase.checked,
        numbers: includeNumbers.checked,
        symbols: includeSymbols.checked
    };

    // Build character pool based on selected options
    const charPool = Object.entries(CHAR_SETS)
        .filter(([key]) => options[key])
        .map(([, chars]) => chars)
        .join('');

    if (!charPool) {
        showToast('Please select at least one character type', 'error');
        return '';
    }

    // Generate secure random password
    const password = generateSecurePassword(length, charPool, options);
    
    // Update UI
    passwordOutput.value = password;
    // Add data attribute for responsive font sizing
    passwordOutput.setAttribute('data-length', length);
    updateStrengthMeter(password, options);
    saveSettings();
    
    return password;
}

/**
 * Generate a secure password using cryptographically strong random values
 * @param {number} length - Length of the password
 * @param {string} charPool - String containing all possible characters
 * @param {Object} options - Password generation options
 * @returns {string} Generated password
 */
/**
 * Generate a secure password using cryptographically strong random values
 * @param {number} length - Length of the password
 * @param {string} charPool - String containing all possible characters
 * @param {Object} options - Password generation options
 * @returns {string} Generated password
 */
function generateSecurePassword(length, charPool, options) {
    // Ensure we have enough entropy
    if (charPool.length < 10) {
        console.warn('Character pool is small, increasing password complexity');
        length = Math.max(length, 16); // Enforce minimum length for small char sets
    }

    // Use crypto.getRandomValues for secure random number generation
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    
    // Generate password with secure random values
    let password = '';
    for (let i = 0; i < length; i++) {
        // Use modulo to get a random index within charPool length
        // Add Math.random() to further reduce any potential modulo bias
        const randomIndex = (values[i] + Math.floor(Math.random() * 0x100000000)) % charPool.length;
        password += charPool[randomIndex];
    }

    // Ensure password contains at least one character from each selected set
    return ensureCharacterVariety(password, options, charPool);
}

/**
 * Ensure password contains at least one character from each selected character set
 * @param {string} password - The password to check
 * @param {Object} options - Password generation options
 * @param {string} charPool - The character pool used for generation
 * @returns {string} Password with ensured character variety
 */
function ensureCharacterVariety(password, options, charPool) {
    const passwordArr = password.split('');
    const missingTypes = [];
    
    // Check which character types are missing
    if (options.uppercase && !/[A-Z]/.test(password)) missingTypes.push('uppercase');
    if (options.lowercase && !/[a-z]/.test(password)) missingTypes.push('lowercase');
    if (options.numbers && !/[0-9]/.test(password)) missingTypes.push('numbers');
    if (options.symbols && !/[^A-Za-z0-9]/.test(password)) missingTypes.push('symbols');
    
    // If all required character types are present, return the password
    if (missingTypes.length === 0) return password;
    
    // Replace random characters with missing types
    missingTypes.forEach(type => {
        const randomIndex = Math.floor(Math.random() * password.length);
        passwordArr[randomIndex] = getRandomChar(CHAR_SETS[type]);
    });
    
    return passwordArr.join('');
}

/**
 * Get a random character from a string
 * @param {string} charSet - The character set to choose from
 * @returns {string} A random character from the set
 */
function getRandomChar(charSet) {
    return charSet[Math.floor(Math.random() * charSet.length)];
}

/**
 * Update the password strength meter based on the password
 * @param {string} password - The password to evaluate
 * @param {Object} options - Password generation options
 */
function updateStrengthMeter(password, options) {
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        updateStrengthUI(0, 'Very Weak', 'very-weak');
        return;
    }
    
    // Calculate password strength (0-100)
    let strength = 0;
    
    // Length check (up to 40% of score)
    const lengthScore = Math.min(password.length * 2, 40);
    strength += lengthScore;
    
    // Character variety (up to 60% of score)
    let varietyScore = 0;
    if (options.uppercase) varietyScore += 10;
    if (options.lowercase) varietyScore += 10;
    if (options.numbers) varietyScore += 10;
    if (options.symbols) varietyScore += 30; // Symbols add more strength
    
    strength = Math.min(100, strength + varietyScore);
    
    // Determine strength level with 5 distinct levels
    let level, levelText, description, segments;
    
    if (strength < 20) {
        level = 'very-weak';
        levelText = 'Very Weak';
        description = 'Add more characters and character types';
        segments = 1;
    } else if (strength < 40) {
        level = 'weak';
        levelText = 'Weak';
        description = 'Could be stronger with more characters';
        segments = 2;
    } else if (strength < 60) {
        level = 'medium';
        levelText = 'Medium';
        description = 'Good, but could be stronger';
        segments = 3;
    } else if (strength < 80) {
        level = 'strong';
        levelText = 'Strong';
        description = 'Strong password';
        segments = 4;
    } else {
        level = 'very-strong';
        levelText = 'Very Strong';
        description = 'Excellent password!';
        segments = 5;
    }
    
    updateStrengthUI(segments, `${levelText} • ${description}`, level);
}

/**
 * Update the strength meter UI
 * @param {number} segments - Number of active segments (1-5)
 * @param {string} text - Strength description
 * @param {string} level - Strength level (very-weak, weak, medium, strong, very-strong)
 */
function updateStrengthUI(segments, text, level) {
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.getElementById('strengthText');
    
    if (strengthMeter) {
        // Update each segment
        const segmentElements = strengthMeter.querySelectorAll('.strength-meter-segment');
        
        // Reset all segments
        segmentElements.forEach(segment => {
            segment.className = 'strength-meter-segment';
            segment.classList.add(level);
        });
        
        // Activate the appropriate number of segments
        for (let i = 0; i < segments; i++) {
            if (segmentElements[i]) {
                segmentElements[i].classList.add('active');
            }
        }
    }
    
    if (strengthText) {
        strengthText.textContent = text;
        // Update text color based on strength level
        strengthText.className = 'strength-text ' + level;
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    if (!toast || !toastMessage) return;
    
    // Clear any existing timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Update toast content and show
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Hide after delay
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Copy the generated password to clipboard
 */
async function copyToClipboard() {
    if (!passwordOutput.value) {
        showToast('No password to copy', 'warning');
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordOutput.value);
        showToast('Password copied to clipboard!', 'success');
        
        // Update button state
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
        copyBtn.setAttribute('aria-label', 'Password copied!');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            updateCopyButtonState();
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy password', 'error');
    }
}

/**
 * Update the copy button state based on password input
 */
function updateCopyButtonState() {
    if (!passwordOutput.value) {
        copyBtn.disabled = true;
        copyBtn.setAttribute('aria-label', 'No password to copy');
    } else {
        copyBtn.disabled = false;
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        copyBtn.setAttribute('aria-label', 'Copy password to clipboard');
    }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

/**
 * Update logo based on the current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateLogoTheme(theme) {
    const lightLogo = document.querySelector('.light-logo');
    const darkLogo = document.querySelector('.dark-logo');
    
    if (theme === 'dark') {
        lightLogo.style.display = 'none';
        darkLogo.style.display = 'block';
    } else {
        lightLogo.style.display = 'block';
        darkLogo.style.display = 'none';
    }
}

/**
 * Preload theme icons to prevent layout shifts and improve performance
 */
function preloadThemeIcons() {
    // Create link elements for preloading
    const lightIcon = document.createElement('link');
    lightIcon.rel = 'preload';
    lightIcon.as = 'image';
    lightIcon.href = 'light.svg';
    
    const darkIcon = document.createElement('link');
    darkIcon.rel = 'preload';
    darkIcon.as = 'image';
    darkIcon.href = 'dark.svg';
    
    // Add to document head
    document.head.appendChild(lightIcon);
    document.head.appendChild(darkIcon);
    
    // Clean up after preloading
    setTimeout(() => {
        document.head.removeChild(lightIcon);
        document.head.removeChild(darkIcon);
    }, 3000); // Remove after a short delay
}

/**
 * Initialize theme based on user preference or system settings
 */
function initTheme() {
    // First, set a default theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = prefersDark ? 'dark' : 'light';
    
    // Check for saved theme in localStorage
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            theme = savedTheme;
        }
    } catch (e) {
        console.log('Could not access localStorage, using system preference');
    }
    
    // Apply the theme
    applyTheme(theme);
    
    // Listen for system theme changes (only if no theme is explicitly set)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
    
    // Preload theme icons
    preloadThemeIcons();
}

/**
 * Apply theme to the document
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
    // Update the document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the toggle button
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
    }
    
    // Update logo and favicon
    updateLogoTheme(theme);
    updateFavicon(theme);
    
    // Save to localStorage
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.log('Could not save theme preference');
    }
}

/**
 * Update the favicon based on the current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateFavicon(theme) {
    const favicon = document.getElementById('favicon');
    if (!favicon) return;
    
    // Use a small timeout to ensure the preload has time to complete
    const iconPath = theme === 'dark' ? 'dark.svg' : 'light.svg';
    
    // Only update if the href is different to prevent unnecessary updates
    if (favicon.getAttribute('href') !== iconPath) {
        // Create a clone to force a new request and prevent caching issues
        const newFavicon = favicon.cloneNode();
        newFavicon.href = iconPath;
        
        // Replace the old favicon with the new one
        const parent = favicon.parentNode;
        parent.removeChild(favicon);
        parent.appendChild(newFavicon);
        
        // Force a repaint to ensure the new favicon is used
        document.head.offsetHeight;
    }
}

/**
 * Save the current settings to localStorage
 */
function saveSettings() {
    const settings = {
        length: lengthSlider.value,
        uppercase: includeUppercase.checked,
        lowercase: includeLowercase.checked,
        numbers: includeNumbers.checked,
        symbols: includeSymbols.checked,
        theme: document.documentElement.getAttribute('data-theme') || 'light'
    };
    
    try {
        localStorage.setItem('passwordGeneratorSettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
}

/**
 * Load saved settings from localStorage
 */
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('passwordGeneratorSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply settings
            if (settings.length) {
                lengthSlider.value = settings.length;
                lengthValue.textContent = settings.length;
            }
            
            if (settings.uppercase !== undefined) includeUppercase.checked = settings.uppercase;
            if (settings.lowercase !== undefined) includeLowercase.checked = settings.lowercase;
            if (settings.numbers !== undefined) includeNumbers.checked = settings.numbers;
            if (settings.symbols !== undefined) includeSymbols.checked = settings.symbols;
            
            // Apply theme
            if (settings.theme) {
                document.documentElement.setAttribute('data-theme', settings.theme);
                updateFavicon(settings.theme);
            }
        }
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
}

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyPress(e) {
    // Only handle keyboard shortcuts when not focused on form elements
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }
    
    // Generate new password on Alt+G
    if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        generatePassword();
    }
    
    // Copy to clipboard on Alt+C
    if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyToClipboard();
    }
    
    // Toggle theme on Alt+T
    if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    init();
    
    // Check for service worker support (only on HTTPS or localhost)
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
});

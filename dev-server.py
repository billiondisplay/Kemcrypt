#!/usr/bin/env python3
"""
Kemcrypt Password Generator - Development Server
A simple HTTP server for local development with proper MIME types and CORS support.
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import unquote

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with proper MIME types"""
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Cache control for development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        super().end_headers()
    
    def guess_type(self, path):
        """Override to add custom MIME types"""
        mimetype = super().guess_type(path)
        
        # Add proper MIME types for web app files
        if path.endswith('.svg'):
            return 'image/svg+xml'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        elif path.endswith('.webmanifest'):
            return 'application/manifest+json'
            
        return mimetype
    
    def log_message(self, format, *args):
        """Colorized logging for better readability"""
        message = format % args
        if '200' in message:
            status_color = '\033[92m'  # Green for success
        elif '304' in message:
            status_color = '\033[94m'  # Blue for not modified
        elif '404' in message:
            status_color = '\033[91m'  # Red for not found
        else:
            status_color = '\033[93m'  # Yellow for others
        
        reset_color = '\033[0m'
        print(f"{status_color}{message}{reset_color}")

def run_server():
    """Start the development server"""
    
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("\n" + "="*60)
        print("🔐 Kemcrypt Password Generator - Development Server")
        print("="*60)
        print(f"\n✅ Server running at:")
        print(f"   → http://localhost:{PORT}")
        print(f"   → http://127.0.0.1:{PORT}")
        
        # Try to get local IP
        try:
            import socket
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            print(f"   → http://{local_ip}:{PORT} (Network)")
        except:
            pass
        
        print(f"\n📁 Serving directory: {os.getcwd()}")
        print(f"\n🛑 Press Ctrl+C to stop the server")
        print("="*60 + "\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            print("="*60)
            sys.exit(0)

if __name__ == "__main__":
    run_server()

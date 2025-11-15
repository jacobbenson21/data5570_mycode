// API Configuration
// Update this with your AWS EC2 instance URL

// For development (local Django server)
const LOCAL_API_URL = 'http://localhost:8000/api';

// For production (AWS EC2 instance)
// Replace with your EC2 instance's public IP or domain name
// Example: 'http://54.123.45.67:8000/api'
// Or if you have a domain: 'https://api.yourdomain.com/api'
const PRODUCTION_API_URL = 'https://count-gear-chance-instant.trycloudflare.com/api';

// Use environment variable or default to production (EC2)
// You can set EXPO_PUBLIC_API_URL in .env file or when running expo
// For now, always use EC2 URL since backend is on EC2
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API_URL;

// Helper to get full URL for an endpoint
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure trailing slash for Django REST Framework
  const endpointWithSlash = cleanEndpoint.endsWith('/') ? cleanEndpoint : `${cleanEndpoint}/`;
  return `${API_BASE_URL}/${endpointWithSlash}`;
};


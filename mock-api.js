// mock-api.js
const https = require('https');
const fs = require('fs');

// Read the environment variables from .env.local
let apiUrl = '';
try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const apiUrlMatch = envFile.match(/NEXT_PUBLIC_API_URL=(.+)/);
  if (apiUrlMatch && apiUrlMatch[1]) {
    apiUrl = apiUrlMatch[1].trim();
  }
} catch (err) {
  console.error('Error reading .env.local:', err.message);
}

// If not found in .env.local, try .env
if (!apiUrl) {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const apiUrlMatch = envFile.match(/NEXT_PUBLIC_API_URL=(.+)/);
    if (apiUrlMatch && apiUrlMatch[1]) {
      apiUrl = apiUrlMatch[1].trim();
    }
  } catch (err) {
    console.error('Error reading .env:', err.message);
  }
}

// Fallback to localhost if no environment variable is found
const BASE_URL = apiUrl || 'https://healthcare-app.wittycliff-1e4668a8.eastus.azurecontainerapps.io/ ';

console.log('Using API URL:', BASE_URL);

// Simulate making an API request
const url = `${BASE_URL}/doctors`;
console.log('Making a GET request to:', url);

// Check if URL is valid and accessible
try {
  const urlObj = new URL(url);
  console.log('URL is valid. Protocol:', urlObj.protocol, 'Host:', urlObj.host, 'Path:', urlObj.pathname);

  // Make a real request to the API (this might fail if the API is not actually accessible)
  const req = https.request(url, (res) => {
    console.log('Response status code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response data:', data.substring(0, 100) + '...');
    });
  });
  
  req.on('error', (error) => {
    console.error('Request failed:', error.message);
  });
  
  req.end();
} catch (error) {
  console.error('URL is invalid or request failed:', error.message);
} 
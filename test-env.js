// test-env.js
console.log('Checking environment variables:');
console.log('Node.js process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Has env variable?', !!process.env.NEXT_PUBLIC_API_URL);

// If dotenv is installed, try loading from .env file
try {
  require('dotenv').config();
  console.log('After dotenv loaded:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
} catch (error) {
  console.log('dotenv not installed, skipping');
}

// Check for .env file existence
const fs = require('fs');
console.log('\nChecking for env files:');
['.env', '.env.local', '.env.development', '.env.production'].forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`${file} exists`);
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Only show if it contains the variable we're looking for
      if (content.includes('NEXT_PUBLIC_API_URL')) {
        console.log(`${file} contains NEXT_PUBLIC_API_URL variable`);
      }
    } catch (err) {
      console.log(`Error reading ${file}:`, err.message);
    }
  } else {
    console.log(`${file} does not exist`);
  }
}); 
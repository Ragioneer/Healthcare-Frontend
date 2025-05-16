const fs = require('fs');

// Read the .env.local file directly
try {
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  console.log('.env.local file contents:');
  console.log(envLocal);

  // Extract the API URL value 
  const apiUrlMatch = envLocal.match(/NEXT_PUBLIC_API_URL=(.+)/);
  if (apiUrlMatch && apiUrlMatch[1]) {
    console.log('\nExtracted API URL:', apiUrlMatch[1]);
  }
} catch (err) {
  console.log('Error reading .env.local:', err.message);
}

// Read the .env file directly
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  console.log('\n.env file contents:');
  console.log(envFile);

  // Extract the API URL value
  const apiUrlMatch = envFile.match(/NEXT_PUBLIC_API_URL=(.+)/);
  if (apiUrlMatch && apiUrlMatch[1]) {
    console.log('\nExtracted API URL:', apiUrlMatch[1]);
    
    // Check if there are any hidden characters or trailing spaces
    const apiUrl = apiUrlMatch[1];
    console.log('API URL length:', apiUrl.length);
    console.log('API URL character codes:');
    for (let i = 0; i < apiUrl.length; i++) {
      console.log(`  Char at position ${i}: "${apiUrl[i]}" (code: ${apiUrl.charCodeAt(i)})`);
    }
  }
} catch (err) {
  console.log('Error reading .env:', err.message);
} 
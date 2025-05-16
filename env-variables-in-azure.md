# Environment Variables in Next.js with Azure Container Apps

## Problem: Environment Variables in Next.js

In your frontend application, you're encountering a common issue with how Next.js handles environment variables:

- **Client-side environment variables** (prefixed with `NEXT_PUBLIC_`) are embedded into your JavaScript bundle **at build time**
- This means you can't easily change them after deployment without rebuilding the app

## Test Results

Our tests showed:

1. The environment variable exists in both `.env` and `.env.local` files
2. The URL format is correct: `https://healthcare-app.wittycliff-1e4668a8.eastus.azurecontainerapps.io`
3. Node.js can correctly read this URL when accessing the files directly
4. **But**: The client-side code in your Next.js app is still using the hard-coded fallback value

## Solutions

### 1. Rebuild Approach (Simple but Requires Redeploy)

Every time your API URL changes:

1. Update your environment variable in your build environment
2. Rebuild your Next.js application 
3. Redeploy the container

```bash
# Example build command
NEXT_PUBLIC_API_URL=https://your-new-api.com npm run build
```

### 2. Runtime Configuration Approach (More Flexible)

Create a runtime configuration endpoint:

1. Create an API endpoint in your Next.js app that returns configuration:

```js
// pages/api/config.js
export default function handler(req, res) {
  res.status(200).json({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  });
}
```

2. Create a custom hook to fetch this configuration:

```js
// hooks/useConfig.js
import { useState, useEffect } from 'react';

export function useConfig() {
  const [config, setConfig] = useState({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  });
  
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
      })
      .catch(err => console.error('Failed to load config:', err));
  }, []);
  
  return config;
}
```

3. Use this hook in your components:

```jsx
function MyComponent() {
  const { apiUrl } = useConfig();
  
  // Now use apiUrl for API calls
  // This will use the build-time value initially, but update with server-provided value
}
```

### 3. Azure-specific Setup

In Azure Container Apps:

1. Go to your Container App in the Azure portal
2. Navigate to **Configuration** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your API URL

**Important**: For the runtime approach (Solution #2), the server-side code will use this value, but the initial client-side code will still use the value from build time until the config API call completes.

## Best Practice for Your Case

1. Use the fallback pattern in your code (you already have this):
   ```js
   const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
   ```

2. Make sure to set the environment variable in Azure Container Apps

3. Consider implementing the runtime configuration approach if you need to change the API URL frequently without rebuilding

---

Remember: Client-side environment variables in Next.js are a build-time feature, not a runtime feature! 
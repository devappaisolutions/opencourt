# Google Maps Setup Guide

## Getting Your Google Maps API Key

To use Google Maps in the OpenCourt application, you'll need to obtain an API key from Google Cloud Console.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "New Project"
5. Enter a project name (e.g., "OpenCourt")
6. Click "Create"

### Step 2: Enable the Maps JavaScript API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Maps JavaScript API"
3. Click on it and press **Enable**
4. Also enable "Places API" (optional, for future features)

### Step 3: Create API Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Your API key will be created and displayed
4. **Important**: Click "Restrict Key" to secure it

### Step 4: Restrict Your API Key (Recommended)

1. Under **Application restrictions**, select "HTTP referrers (web sites)"
2. Add these referrers:
   - `http://localhost:3000/*` (for local development)
   - `https://yourdomain.com/*` (for production)
3. Under **API restrictions**, select "Restrict key"
4. Select:
   - Maps JavaScript API
   - Places API (if you enabled it)
5. Click **Save**

### Step 5: Add the API Key to Your Project

1. Open the `.env.local` file in your project root
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
```

3. **Restart your development server** for the changes to take effect:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

### Step 6: Enable Billing (Required)

Google Maps requires a billing account, but they offer:
- **$200 free credit per month**
- Pay-as-you-go pricing after that
- Most small to medium apps stay within the free tier

To enable billing:
1. Go to **Billing** in Google Cloud Console
2. Link a payment method
3. The free tier should cover most development and small production usage

### Pricing Information

- **Maps JavaScript API**: $7 per 1,000 loads (after free tier)
- **Free tier**: $200/month = ~28,500 map loads per month
- More info: [Google Maps Pricing](https://mapsplatform.google.com/pricing/)

## Troubleshooting

### Map Not Showing?

1. **Check the browser console** for error messages
2. **Verify API key** is correctly set in `.env.local`
3. **Restart dev server** after adding the API key
4. **Check API restrictions** - make sure localhost is allowed
5. **Verify billing** is enabled on your Google Cloud project

### "This page can't load Google Maps correctly"

This usually means:
- API key is missing or incorrect
- Billing is not enabled
- API restrictions are too strict
- Maps JavaScript API is not enabled

## Features Included

✅ **Dark theme** matching your app's design  
✅ **Custom markers** with primary color scheme  
✅ **User location** marker (blue)  
✅ **Game location** markers (purple)  
✅ **Info windows** with game details  
✅ **Responsive** and mobile-friendly  

## Future Enhancements

- Add geocoding to convert text addresses to coordinates
- Store lat/lng in the database for games
- Add clustering for many nearby games
- Add directions to game locations
- Add search/autocomplete for locations

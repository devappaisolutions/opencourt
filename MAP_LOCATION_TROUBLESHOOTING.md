# Map Location Troubleshooting Guide

## Why isn't the map showing my current location?

### Quick Checklist:

1. **Check Browser Console** (F12 → Console tab)
   - Look for messages starting with 🗺️, ✅, or ❌
   - This will tell you exactly what's happening

2. **Grant Location Permission**
   - Look for a permission prompt in your browser's address bar
   - Click "Allow" when asked for location access
   - If you previously blocked it, you'll need to reset permissions

3. **Check Browser Permissions**
   - Click the lock icon (🔒) in the address bar
   - Find "Location" and set it to "Allow"
   - Refresh the page

### Common Issues & Solutions:

#### 1. Permission Denied
**Symptoms**: Map shows New York instead of your location  
**Console shows**: `❌ Geolocation error: User denied Geolocation`

**Solution**:
- Click the lock icon (🔒) in your browser's address bar
- Reset location permissions
- Refresh the page and click "Allow" when prompted

#### 2. Location Timeout
**Symptoms**: Takes a long time, then shows default location  
**Console shows**: `❌ Geolocation error: Timeout expired`

**Solution**:
- Check if your device's location services are enabled
- Try refreshing the page
- Make sure you're not using a VPN that blocks location

#### 3. HTTPS Required (Production Only)
**Symptoms**: Works on localhost but not on deployed site  
**Console shows**: `❌ Geolocation error: Only secure origins are allowed`

**Solution**:
- Geolocation requires HTTPS in production
- Make sure your deployed site uses HTTPS
- Localhost (http://localhost:3000) should work fine

#### 4. Browser Doesn't Support Geolocation
**Symptoms**: Map always shows default location  
**Console shows**: `❌ Geolocation is not supported by this browser`

**Solution**:
- Update your browser to the latest version
- Try a modern browser (Chrome, Firefox, Edge, Safari)

### How to Reset Location Permissions:

**Chrome/Edge**:
1. Click the lock icon (🔒) in the address bar
2. Click "Site settings"
3. Find "Location" and change to "Allow"
4. Refresh the page

**Firefox**:
1. Click the lock icon (🔒) in the address bar
2. Click "Clear permissions and reload"
3. Allow location when prompted

**Safari**:
1. Safari → Settings → Websites → Location
2. Find localhost and set to "Allow"
3. Refresh the page

### Testing Your Location:

1. Open the browser console (F12 → Console)
2. Navigate to the map page
3. Look for these messages:
   - `🗺️ Requesting user location...` - Location request started
   - `✅ Location obtained: [lat], [lng]` - Success! Your coordinates
   - `❌ Geolocation error: [reason]` - Something went wrong

### Default Behavior:

If location access is denied or fails, the map will:
- Show New York City (40.7128, -74.0060) as the default location
- Display a blue marker at the default location
- Still work normally, just not centered on your actual location

### Still Not Working?

1. **Check browser console** for specific error messages
2. **Try a different browser** to rule out browser-specific issues
3. **Check device settings** - make sure location services are enabled
4. **Disable VPN/Proxy** temporarily to test
5. **Clear browser cache** and try again

### Privacy Note:

Your location is:
- ✅ Only used to center the map
- ✅ Never stored in the database
- ✅ Never sent to any server
- ✅ Only processed in your browser
- ✅ You can deny permission and still use the app

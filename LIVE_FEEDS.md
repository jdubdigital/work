# 🎥 Live Traffic Feeds for Testing

## Option 1: YouTube Live Traffic Cameras (Recommended)

### Popular 24/7 Traffic Streams

**Highway/Freeway Cameras:**
1. **Los Angeles Traffic** - Multiple lanes, good lighting
   - Search: "Los Angeles traffic live camera"
   - Example: Multiple highway cams on YouTube

2. **Tokyo Traffic** - Dense traffic, motorcycles/bikes
   - Search: "Tokyo traffic live camera Shibuya"
   - Great for testing multiple vehicle types

3. **London Traffic** - Buses, cars, taxis
   - Search: "London traffic live camera"
   - Good for bus detection

4. **New York City** - Mixed traffic
   - Search: "NYC traffic camera live"
   - Variety of vehicle types

**How to Use YouTube Feeds:**

### Method A: Virtual Camera (Best Quality)

**Windows:**
1. Download OBS Studio: https://obsproject.com/
2. Install OBS Virtual Camera plugin
3. Add Browser Source in OBS pointing to YouTube stream
4. Start Virtual Camera
5. In the app, select "OBS Virtual Camera"

**Mac:**
1. Download CamTwist: http://camtwiststudio.com/
2. Add Desktop+ or Webcam source
3. Play YouTube video fullscreen on secondary display
4. Select CamTwist in the app

**Linux:**
1. Install v4l2loopback:
   ```bash
   sudo apt install v4l2loopback-dkms
   sudo modprobe v4l2loopback
   ```
2. Use ffmpeg to pipe video to virtual device:
   ```bash
   # For YouTube (requires youtube-dl)
   youtube-dl -f best -g [YOUTUBE_URL] | \
   ffmpeg -i - -f v4l2 /dev/video2
   ```

### Method B: Screen Capture (Simple)

1. Open YouTube traffic stream in one window
2. Use browser's screen sharing
3. Many browsers support "Share Screen" as a camera source
4. In the app, look for "Screen" or "Display" in camera dropdown

---

## Option 2: Public Traffic Camera Websites

Many cities provide public access to traffic cameras:

### Direct Camera Streams

**US Cities:**
- **San Diego**: https://www.caltrans.ca.gov/
- **Seattle**: https://www.wsdot.com/traffic/
- **Miami**: https://fl511.com/
- **Chicago**: https://www.chicagotraveler.com/

**International:**
- **UK**: https://www.trafficengland.com/
- **Japan**: Various prefecture websites
- **Europe**: Individual country DOT websites

**Note:** Most require converting to virtual camera (see Method A above)

---

## Option 3: Video File Upload (Easiest!) ⭐

### NEW: Direct Video File Support

The app now supports loading video files directly - no virtual camera needed!

**How to Use:**
1. Open the app
2. Select "Video File" radio button (instead of "Webcam")
3. Click "Choose File" and select a traffic video
4. Click "Start" - the video will play and loop automatically
5. Position counting lines and test!

**Supported Formats:**
- MP4 (H.264) - Recommended
- WebM
- MOV (on Safari/Mac)
- OGG

### Download Free Test Videos

**Pexels (Free Stock Videos - No Account Required):**

Direct download links:
```
https://www.pexels.com/search/videos/traffic/
https://www.pexels.com/search/videos/highway%20traffic/
https://www.pexels.com/search/videos/car%20traffic/
```

**Recommended Videos:**
1. **Highway Traffic** - Multi-lane, good for speed testing
   - Search: "highway traffic time lapse"
   - Resolution: 1920x1080 or higher
   
2. **City Intersection** - Multiple vehicle types
   - Search: "city intersection traffic"
   - Good for class detection testing
   
3. **Parking Lot** - Slow-moving vehicles
   - Search: "parking lot cars"
   - Good for accurate counting

**Pixabay (Also Free):**
```
https://pixabay.com/videos/search/traffic/
```

**YouTube Downloads (for video file testing):**

You can download YouTube traffic videos and load them directly:

```bash
# Install yt-dlp (modern youtube-dl alternative)
pip install yt-dlp

# Download a traffic video
yt-dlp -f "best[height<=1080]" [YOUTUBE_URL]

# Example URLs to search for:
# "4K highway traffic" - High quality highway footage
# "traffic time lapse" - Condensed traffic patterns
# "dash cam highway" - Driver perspective
```

**Example Videos to Search:**
- "Tokyo Shibuya Crossing 4K" - Pedestrians and vehicles
- "Highway Traffic Time Lapse" - Multiple lanes
- "Dashboard Camera Highway Drive" - Continuous traffic
- "City Traffic Intersection" - Mixed vehicle types

---

## Option 4: Test with This Sample Setup

### Quick Test URLs (YouTube Search Terms)

Copy these into YouTube search to find live streams:

```
"live traffic camera 24/7"
"highway traffic live"
"city traffic camera live stream"
"freeway live cam"
"traffic cam live feed"
```

### Recommended Channels

Look for channels that stream:
- ✅ Fixed camera angle (not panning)
- ✅ Good lighting (daytime or well-lit night)
- ✅ Clear view of vehicles
- ✅ Not too crowded (for testing)
- ✅ Perpendicular or angled view (not from behind vehicles)

---

## Testing Tips

### Best Camera Angles
- **Perpendicular**: Camera viewing traffic from the side (best for counting)
- **Angled**: 30-45 degree angle to traffic flow
- ❌ Avoid: Directly behind or in front of traffic (hard to count)

### Optimal Conditions
- **Lighting**: Daytime or well-lit areas
- **Speed**: Moderate speed (20-60 km/h is ideal)
- **Density**: 2-5 vehicles visible at once (not too crowded)
- **Resolution**: 720p or higher

### Line Placement
1. Enable Edit Mode
2. Place counting line perpendicular to traffic flow
3. Position line where vehicles are clear and unoccluded
4. Adjust to avoid shadows or glare

---

## Advanced: Direct Video File Support

I can add support for loading video files directly. Would you like me to add a feature to:
- Upload video file (MP4, WebM)
- Use video file instead of webcam
- Loop video for continuous testing

Let me know if you'd like this enhancement!

---

## Troubleshooting Live Feeds

### Virtual Camera Not Appearing
- Restart browser after installing virtual camera software
- Check if virtual camera is enabled in software settings
- Try a different browser (Chrome usually has best support)

### Poor Detection Quality
- Increase video quality/resolution in stream settings
- Adjust confidence threshold to 0.3-0.4
- Ensure good lighting in the feed
- Avoid heavily compressed streams

### Performance Issues with Streams
- Lower the stream quality
- Reduce inference rate in app (edit CONFIG.INFERENCE_INTERVAL to 200)
- Close other applications
- Use hardware-accelerated browser (enable GPU in chrome://flags)

---

## Quick Start Example

### Method 1: Video File (Fastest - 2 Minutes) ⭐

1. **Download a Test Video**
   ```
   Go to: https://www.pexels.com/video/traffic-flow-857195/
   Click "Download" → Select 1920x1080
   Save to your computer
   ```

2. **Load in App**
   ```
   Open the vehicle counter app
   Select "Video File" radio button
   Click "Choose File" → Select downloaded video
   Click "Start"
   ```

3. **Test Features**
   ```
   Position counting lines across lanes
   Enable heatmap visualization
   Test speed estimation
   Watch it count automatically!
   ```

### Method 2: Virtual Camera (5 Minutes)

1. **Find a Stream**
   ```
   Open YouTube → Search "tokyo traffic live camera"
   Select any 24/7 live stream
   ```

2. **Setup Virtual Camera**
   ```
   Install OBS Studio
   Add Window Capture → Select browser with YouTube
   Start Virtual Camera
   ```

3. **Test in App**
   ```
   Open the vehicle counter app
   Select "Webcam" radio button
   Select "OBS Virtual Camera"
   Click "Start"
   Position counting lines
   Watch it count!
   ```

---

## Recommended Test Scenarios

### Scenario 1: Highway Traffic (Speed Testing)
- Find multi-lane highway cam
- Add 2 lines 50-100 pixels apart
- Calibrate to ~5 meters
- Test speed estimation

### Scenario 2: City Intersection (Multi-Class)
- Find city intersection cam
- Look for cars, buses, motorcycles, bikes
- Test class filtering
- Test directional counting (turn lanes)

### Scenario 3: Parking Lot (Low Speed)
- Find parking lot entrance cam
- Test accurate counting at slow speeds
- Test track persistence

---

## Privacy Note

When using public streams or cameras:
- ✅ All processing still happens locally
- ✅ No video is uploaded or stored
- ✅ Only live analysis in browser memory
- ⚠️ Be mindful of streaming public camera content

---

## Need Help?

If you have trouble finding or setting up a feed:
1. Check the TEST_PLAN.md for demo mode instructions
2. Try the screen capture method (simplest)
3. Use a toy car and your webcam for basic testing
4. Look for "EarthCam" on YouTube (high-quality public cams)

**Popular Working Streams (as of 2024):**
- EarthCam: Multiple cities worldwide
- Webcam Tokyo: Shibuya crossing
- Live Traffic Camera channels on YouTube
- Freeway cams from state DOT websites

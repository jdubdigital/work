# 🎬 Video Sources for Testing - Quick Reference

## ✨ NEW: Video File Upload Feature

The app now supports **direct video file uploads**! No need for virtual cameras or complex setup.

### How to Use Video Files

1. **Select "Video File"** radio button (instead of "Webcam")
2. **Click "Choose File"** and select a traffic video
3. **Click "Start"** - video plays and loops automatically
4. Test all features with realistic traffic footage!

---

## 🎥 Free Test Video Sources

### Recommended: Pexels (No Account Needed)

**Best for Quick Testing:**

1. **Highway Traffic (Multi-lane)**
   - URL: https://www.pexels.com/video/traffic-flow-857195/
   - Great for: Speed testing, multi-lane counting
   - Download: 1920x1080, ~30 seconds

2. **City Intersection**
   - Search: https://www.pexels.com/search/videos/traffic%20intersection/
   - Great for: Multiple vehicle types, directional counting
   - Look for: Clear side view, moderate traffic

3. **Highway Dash Cam**
   - Search: https://www.pexels.com/search/videos/highway%20driving/
   - Great for: Continuous flow, realistic scenarios
   - Look for: Good lighting, clear vehicles

### Alternative: Pixabay

```
https://pixabay.com/videos/search/traffic/
```
- Free, no attribution required
- Search terms: "highway traffic", "cars road", "city traffic"

---

## 📺 YouTube Live Traffic Cameras

### Top Recommended Streams

**For Virtual Camera Use:**

1. **Tokyo Traffic (Shibuya Crossing)**
   - Search: "Shibuya crossing live camera"
   - Features: Pedestrians, cars, buses, motorcycles
   - Available: 24/7

2. **Los Angeles Highways**
   - Search: "LA freeway live traffic"
   - Features: Multi-lane highways, varied speeds
   - Available: Mostly daytime

3. **London Traffic**
   - Search: "London traffic camera live"
   - Features: Buses, taxis, cars
   - Available: Various locations

4. **New York City**
   - Search: "NYC traffic live camera"
   - Features: Dense urban traffic
   - Available: Multiple locations

### How to Use YouTube Streams

**Option 1: Download & Upload (Easiest)**
```bash
# Install yt-dlp
pip install yt-dlp

# Download a segment (10 minutes)
yt-dlp -f "best[height<=1080]" --download-sections "*0:00-10:00" [YOUTUBE_URL]

# Upload the downloaded file to the app
```

**Option 2: Virtual Camera (Live)**
- Use OBS Studio to capture YouTube stream
- Route through OBS Virtual Camera
- Select in app's webcam dropdown
- See full guide in LIVE_FEEDS.md

---

## 🎯 Quick Start for Testing

### 2-Minute Setup

```bash
1. Go to https://www.pexels.com/video/traffic-flow-857195/
2. Click "Free Download" → Choose 1920x1080
3. Open vehicle counter app
4. Select "Video File"
5. Choose downloaded video
6. Click "Start"
7. Test all features!
```

### What to Test

- **Basic Counting**: Position line across lanes, watch counts
- **Multi-Lane**: Add 3-4 lines for different lanes
- **Speed Estimation**: 
  - Add 2 lines 100 pixels apart
  - Estimate real distance (e.g., 10m)
  - Calibrate and watch speeds
- **Class Detection**: Look for cars, trucks, motorcycles
- **Heatmap**: Enable trails to see vehicle paths

---

## 🔍 Finding Good Test Videos

### Search Terms (YouTube or Stock Sites)

**Best Results:**
- "highway traffic time lapse"
- "freeway aerial view"
- "traffic camera footage"
- "dash cam highway"
- "city intersection traffic"

**Quality Checklist:**
- ✅ Side view (perpendicular to traffic)
- ✅ Clear, unobstructed vehicles
- ✅ Good lighting (daytime preferred)
- ✅ Moderate traffic density (not too crowded)
- ✅ Stable camera (not handheld)
- ❌ Avoid: Low quality, nighttime, heavy rain, extreme angles

---

## 📊 Performance Tips for Video Files

### Optimal Video Specs
- **Resolution**: 1920x1080 or 1280x720
- **Frame Rate**: 25-30 FPS
- **Format**: MP4 (H.264 codec)
- **Duration**: 30 seconds to 5 minutes (loops automatically)

### If Performance is Slow
1. Use lower resolution video (720p instead of 4K)
2. Convert to 30 FPS if higher
3. Reduce app inference rate (see README)
4. Close other browser tabs

---

## 🌐 Public Traffic Camera Feeds

### Government Traffic Cameras

**United States:**
- Caltrans (California): https://cwwp2.dot.ca.gov/
- WSDOT (Washington): https://wsdot.com/travel/real-time/
- 511 Systems: Search "[Your State] 511 cameras"

**International:**
- UK: https://www.trafficengland.com/
- Australia: https://www.livetraffic.com/
- Japan: Prefecture-specific traffic info sites

**Note:** Most require virtual camera setup or download

---

## 💡 Pro Tips

### Best Traffic Patterns
- **Morning Rush Hour** (7-9 AM): Dense but moving traffic
- **Midday** (11 AM-2 PM): Moderate, easier to count
- **Evening Rush** (5-7 PM): Heavy, tests performance

### Camera Angles
- **Perpendicular**: Best for counting (side view)
- **45° Angle**: Good for depth and multiple lanes
- **Overhead**: Excellent but rare in public feeds

### Testing Scenarios
1. **Single Lane**: Basic counting accuracy
2. **Multi-Lane**: Lane-based statistics
3. **Intersection**: Directional (turn vs straight)
4. **Mixed Traffic**: Car, truck, bus, motorcycle detection

---

## 🆘 Troubleshooting Video Sources

### Video File Won't Load
- Check format: Use MP4 or WebM
- Try converting with VLC or FFmpeg
- Ensure file size < 500MB for browser memory

### Virtual Camera Not Working
- Restart browser after installing
- Check OBS/CamTwist is running
- Try different browser (Chrome recommended)

### Poor Detection
- Use daytime footage (better lighting)
- Avoid compressed/low-quality videos
- Position camera perpendicular to traffic
- Adjust confidence threshold to 0.3-0.4

---

## 📋 Example Test Videos

### Curated List (Search Terms)

| Video Type | Search Term | Best For |
|------------|-------------|----------|
| Highway | "highway traffic aerial" | Speed, multi-lane |
| City | "city traffic intersection" | Mixed types, turns |
| Parking | "parking lot traffic" | Slow speed, accuracy |
| Bridge | "bridge traffic camera" | Clear side view |
| Tunnel | "tunnel traffic" | Controlled lighting |

---

## 🎓 Educational Use

### Great for Learning
- Computer vision concepts
- Object detection algorithms
- Tracking systems
- Real-time processing

### Demo Scenarios
- Show counting accuracy
- Demonstrate speed estimation
- Visualize heatmaps
- Test different vehicle types

---

## 🔗 Useful Links

- **LIVE_FEEDS.md**: Complete guide with virtual camera setup
- **README.md**: Full documentation and troubleshooting
- **TEST_PLAN.md**: Comprehensive testing procedures
- **QUICKSTART.md**: 60-second setup guide

---

**Need Help?** See full documentation or open an issue on GitHub.

**Quick Links:**
- Pexels Traffic Videos: https://www.pexels.com/search/videos/traffic/
- Pixabay Traffic: https://pixabay.com/videos/search/traffic/
- Virtual Camera Guide: See LIVE_FEEDS.md

# 🚀 Quick Start Guide

Get the vehicle counter running in **under 2 minutes**!

## Step 1: Start Local Server

Open terminal in the project directory and run:

```bash
# Using Python 3
python -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js
npx http-server -p 8000
```

## Step 2: Open in Browser

Open Chrome and navigate to:
```
http://localhost:8000
```

## Step 3: Wait for Model Load

The app will download the COCO-SSD model (~13MB) on first load. Wait for the loading spinner to disappear.

## Step 4: Start Detection

1. **Select your camera** from the dropdown menu
2. Click **"Start Camera"** button
3. Grant camera permissions when prompted
4. You should now see live vehicle detection!

## Step 5: Set Up Counting

1. **Drag the line endpoints** to position the counting line across the traffic flow
2. The **"IN"** label shows the entry direction
3. The **"OUT"** label shows the exit direction
4. Watch the counts update in the HUD panel on the left

## Tips for Testing Without Live Traffic

If you don't have a live traffic view:

1. **Use video playback**: Play a traffic video on another screen and point your webcam at it
2. **Use toy cars**: Move toy cars across your desk
3. **Use YouTube**: Search for "traffic camera live" and point your webcam at the screen
4. **Use test videos**: Download traffic footage and use browser extensions to feed it as webcam input

## Adjusting for Best Results

- **Low FPS?** → Reduce "Inference FPS" slider to 5-10
- **Missing vehicles?** → Lower "Confidence Threshold" to 0.3-0.4
- **Too many false positives?** → Raise "Confidence Threshold" to 0.6-0.7
- **Want heatmap?** → Enable "Show Heatmap" checkbox

## Testing Features

### Lane-Based Counting
1. Click **"+ Add Line"** to add more counting lines
2. Each line tracks counts independently
3. Drag endpoints to position lines in different lanes

### Heatmap Visualization
1. Enable **"Show Heatmap"** checkbox
2. Adjust **"Heatmap Opacity"** slider
3. Adjust **"Trail Decay"** slider (higher = trails last longer)
4. Watch the heatmap build up over time

### Class Filtering
1. Uncheck vehicle classes you don't want to detect
2. For example, uncheck "bicycle" if you only want motorized vehicles
3. Counts update immediately

### Line Management
1. Click **"👁️ Hide"** to toggle line visibility
2. Click **"✕"** to delete a line
3. **"Reset Counts"** button clears all counts

## Performance Testing

Monitor the HUD panel:
- **FPS**: Should be 20-30 for smooth video
- **Inference**: Should be under 100ms on modern laptops
- **Tracked**: Number of currently tracked vehicles

If performance is poor:
1. Lower "Inference FPS" to 5-10
2. Close other browser tabs
3. Check that backend is "webgl" in browser console

## Troubleshooting

### Camera Not Working
- Check browser permissions (click lock icon in address bar)
- Try refreshing the page
- Try a different browser (Chrome recommended)

### Model Not Loading
- Check your internet connection (needed for first load only)
- Check browser console for errors (F12)
- Try clearing browser cache

### No Detections
- Ensure good lighting conditions
- Lower confidence threshold
- Ensure vehicles are clearly visible
- Check that vehicle classes are enabled

## Next Steps

Once everything is working:
- Read the full **README.md** for detailed documentation
- Explore advanced features and customization options
- Check out the code architecture in **app.js**

**Enjoy counting vehicles! 🚗🚙🚕**

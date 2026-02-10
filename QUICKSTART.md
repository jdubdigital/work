# 🚀 Quick Start Guide

## 60-Second Setup

### 1. Run Local Server
Choose any method:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

### 2. Open Browser
Navigate to: `http://localhost:8000`

### 3. Start Detection
1. Click "Select Camera" dropdown → choose your webcam
2. Click "Start Camera" button
3. Wait 5 seconds for model to load
4. Green boxes appear around vehicles ✅

## Features at a Glance

### ✅ Implemented & Working

| Feature | Status | Description |
|---------|--------|-------------|
| **Real-time Detection** | ✅ | COCO-SSD detects vehicles at 10 FPS |
| **Object Tracking** | ✅ | IOU tracker assigns unique IDs |
| **Counting Lines** | ✅ | Draggable lines count IN/OUT |
| **Multiple Lanes** | ✅ | Add unlimited named lines |
| **Heatmap/Trails** | ✅ | Visual paths with decay |
| **Speed Estimation** | ✅ | Calibrated speed between lines |
| **Class Filtering** | ✅ | Toggle car/truck/bus/motorcycle/bicycle |
| **Directional Counts** | ✅ | Separate IN and OUT totals |
| **Per-Class Stats** | ✅ | Counts broken down by vehicle type |
| **Per-Lane Stats** | ✅ | Independent counts per line |
| **Live HUD** | ✅ | FPS, inference time, tracked count |
| **Interactive UI** | ✅ | Edit mode to drag line endpoints |
| **Dark Mode** | ✅ | Professional dark theme |
| **Privacy-First** | ✅ | 100% local processing |

## Testing Checklist

### Basic Functionality
- [ ] Camera starts successfully
- [ ] Detections appear (green boxes)
- [ ] Track IDs are consistent across frames
- [ ] Counting lines are visible
- [ ] Counts increment when vehicles cross lines
- [ ] IN/OUT directions work correctly

### Advanced Features
- [ ] Add new counting line with "+ Add Line"
- [ ] Enable edit mode and drag line endpoints
- [ ] Toggle vehicle classes on/off
- [ ] Adjust confidence threshold slider
- [ ] Enable heatmap and see trails
- [ ] Enable speed estimation and calibrate
- [ ] Reset counts button clears statistics
- [ ] Pause/resume inference works

### Performance
- [ ] FPS > 20 on modern laptop
- [ ] Inference time < 100ms
- [ ] No memory leaks (check Task Manager after 5 minutes)
- [ ] Smooth rendering without stuttering

## Common Test Scenarios

### Scenario 1: Parking Lot Entrance
1. Position line across entrance
2. Drive a vehicle through
3. Verify count increments
4. Drive back through
5. Verify opposite direction count increases

### Scenario 2: Multi-Lane Highway
1. Add 3-4 lines for different lanes
2. Name them "Lane 1", "Lane 2", etc.
3. Monitor traffic in each lane
4. Check per-lane statistics panel

### Scenario 3: Speed Trap
1. Add exactly 2 counting lines
2. Measure real distance between them (e.g., 5 meters)
3. Enable speed estimation
4. Enter calibration distance
5. Drive vehicle through both lines
6. Check average speed in statistics

## Performance Benchmarks

### Expected Performance (2020+ Laptop)

| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| FPS | 30-60 | 20-30 | <20 |
| Inference Time | 30-50ms | 50-100ms | >100ms |
| GPU Backend | WebGL | WebGL | CPU |
| Detection Rate | >90% | 70-90% | <70% |

### If Performance is Poor

1. **Check Backend**: Open console, verify "webgl" not "cpu"
2. **Reduce Resolution**: Edit `CONFIG.TARGET_WIDTH` to 320
3. **Increase Interval**: Edit `CONFIG.INFERENCE_INTERVAL` to 200
4. **Disable Heatmap**: Uncheck "Show Heatmap/Trails"
5. **Close Tabs**: Free up browser memory

## Demo Mode (No Camera)

To test without a real camera, you can:

1. Use a virtual camera with pre-recorded video
2. On Windows: Install OBS Virtual Camera
3. On Mac: Install CamTwist
4. On Linux: Use v4l2loopback

Then play a traffic video and select the virtual camera.

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Camera not listed | Reload page, check USB connection |
| Permission denied | Click 🔒 in address bar, allow camera |
| Model won't load | Check internet (CDN downloads model) |
| No detections | Point at vehicles, increase lighting |
| Slow performance | Close other apps, use Chrome |
| Lines don't draw | Enable edit mode, drag endpoints |
| Counts not working | Ensure vehicles fully cross line |

## Next Steps

Once basic testing works:

1. **Experiment with Thresholds**: Find optimal confidence/IOU values
2. **Test Different Scenes**: Indoor, outdoor, night, day
3. **Calibrate Speed**: Measure exact distances for accuracy
4. **Monitor Long-term**: Let it run for 10+ minutes, check stability
5. **Read README**: Full documentation with technical details

## Support

- **Documentation**: See `README.md` for comprehensive guide
- **Browser Console**: Press F12 to see detailed logs
- **Performance**: Check TensorFlow.js memory with `tf.memory()`

---

**Ready to count! 🚗💨**

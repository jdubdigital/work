# 📝 Usage Examples & Common Scenarios

This guide shows how to configure the vehicle counter for specific use cases.

## 🛣️ Basic Use Cases

### 1. Single Lane Traffic Monitoring

**Scenario**: Monitor traffic on a single-lane road

**Configuration**:
- **Counting Lines**: 1 line perpendicular to traffic flow
- **Confidence**: 0.5 (default)
- **IOU Threshold**: 0.3 (default)
- **Inference FPS**: 15 (default)
- **Classes**: All enabled

**Setup**:
1. Position camera with clear view of the lane
2. Place counting line across the lane
3. Orient "IN" toward the direction you want to count as incoming

**Expected Results**:
- Accurate counts for well-separated vehicles
- Some misses during heavy occlusion
- ~95% accuracy in good conditions

---

### 2. Multi-Lane Highway Monitoring

**Scenario**: Count vehicles in each lane separately

**Configuration**:
- **Counting Lines**: 3-4 lines (one per lane)
- **Line Names**: "Lane 1", "Lane 2", "Lane 3", etc.
- **Confidence**: 0.5-0.6
- **IOU Threshold**: 0.4 (higher to prevent track swaps)
- **Inference FPS**: 10-15

**Setup**:
1. Position camera high and angled to see all lanes
2. Add one counting line per lane
3. Name lines clearly: "Lane 1 (Left)", "Lane 2 (Center)", etc.
4. Position lines at same distance from camera for consistency

**Tips**:
- Use higher IOU threshold to prevent tracks from jumping between lanes
- May need to lower confidence if vehicles are far from camera
- Consider lowering inference FPS for better performance

---

### 3. Intersection Monitoring

**Scenario**: Count vehicles entering/exiting intersection from multiple directions

**Configuration**:
- **Counting Lines**: 4+ lines (one per direction)
- **Line Names**: "North In", "North Out", "South In", "South Out"
- **Confidence**: 0.4-0.5 (lower due to complex scene)
- **IOU Threshold**: 0.3
- **Inference FPS**: 10 (complex scene)

**Setup**:
1. Position camera to see all approach/exit lanes
2. Add pairs of lines: one for entry, one for exit per direction
3. Use different colors per direction (manual code edit)
4. Enable heatmap to visualize traffic patterns

**Challenges**:
- Complex occlusions at intersections
- Need good viewing angle
- May lose tracks during stops/turns

---

### 4. Parking Lot Entrance/Exit

**Scenario**: Track vehicles entering and leaving parking facility

**Configuration**:
- **Counting Lines**: 2 lines (one for entry, one for exit)
- **Line Names**: "Entry", "Exit"
- **Confidence**: 0.5
- **IOU Threshold**: 0.3
- **Inference FPS**: 15

**Setup**:
1. Position camera to see entry and exit clearly
2. Place "Entry" line at entrance
3. Place "Exit" line at exit
4. Monitor difference: IN - OUT = vehicles currently in parking lot

**Use Case**:
- Real-time occupancy estimation
- Entry/exit trend analysis
- Peak hour identification

---

### 5. Pedestrian Crossing Monitoring

**Scenario**: Count vehicles that stop at pedestrian crossing

**Configuration**:
- **Counting Lines**: 1 line before crossing
- **Confidence**: 0.5
- **IOU Threshold**: 0.3
- **Inference FPS**: 15
- **Classes**: Disable "bicycle" if not relevant

**Setup**:
1. Place line just before crossing
2. Monitor vehicles that cross line
3. Future: Use stopped vehicle detection to identify compliance

**Future Enhancement**:
Enable "Stopped Vehicle Alerts" feature to detect vehicles that stop vs. don't stop.

---

## 🎯 Advanced Scenarios

### 6. Vehicle Type Analysis

**Scenario**: Analyze traffic composition (cars vs. trucks vs. buses)

**Configuration**:
- **Counting Lines**: 1-2 lines
- **All Classes**: Enabled
- **Confidence**: 0.5
- **View**: Monitor HUD for per-class counts

**Analysis**:
```
Total Vehicles: 120
- Cars: 95 (79%)
- Trucks: 18 (15%)
- Buses: 4 (3%)
- Motorcycles: 3 (3%)
```

**Use Cases**:
- Traffic composition studies
- Road wear estimation (trucks)
- Public transport usage (buses)

---

### 7. Traffic Heatmap Analysis

**Scenario**: Identify common vehicle paths and hotspots

**Configuration**:
- **Heatmap**: Enabled
- **Heatmap Opacity**: 0.6
- **Trail Decay**: 0.98 (slow decay)
- **Show Trails**: Enabled
- **Inference FPS**: 10-15

**Setup**:
1. Enable heatmap and trails
2. Let system run for 30+ minutes
3. Observe bright areas = high traffic
4. Observe dim areas = low traffic

**Use Cases**:
- Optimize traffic light timing
- Identify lane preference
- Detect unusual traffic patterns

---

### 8. Performance-Optimized Setup (Slow Device)

**Scenario**: Run on older laptop or low-power device

**Configuration**:
- **Inference FPS**: 5-8
- **Confidence**: 0.5
- **IOU Threshold**: 0.3
- **Heatmap**: Disabled
- **Trails**: Disabled
- **Classes**: Only enable needed classes

**Additional Optimizations**:
1. Edit `app.js` line ~1030 to lower video resolution:
```javascript
width: { ideal: 640 },   // Lower from 1280
height: { ideal: 480 }   // Lower from 720
```

2. Close other browser tabs
3. Use Chrome (best WebGL support)
4. Update graphics drivers

**Expected Performance**:
- 5-10 FPS inference
- 20-25 FPS rendering
- ~150-200ms inference time
- Still usable for counting

---

### 9. High-Accuracy Setup (Powerful Device)

**Scenario**: Maximize accuracy on desktop with good GPU

**Configuration**:
- **Inference FPS**: 25-30
- **Confidence**: 0.6
- **IOU Threshold**: 0.4
- **Video Resolution**: 1920x1080 (edit code)
- **All Features**: Enabled

**Setup**:
1. Ensure WebGL backend is active
2. Maximize video resolution
3. Increase inference FPS
4. Use higher confidence to reduce false positives

**Expected Performance**:
- 25-30 FPS inference
- 40-60ms inference time
- Very smooth tracking
- Minimal missed vehicles

---

## 🌙 Special Conditions

### 10. Night/Low Light Conditions

**Current Setup**:
- **Confidence**: 0.3-0.4 (lower threshold)
- **IOU Threshold**: 0.2 (allow more matching flexibility)
- **Inference FPS**: 10 (slower for better processing)

**Limitations**:
- COCO-SSD not trained for night conditions
- May have many missed detections
- Headlights may cause false positives

**Future Enhancement**:
Enable "Robustness Mode" feature to apply:
- CLAHE (histogram equalization)
- Brightness adjustment
- Denoising

---

### 11. Rainy/Weather Conditions

**Current Setup**:
- **Confidence**: 0.4
- **IOU Threshold**: 0.2
- **Inference FPS**: 10

**Challenges**:
- Rain on camera lens
- Reduced visibility
- Reflections

**Tips**:
- Clean camera lens frequently
- Use higher mounting position
- Consider camera housing/shelter

---

## 📊 Data Collection Patterns

### 12. Peak Hour Analysis

**Goal**: Identify traffic patterns throughout the day

**Method**:
1. Run system continuously for 24 hours
2. Take screenshots of counts every hour
3. Reset counts each hour
4. Compile into spreadsheet

**Manual Data Collection**:
```
Time    | Lane 1 IN | Lane 1 OUT | Lane 2 IN | Lane 2 OUT
--------|-----------|------------|-----------|------------
08:00   | 145       | 67         | 152       | 71
09:00   | 198       | 89         | 203       | 94
10:00   | 167       | 78         | 171       | 81
...
```

**Future Enhancement**:
Add CSV export feature for automated data logging.

---

### 13. Before/After Comparison

**Scenario**: Measure traffic change after road modification

**Method**:
1. **Before**: Run system for 1 week before changes
2. Document: Total counts, peak hours, vehicle types
3. **After**: Run system for 1 week after changes
4. Compare metrics

**Metrics to Track**:
- Total vehicle count
- Peak hour traffic
- Vehicle type distribution
- Average speed (future feature)

---

## 🔧 Configuration Recipes

### Recipe A: "Fast & Reliable"
```
Inference FPS: 15
Confidence: 0.5
IOU: 0.3
Heatmap: Disabled
Trails: Enabled
Classes: All
```
**Best for**: Standard use, balanced performance

---

### Recipe B: "High Accuracy"
```
Inference FPS: 25
Confidence: 0.6
IOU: 0.4
Heatmap: Enabled
Trails: Enabled
Classes: All
```
**Best for**: Powerful devices, detailed analysis

---

### Recipe C: "Performance Mode"
```
Inference FPS: 8
Confidence: 0.5
IOU: 0.3
Heatmap: Disabled
Trails: Disabled
Classes: Car, Truck only
```
**Best for**: Slow devices, basic counting

---

### Recipe D: "Analysis Mode"
```
Inference FPS: 15
Confidence: 0.5
IOU: 0.3
Heatmap: Enabled (0.7 opacity)
Trails: Enabled
Trail Decay: 0.98
Classes: All
```
**Best for**: Pattern visualization, research

---

## 🎓 Educational Uses

### 15. Teaching Computer Vision

**Setup**: Demonstrate concepts in real-time

**Lessons**:
1. **Object Detection**: Show bounding boxes and confidence
2. **Tracking**: Watch track IDs persist across frames
3. **IOU Matching**: Adjust IOU slider, observe track swaps
4. **Confidence Thresholds**: Adjust slider, observe precision/recall tradeoff
5. **Counting Logic**: Demonstrate line-crossing detection

**Student Activities**:
- Predict what happens when changing parameters
- Measure accuracy manually vs. system
- Identify failure cases
- Propose improvements

---

### 16. Research & Development

**Use Cases**:
- Test new tracking algorithms (replace ObjectTracker class)
- Compare model performance (swap COCO-SSD for YOLO)
- Develop preprocessing techniques
- Benchmark hardware performance

**Baseline Metrics**:
Document current performance for comparison:
- Inference time per frame
- FPS achieved
- Tracking accuracy (manual verification)
- Missed detection rate

---

## 💡 Pro Tips

### Tip 1: Calibration
Before collecting important data:
1. Run system for 5 minutes
2. Verify detections are accurate
3. Adjust confidence threshold as needed
4. Test line positioning with a few vehicles

### Tip 2: Lighting
- Position camera away from direct sunlight
- Avoid backlit scenarios
- Use consistent lighting if possible

### Tip 3: Camera Angle
- 30-45° angle works best
- Avoid extreme top-down views
- Minimize occlusions

### Tip 4: Line Placement
- Perpendicular to traffic flow = most accurate
- Not too close to edge of frame
- Ensure vehicles fully cross before leaving frame

### Tip 5: Validation
Periodically verify counts manually:
- Count 10-20 vehicles by hand
- Compare with system counts
- Adjust settings if significant discrepancy

---

## 🚫 What NOT to Do

❌ **Don't** place lines at extreme angles to traffic flow
❌ **Don't** use in direct sunlight without testing
❌ **Don't** expect 100% accuracy in heavy occlusion
❌ **Don't** use for legal/safety-critical applications (research only)
❌ **Don't** mount camera where it can move/vibrate
❌ **Don't** expect good results in night without proper lighting
❌ **Don't** try to count pedestrians (use pedestrian-specific model)

---

## 📞 Need Help?

Refer to:
- **README.md** for general documentation
- **ARCHITECTURE.md** for technical details
- **QUICKSTART.md** for setup instructions
- Browser console (F12) for error messages

---

**Happy counting! 🚗📊**

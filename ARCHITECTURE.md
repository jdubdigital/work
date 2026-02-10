# 🏗️ Technical Architecture

This document explains the technical implementation details for developers who want to understand, modify, or extend the vehicle counting system.

## 📁 Project Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # Dark theme styling
├── app.js              # Core application logic (~1000 lines)
├── README.md           # User documentation
├── QUICKSTART.md       # Quick start guide
└── ARCHITECTURE.md     # This file
```

## 🧩 Code Organization

### app.js Structure

```javascript
// Configuration
CONFIG                   // Global configuration constants

// Utility Functions
calculateIOU()          // Intersection over Union calculation
getCentroid()           // Get center point of bounding box
pointLineSide()         // Determine which side of line a point is on
distance()              // Euclidean distance between points

// Classes
Track                   // Represents a single tracked object
CountingLine            // Represents a counting line with statistics
ObjectTracker           // IOU-based multi-object tracker
HeatmapRenderer         // Heatmap visualization manager
VehicleCounterApp       // Main application class

// Entry Point
window.DOMContentLoaded // Application initialization
```

## 🔄 Application Flow

### 1. Initialization Phase

```
User opens index.html
    ↓
DOMContentLoaded event fires
    ↓
VehicleCounterApp constructor
    ↓
initialize() method
    ↓
Load TensorFlow.js + COCO-SSD model
    ↓
Set up default counting line
    ↓
Ready for camera start
```

### 2. Detection Loop

```
User clicks "Start Camera"
    ↓
Request camera access
    ↓
Start detectionLoop()
    ↓
┌─────────────────────────────────┐
│  Main Loop (requestVideoFrame)  │
│                                  │
│  1. Calculate FPS                │
│  2. Check if time for inference  │
│  3. Run inference if needed      │
│     └→ Detect vehicles           │
│     └→ Update tracker            │
│     └→ Check line crossings      │
│  4. Render visualization         │
│  5. Update HUD                   │
│  6. Schedule next frame          │
└─────────────────────────────────┘
         ↓
    Repeat
```

### 3. Inference Pipeline

```
Video Frame
    ↓
COCO-SSD Model
    ↓
Raw Predictions
    ↓
Filter by:
  - Vehicle classes
  - Confidence threshold
  - Active class toggles
    ↓
Normalized Detections
    ↓
ObjectTracker.update()
    ↓
Tracked Objects with IDs
```

### 4. Tracking Algorithm

```
New Frame Detections
    ↓
For each existing track:
    ↓
    Find best matching detection (highest IOU)
    ↓
    If match found (IOU > threshold):
        Update track position
        Reset missed frames counter
        Add to trail
    Else:
        Increment missed frames counter
    ↓
For each unmatched detection:
    Create new track
    ↓
Remove expired tracks (missed frames > threshold)
```

### 5. Line Crossing Detection

```
For each track:
    ↓
    Get centroid position
    ↓
    Calculate which side of line
    (using pointLineSide function)
    ↓
    Compare with previous frame's side
    ↓
    If side changed:
        Record crossing
        Determine direction (IN or OUT)
        Increment count
    ↓
    Store current side for next frame
```

## 🧮 Key Algorithms

### IOU (Intersection over Union)

Used for matching detections to tracks between frames.

```javascript
function calculateIOU(box1, box2) {
    // Find overlapping rectangle
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);
    
    // Calculate intersection area
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    
    // Calculate union area
    const area1 = box1.width * box1.height;
    const area2 = box2.width * box2.height;
    const union = area1 + area2 - intersection;
    
    // Return ratio
    return union > 0 ? intersection / union : 0;
}
```

**Threshold**: Default 0.3
- Higher = stricter matching (may lose tracks)
- Lower = looser matching (may swap IDs)

### Point-Line Side Detection

Determines which side of a line a point is on using cross product.

```javascript
function pointLineSide(point, lineStart, lineEnd) {
    return (lineEnd.x - lineStart.x) * (point.y - lineStart.y) - 
           (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
}
```

**Returns**:
- Positive value = one side
- Negative value = other side
- Zero = on the line

This is used to detect when a track crosses from one side to the other.

### Track Velocity Estimation

Simple delta calculation (could be improved with Kalman filter):

```javascript
update(detection) {
    const newCentroid = getCentroid(detection.bbox);
    const oldCentroid = getCentroid(this.bbox);
    
    this.velocity = {
        x: newCentroid.x - oldCentroid.x,
        y: newCentroid.y - oldCentroid.y
    };
    
    // ... rest of update logic
}
```

## 🎨 Rendering Architecture

### Canvas Layers

The application uses multiple canvas layers for efficient rendering:

```html
<video>                     <!-- Layer 0: Live video -->
<canvas id="heatmapCanvas"> <!-- Layer 1: Heatmap (optional) -->
<canvas id="outputCanvas">  <!-- Layer 2: Bounding boxes + lines -->
```

**Advantages**:
- Separate concerns
- Can toggle heatmap without redrawing everything
- Better performance

### Rendering Order

```
1. Clear output canvas
2. Render heatmap (if enabled):
   - Apply decay effect
   - Add new track points
3. Render trails (if enabled)
4. Render bounding boxes + labels
5. Render counting lines
6. Render line endpoints (draggable)
```

### Frame Timing

Uses `requestVideoFrameCallback` when available (Chrome 83+):
- Syncs rendering with video frames
- More efficient than `requestAnimationFrame`
- Reduces dropped frames

Fallback to `requestAnimationFrame` for other browsers.

## 🎯 Performance Optimizations

### 1. Backend Selection

```javascript
await tf.setBackend('webgl');
await tf.ready();
```

**WebGL** provides GPU acceleration for:
- Model inference
- Tensor operations
- Image preprocessing

### 2. Inference Throttling

```javascript
const inferenceInterval = 1000 / this.targetInferenceFps;

if (timeSinceLastInference >= inferenceInterval) {
    await this.runInference();
    this.lastInferenceTime = now;
}
```

Separates rendering FPS from inference FPS:
- Rendering: 30-60 FPS (smooth video)
- Inference: 5-15 FPS (configurable)

### 3. Efficient Detection Filtering

```javascript
this.detections = predictions
    .filter(pred => 
        CONFIG.VEHICLE_CLASSES.includes(pred.class) &&
        this.activeClasses.has(pred.class) &&
        pred.score >= this.confidenceThreshold
    )
```

Filters early to reduce tracking overhead.

### 4. Track Expiration

```javascript
isExpired() {
    return this.missedFrames > CONFIG.MAX_MISSED_FRAMES;
}

this.tracks = this.tracks.filter(track => !track.isExpired());
```

Removes stale tracks to prevent memory bloat.

## 🔌 Extension Points

### Adding Custom Models

To use a different model (e.g., YOLOv8 with ONNX):

1. Replace model loading in `initialize()`:
```javascript
// Replace COCO-SSD loading
this.model = await ort.InferenceSession.create('model.onnx');
```

2. Update inference in `runInference()`:
```javascript
// Preprocess frame
const inputTensor = await preprocessFrame(this.video);

// Run inference
const results = await this.model.run({ input: inputTensor });

// Postprocess results
this.detections = postprocessResults(results);
```

3. Update preprocessing/postprocessing as needed for your model

### Implementing Speed Estimation

Hook location: `app.js` line ~500 (Speed estimation checkbox)

```javascript
// 1. Add calibration mode
this.calibrationMode = false;
this.calibrationDistance = 0; // meters
this.calibrationPoints = [];

// 2. Track crossing times
checkLineCrossings() {
    // ... existing code ...
    if (crossing && this.speedEstimationEnabled) {
        const time = Date.now();
        track.crossingTimes.push({ lineId: line.id, time });
        
        // Calculate speed if crossed 2 lines
        if (track.crossingTimes.length >= 2) {
            const speed = this.calculateSpeed(track);
            track.estimatedSpeed = speed;
        }
    }
}

// 3. Calculate speed
calculateSpeed(track) {
    const t1 = track.crossingTimes[0].time;
    const t2 = track.crossingTimes[1].time;
    const timeSeconds = (t2 - t1) / 1000;
    const speedMPS = this.calibrationDistance / timeSeconds;
    return speedMPS * 3.6; // Convert to km/h
}
```

### Implementing Congestion Detection

Hook location: `app.js` line ~501 (Congestion detection checkbox)

```javascript
// 1. Define ROI polygon
this.roiPolygon = [
    { x: 0.2, y: 0.2 },
    { x: 0.8, y: 0.2 },
    { x: 0.8, y: 0.8 },
    { x: 0.2, y: 0.8 }
];

// 2. Check if point inside polygon
isInsideROI(point) {
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = this.roiPolygon.length - 1; i < this.roiPolygon.length; j = i++) {
        const xi = this.roiPolygon[i].x, yi = this.roiPolygon[i].y;
        const xj = this.roiPolygon[j].x, yj = this.roiPolygon[j].y;
        
        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// 3. Calculate congestion
calculateCongestion() {
    const vehiclesInROI = this.tracker.getTracks().filter(track => 
        this.isInsideROI(track.getCentroid())
    ).length;
    
    const roiArea = this.calculateROIArea();
    const density = vehiclesInROI / roiArea;
    
    return { count: vehiclesInROI, density };
}
```

### Implementing Better Tracking (DeepSORT)

Replace `ObjectTracker` class with appearance-based tracker:

```javascript
class DeepSORTTracker {
    constructor() {
        this.tracks = [];
        this.featureExtractor = await loadReIDModel();
    }
    
    async update(detections, videoFrame) {
        // 1. Extract appearance features
        const features = await this.extractFeatures(detections, videoFrame);
        
        // 2. Predict track positions (Kalman filter)
        this.tracks.forEach(track => track.predict());
        
        // 3. Matching cascade (prioritize recent tracks)
        const matches = this.matchingCascade(detections, features);
        
        // 4. IOU matching for unmatched tracks
        const iouMatches = this.iouMatching(unmatchedDetections, unmatchedTracks);
        
        // 5. Update tracks and create new ones
        // ...
    }
    
    async extractFeatures(detections, videoFrame) {
        // Use small CNN for appearance features
        // e.g., MobileNet or custom ReID network
    }
}
```

## 🐛 Debugging Tips

### Enable Verbose Logging

Add to `CONFIG`:
```javascript
DEBUG: true,
LOG_TRACKS: true,
LOG_CROSSINGS: true
```

### Visualize Track IDs

In `drawBoundingBox()`:
```javascript
// Draw larger track ID
this.ctx.font = 'bold 24px Arial';
this.ctx.fillText(`#${id}`, bbox.x, bbox.y + bbox.height + 20);
```

### Monitor Performance

```javascript
// Add to detectionLoop()
console.log({
    fps: this.fps,
    inference: this.inferenceTime,
    tracks: this.tracker.getTracks().length,
    detections: this.detections.length
});
```

### Test Without Camera

Use video file instead of webcam:
```javascript
const video = document.getElementById('webcam');
video.src = 'test-video.mp4';
video.play();
```

## 📊 Performance Profiling

### Chrome DevTools

1. Open DevTools (F12)
2. Performance tab
3. Start recording
4. Run application for 10-20 seconds
5. Stop recording
6. Analyze:
   - Identify bottlenecks
   - Check frame timing
   - Monitor memory usage

### TensorFlow.js Profiling

```javascript
// Add to runInference()
const profileInfo = await tf.profile(async () => {
    const predictions = await this.model.detect(this.video);
    return predictions;
});

console.log('Memory:', profileInfo.kernelMs);
console.log('Kernels:', profileInfo.kernels);
```

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] Camera selection and permissions
- [ ] Start/stop camera
- [ ] Pause/resume inference
- [ ] Adjust confidence threshold
- [ ] Adjust IOU threshold
- [ ] Toggle vehicle classes
- [ ] Add/remove counting lines
- [ ] Drag line endpoints
- [ ] Reset counts
- [ ] Enable/disable heatmap
- [ ] Adjust heatmap settings
- [ ] Performance under load (multiple vehicles)

### Automated Testing (Future)

Consider adding:
- Unit tests for utility functions (IOU, pointLineSide)
- Integration tests for tracker
- Visual regression tests for rendering
- Performance benchmarks

## 📚 Further Reading

### Object Detection
- [COCO Dataset](https://cocodataset.org/)
- [TensorFlow.js Object Detection](https://www.tensorflow.org/js/models)

### Object Tracking
- [Simple Online and Realtime Tracking (SORT)](https://arxiv.org/abs/1602.00763)
- [Deep SORT](https://arxiv.org/abs/1703.07402)
- [IOU Tracker](https://arxiv.org/abs/1611.07715)

### Computer Vision
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
- [WebGL Fundamentals](https://webglfundamentals.org/)

### Browser APIs
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [requestVideoFrameCallback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback)

---

**Questions or need help extending the system?** Check the main README or open an issue!

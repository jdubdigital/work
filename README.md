# 🚗 Browser Vehicle Counter

A real-time, privacy-first vehicle detection and counting system that runs entirely in your browser using machine learning. No backend, no cloud services, no data collection.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.11.0-orange.svg)
![Status](https://img.shields.io/badge/status-production-green.svg)

## 🎯 Features

### Core Capabilities
- **Real-time Vehicle Detection**: Detects cars, trucks, buses, motorcycles, and bicycles using COCO-SSD (TensorFlow.js)
- **Object Tracking**: IOU-based tracker with velocity estimation and trail visualization
- **Directional Counting**: Count vehicles crossing user-defined lines (IN vs OUT)
- **Multiple Lanes**: Support for multiple named counting lines with independent statistics
- **Speed Estimation**: Approximate vehicle speed based on calibrated distance between lines
- **Heatmap Visualization**: Visual trails showing vehicle paths with adjustable decay

### Advanced Features
- **No Double Counting**: Track-based counting prevents vehicles from being counted multiple times
- **Class Filtering**: Toggle individual vehicle classes on/off
- **Adjustable Thresholds**: Real-time confidence and IOU threshold adjustment
- **Performance Optimizations**: WebGL backend, frame resizing, throttled inference
- **Interactive Line Editor**: Drag line endpoints to reposition counting zones
- **Comprehensive Statistics**: Per-class, per-lane, and total counts with live HUD

### UI/UX
- **Dark Mode Interface**: Clean, modern design optimized for laptop screens
- **Camera Selection**: Support for multiple camera devices
- **Pause/Resume**: Control inference without stopping the video feed
- **Reset Capabilities**: Clear counts or heatmap independently
- **Real-time Metrics**: FPS, inference time, and tracked object count

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Edge, or Brave recommended)
- Webcam or connected camera device
- Basic understanding of web development (optional)

### Installation & Running

#### Option 1: Direct File Opening (Simplest)
1. Download or clone this repository:
   ```bash
   git clone <repository-url>
   cd browser-vehicle-counter
   ```

2. Open `index.html` directly in your browser:
   - **Windows**: Right-click `index.html` → Open with → Google Chrome
   - **Mac**: Right-click `index.html` → Open With → Google Chrome
   - **Linux**: `google-chrome index.html` or `chromium index.html`

> ⚠️ **Note**: Some browsers may block camera access when opening files directly due to security policies. If you encounter issues, use Option 2.

#### Option 2: Local Web Server (Recommended)

Using Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Using Node.js:
```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run server
http-server -p 8000
```

Using PHP:
```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

#### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### First Use

1. **Grant Camera Permissions**: When prompted, allow camera access
2. **Select Camera**: Choose your camera from the dropdown
3. **Click "Start Camera"**: The model will load (takes 2-5 seconds)
4. **Wait for Detection**: Green bounding boxes will appear around detected vehicles
5. **Adjust Lines**: Enable "Edit Mode" to drag counting line endpoints
6. **Monitor Counts**: Watch the statistics panel update as vehicles cross lines

## 📋 User Guide

### Setting Up Counting Lines

1. **Default Lines**: Two lines are created by default ("Lane 1" and "Lane 2")
2. **Adding Lines**: Click "+ Add Line" to create additional counting zones
3. **Editing Lines**: 
   - Enable "Edit Mode" checkbox
   - Click and drag the circular endpoints to reposition
   - The line shows "IN" (green) and "OUT" (red) directions
4. **Naming Lines**: Click the line name in the controls panel to rename
5. **Visibility**: Toggle line visibility using the checkbox per line
6. **Removing Lines**: Click the "✕" button next to a line to remove it

### Detection Settings

- **Confidence Threshold** (0.0 - 1.0): Lower values detect more objects but may include false positives. Default: 0.50
- **IOU Threshold** (0.0 - 1.0): Controls how detection boxes are matched to tracks. Lower values allow more overlap. Default: 0.30
- **Class Toggles**: Disable specific vehicle types to focus on particular classes

### Speed Estimation Setup

1. Enable "Enable Speed Estimation" checkbox
2. Measure the real-world distance between two counting lines (in meters)
3. Enter this distance in the calibration field
4. Click "Apply Calibration"
5. As vehicles cross both lines, average speeds per class will be calculated
6. View results in the "Average Speed" section

**Example**: If your lines are 5 meters apart in the real world, enter "5" as the calibration distance.

### Performance Tuning

If the app is running slowly:

1. **Lower Confidence Threshold**: Set to 0.6-0.7 to reduce detections
2. **Disable Classes**: Turn off bicycle/motorcycle if not needed
3. **Reduce Heatmap Decay**: Set to 0.95 for faster fade
4. **Close Other Applications**: Free up system resources
5. **Use Wired Camera**: Reduce USB/wireless latency

### Visualization Options

- **Show Heatmap/Trails**: Toggle vehicle path visualization
- **Trail Opacity** (0.0 - 1.0): Control brightness of trails
- **Trail Decay** (0.90 - 1.0): How quickly trails fade (higher = slower fade)

## 🧠 Technical Architecture

### Model Choice: COCO-SSD

**Selected Model**: COCO-SSD with MobileNet v2 Lite backbone

**Why COCO-SSD?**
- ✅ **Fast**: 30-50ms inference on typical laptops
- ✅ **Browser-Optimized**: Native TensorFlow.js support
- ✅ **Good Accuracy**: 80+ object classes including all vehicle types
- ✅ **Low Memory**: ~5MB model size
- ✅ **Easy Integration**: One-line model loading

**Tradeoffs vs. YOLO**:

| Feature | COCO-SSD (Current) | YOLOv5/v8 ONNX |
|---------|-------------------|----------------|
| Speed | ⚡ Very Fast (30-50ms) | 🐢 Slower (100-200ms) |
| Accuracy | ✓ Good (mAP ~25) | ✓✓ Excellent (mAP ~45) |
| Model Size | 📦 Small (~5MB) | 📦 Larger (20-50MB) |
| Setup | 🎯 Trivial | 🔧 Complex (conversion) |
| Best For | Real-time, constrained hardware | Accuracy-critical, powerful hardware |

**Alternative Models** (for future implementation):
- **YOLOv5-nano**: Convert to TensorFlow.js or ONNX Runtime Web for better accuracy
- **EfficientDet-lite**: Good balance of speed and accuracy
- **Custom TFLite Model**: Fine-tuned on traffic datasets

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                   VehicleCounterApp                     │
│                   (Main Controller)                     │
└────────────┬────────────────────────────────────────────┘
             │
     ┌───────┴───────┬──────────┬──────────┬──────────┐
     │               │          │          │          │
┌────▼─────┐  ┌─────▼────┐ ┌──▼──────┐ ┌─▼────────┐ ┌▼───────────┐
│Detection │  │ Tracker  │ │Counting │ │ Heatmap  │ │   Speed    │
│  Engine  │  │          │ │  Line   │ │ Renderer │ │ Estimator  │
└──────────┘  └──────────┘ └─────────┘ └──────────┘ └────────────┘
```

#### DetectionEngine
- Loads and manages COCO-SSD model
- Handles TensorFlow.js backend selection (WebGL/WebGPU)
- Runs inference on video frames
- Filters detections by class and confidence

#### Tracker
- Implements IOU-based multi-object tracking
- Creates and manages `Track` objects with unique IDs
- Estimates velocity from frame-to-frame movement
- Expires tracks that haven't been seen for N frames
- Prevents track ID reuse (monotonically increasing IDs)

#### CountingLine
- Defines virtual counting zones
- Uses line-side mathematics for crossing detection
- Prevents double counting via track state management
- Maintains separate counts per direction and class
- Supports visual rendering with IN/OUT indicators

#### HeatmapRenderer
- Renders vehicle trails on separate canvas layer
- Implements exponential decay for fading effect
- Color-codes trails by vehicle class
- Configurable opacity and decay rate

#### SpeedEstimator
- Records timestamps when tracks cross lines
- Calculates speed from time difference and calibrated distance
- Maintains rolling average per vehicle class
- Requires at least 2 lines for meaningful results

### Detection & Tracking Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Capture  │────▶│  Detect  │────▶│  Track   │────▶│  Count   │
│  Frame   │     │ Vehicles │     │  Objects │     │ Crossings│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                                    │              │
     │                                    ▼              ▼
     │                            ┌──────────┐    ┌──────────┐
     │                            │ Heatmap  │    │  Speed   │
     └───────────────────────────▶│  Render  │    │ Estimate │
                                  └──────────┘    └──────────┘
```

1. **Frame Capture**: Extract frame from `<video>` element
2. **Detection**: Run COCO-SSD inference (throttled to 10 FPS)
3. **Tracking**: Match detections to existing tracks via IOU
4. **Counting**: Check each track against all counting lines
5. **Rendering**: Draw bounding boxes, labels, lines, and heatmap

### Line Crossing Algorithm

The crossing detection uses **side-of-line mathematics**:

```javascript
// Point P is on the "positive" side if:
side = (x2 - x1) * (Py - y1) - (y2 - y1) * (Px - x1)

// side > 0: Point is on "IN" side
// side < 0: Point is on "OUT" side
// side = 0: Point is exactly on the line
```

**Crossing Detection**:
1. Track the side of the line for each object's centroid
2. When `previousSide ≠ currentSide` (and both non-zero), a crossing occurred
3. Direction determined by sign change: `positive → negative = OUT`, `negative → positive = IN`
4. Mark as "counted" to prevent repeat counting until side changes again

### Performance Optimizations

1. **Frame Resizing**: Video scaled to 640x480 for inference (configurable)
2. **Inference Throttling**: Detection runs at 10 FPS, rendering at 60 FPS
3. **WebGL Backend**: GPU acceleration via TensorFlow.js WebGL
4. **Canvas Layering**: Separate canvases for video, heatmap, and overlays
5. **requestAnimationFrame**: Smooth rendering loop
6. **Track Expiry**: Remove old tracks to prevent memory leaks
7. **Trail Length Limiting**: Keep only last 30 points per track

## 🛠️ Troubleshooting & Performance

### Common Issues

#### Camera Not Working
- **Permission Denied**: 
  - Check browser camera permissions (🔒 icon in address bar)
  - Try a different browser (Chrome recommended)
  - Ensure no other app is using the camera
  
- **No Camera Listed**:
  - Verify camera is connected and recognized by OS
  - Try unplugging and reconnecting USB camera
  - Reload the page to re-enumerate devices

#### Slow Performance / Low FPS
- **Symptoms**: FPS < 15, laggy detection, delayed UI
- **Solutions**:
  1. Close other tabs and applications
  2. Increase confidence threshold to 0.6-0.7
  3. Disable unused vehicle classes
  4. Reduce heatmap opacity/increase decay
  5. Use Chrome (best TensorFlow.js performance)
  6. Check if WebGL is enabled (see next section)

#### Model Loading Fails
- **Error**: "Failed to load detection model"
- **Causes**: 
  - No internet connection (model downloads from CDN)
  - Firewall blocking jsdelivr.net
  - Browser compatibility issues
- **Solutions**:
  - Check internet connection
  - Try a different browser
  - Clear browser cache and reload

#### Detection Not Working
- **No bounding boxes appear**:
  - Wait 5-10 seconds after starting camera
  - Ensure good lighting conditions
  - Check that vehicle classes are enabled
  - Lower confidence threshold to 0.3-0.4
  - Point camera at vehicles (not empty road)

#### Counting Inaccurate
- **Vehicles counted multiple times**:
  - Increase IOU threshold to 0.4-0.5
  - Ensure lines are perpendicular to traffic flow
  - Check that vehicles fully cross the line
  
- **Vehicles not counted**:
  - Lower confidence threshold
  - Reposition lines to avoid occlusions
  - Ensure sufficient contrast/lighting

### Enabling WebGL/WebGPU Backend

TensorFlow.js automatically selects the best backend. To verify:

1. Open browser console (F12 → Console tab)
2. Look for: `"TensorFlow.js backend: webgl"` (good) or `"cpu"` (slow)

**Force WebGL** (if CPU is selected):
```javascript
// In browser console:
await tf.setBackend('webgl');
await tf.ready();
console.log(tf.getBackend()); // Should print "webgl"
```

**Enable WebGPU** (experimental, Chrome 113+):
1. Navigate to `chrome://flags`
2. Search "WebGPU"
3. Enable "Unsafe WebGPU"
4. Restart browser
5. Modify `app.js` line ~150:
   ```javascript
   await tf.setBackend('webgpu'); // Instead of 'webgl'
   ```

### Reducing Resolution and Inference FPS

Edit `app.js` constants (lines 13-23):

```javascript
const CONFIG = {
    // Reduce resolution for faster inference
    TARGET_WIDTH: 320,  // Default: 640
    TARGET_HEIGHT: 240, // Default: 480
    
    // Slow down inference rate
    INFERENCE_INTERVAL: 200, // Default: 100 (ms = 5 FPS)
};
```

**Impact**:
- Lower resolution: 2-3x faster inference, reduced accuracy
- Higher interval: Lower CPU usage, choppier tracking

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Excellent | Best performance, recommended |
| Edge 90+ | ✅ Excellent | Chromium-based, same as Chrome |
| Brave 1.30+ | ✅ Excellent | Chromium-based |
| Firefox 88+ | ⚠️ Good | Slower WebGL, disable shields |
| Safari 14+ | ⚠️ Limited | Poor TensorFlow.js performance |
| Mobile browsers | ❌ Not optimized | High battery drain, small screen |

## 🔒 Privacy & Limitations

### Privacy Guarantees

✅ **What We DO**:
- Process video frames locally in your browser
- Store temporary data in browser memory (RAM) only
- Use your GPU for acceleration (if available)

❌ **What We DON'T**:
- Upload video or images to any server
- Store any data to disk (no cookies, no localStorage)
- Send data to third parties
- Collect analytics or telemetry

**100% Local Processing**: All computation happens on your device. When you close the tab, all data is immediately deleted.

### Limitations

#### Accuracy Limitations
- **Crowded Scenes**: Objects may merge or split incorrectly
- **Occlusions**: Vehicles hidden behind others may not be detected
- **Small Objects**: Distant vehicles may be missed
- **Poor Lighting**: Night scenes or shadows reduce accuracy
- **Fast Motion**: Very fast vehicles may blur and be missed
- **Unusual Angles**: Top-down or extreme side angles not trained

#### Performance Limitations
- **Hardware Dependent**: Requires decent CPU/GPU (2017+ laptop recommended)
- **Browser Overhead**: Slower than native desktop apps
- **Model Size**: COCO-SSD optimized for speed, not accuracy
- **Tracking Simplicity**: IOU tracker can lose objects in complex scenarios

#### Functional Limitations
- **No Recording**: Cannot save video or export data (by design for privacy)
- **No Cloud Features**: Cannot compare with other cameras or aggregate data
- **Single Camera**: One camera feed at a time
- **No Historical Data**: Counts reset when page is closed

### When NOT to Use This

❌ **Official Traffic Studies**: Use certified traffic counting equipment
❌ **Legal/Insurance**: Not admissible as evidence
❌ **Critical Infrastructure**: Needs redundancy and validation
❌ **24/7 Operation**: Not designed for long-running deployment
❌ **High-Accuracy Needs**: Consider custom-trained models

✅ **Good Use Cases**:
- Personal traffic monitoring
- Parking lot analysis
- Educational demonstrations
- Proof-of-concept projects
- Privacy-sensitive environments
- Quick temporary counts

## 🗺️ Roadmap & Future Features

### Implemented Features ✅
- [x] Real-time detection with COCO-SSD
- [x] IOU-based object tracking
- [x] Directional counting with multiple lines
- [x] Lane-based counting with named lines
- [x] Heatmap/trail visualization
- [x] Speed estimation with calibration
- [x] Class filtering and threshold controls
- [x] Interactive line editor
- [x] Dark mode UI

### Planned Features 🚧

#### 1. Congestion Metrics (Medium Priority)
**Goal**: Measure traffic density and congestion level

**Implementation Plan**:
- Allow user to draw Region of Interest (ROI) polygon
- Count vehicles inside ROI per frame
- Calculate density: `vehicles / area`
- Track density over time (rolling average)
- Display congestion level: Low / Moderate / High / Severe
- Color-code ROI by congestion level

**Code Hooks**:
- Create `ROIManager` class in `app.js`
- Add polygon drawing to canvas interaction handlers
- Integrate with tracker in `startDetectionLoop()`

**Estimated Effort**: 4-6 hours

#### 2. Stopped Vehicle Alerts (High Priority)
**Goal**: Detect vehicles that stop moving (breakdowns, accidents)

**Implementation Plan**:
- Track velocity magnitude per track: `speed = sqrt(vx² + vy²)`
- If `speed < threshold` for `N consecutive frames`, mark as stopped
- Display non-intrusive notification (toast, not alert)
- Highlight stopped vehicle with orange/red bounding box
- Log stopped events with timestamp and location

**Code Hooks**:
- Add `stoppedFrameCount` to `Track` class
- Check in `Tracker.update()` method
- Create `AlertManager` class for notifications
- Add UI toast component in `index.html`

**Estimated Effort**: 3-4 hours

#### 3. Robustness Mode (Low Priority)
**Goal**: Improve detection in adverse conditions

**Implementation Plan**:
- **Night Mode**: Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
- **Rain/Noise Mode**: Gaussian blur pre-processing, increase inference interval
- Add toggle switches in UI: "Night Mode", "Weather Mode"
- Pre-process video frames before inference

**Code Hooks**:
- Add preprocessing step in `DetectionEngine.detect()`
- Use canvas to apply filters before model inference
- Add UI controls in "Detection" section

**Estimated Effort**: 6-8 hours (requires OpenCV.js or custom kernels)

#### 4. Better Tracking Algorithms (High Priority)
**Goal**: Replace IOU tracker with more robust method

**Options**:
- **DeepSORT**: Use appearance features + Kalman filter
- **ByteTrack**: Better handling of low-confidence detections
- **Centroid + Kalman**: Predict positions, handle occlusions

**Implementation Plan**:
- Create abstract `TrackerInterface` class
- Implement `IOUTracker` (current), `DeepSORTTracker`, `KalmanTracker`
- Add UI dropdown to select tracker algorithm
- Compare performance metrics

**Code Hooks**:
- Refactor `Tracker` class to interface
- Add `TrackerFactory` pattern
- UI control in "Detection" section

**Estimated Effort**: 12-20 hours (complex, may need external libraries)

#### 5. YOLOv5/v8 Model Support (Medium Priority)
**Goal**: Improve detection accuracy

**Implementation Plan**:
- Convert YOLOv5-nano to ONNX format
- Load in browser via ONNX Runtime Web
- Add model selector in UI: "COCO-SSD (Fast)" vs "YOLO (Accurate)"
- Handle different output formats (YOLO returns different bbox structure)

**Code Hooks**:
- Create `YOLODetector` class extending `DetectionEngine`
- Add model loader in `initialize()` method
- Parse YOLO output format (NMS required)

**Estimated Effort**: 8-12 hours (model conversion + integration)

#### 6. Export & Reporting (Low Priority)
**Goal**: Save counts and statistics

**Implementation Plan**:
- Add "Export Data" button
- Generate JSON/CSV with counts, timestamps, classes
- Allow downloading report as file (no server upload)
- Optional: Screenshot of current view

**Code Hooks**:
- Create `ExportManager` class
- Serialize counts from `countingLines` array
- Use `Blob` and `URL.createObjectURL()` for download

**Estimated Effort**: 2-3 hours

#### 7. Multi-Camera Support (Low Priority)
**Goal**: Monitor multiple camera feeds simultaneously

**Implementation Plan**:
- Grid layout with 2-4 camera views
- Independent detection/tracking per camera
- Aggregate counts across all cameras
- Performance considerations (may need to reduce inference rate)

**Code Hooks**:
- Create `CameraInstance` class wrapping `VehicleCounterApp`
- Manage multiple instances in grid layout
- Shared statistics aggregation

**Estimated Effort**: 10-15 hours (complex UI and state management)

### Contributing

This roadmap provides a clear path for extending the application. Each feature includes:
- Clear implementation plan
- Code integration points
- Estimated effort

Contributors can pick features and implement them modularly without breaking existing functionality.

## 📚 Technical Reference

### Key Algorithms

#### IOU (Intersection over Union)
```javascript
IOU = Area(BoxA ∩ BoxB) / Area(BoxA ∪ BoxB)

// Used for:
// - Matching detections to tracks
// - Non-maximum suppression (NMS)
```

#### Track Velocity Estimation
```javascript
velocity_x = (centroid_x[t] - centroid_x[t-1]) / Δframes
velocity_y = (centroid_y[t] - centroid_y[t-1]) / Δframes

speed = sqrt(velocity_x² + velocity_y²)
```

#### Speed Calculation
```javascript
speed = distance / time
// distance: calibrated real-world distance (meters)
// time: timestamp difference between line crossings (seconds)
// speed: m/s (convert to km/h by multiplying by 3.6)
```

### Configuration Constants

Edit `app.js` to customize:

```javascript
const CONFIG = {
    // Detection
    DEFAULT_CONFIDENCE: 0.5,    // Initial confidence threshold
    DEFAULT_IOU_THRESHOLD: 0.3, // Initial IOU threshold
    VEHICLE_CLASSES: ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
    
    // Tracking
    MAX_TRACK_AGE: 30,          // Max frames without detection before deletion
    MIN_HIT_STREAK: 3,          // Min consecutive detections to be "active"
    
    // Performance
    TARGET_WIDTH: 640,          // Inference resolution width
    TARGET_HEIGHT: 480,         // Inference resolution height
    INFERENCE_INTERVAL: 100,    // ms between inferences (10 FPS)
    
    // Visualization
    TRAIL_LENGTH: 30,           // Max trail points per track
    HEATMAP_DECAY: 0.98,        // Trail fade rate (higher = slower fade)
};
```

### File Structure

```
browser-vehicle-counter/
├── index.html          # Main HTML structure
├── styles.css          # Dark mode styling
├── app.js              # Core application logic
└── README.md           # This file

Dependencies (loaded via CDN):
├── TensorFlow.js 4.11.0
└── COCO-SSD 2.2.3
```

### Browser Console Debugging

Open console (F12) to see:
- Model loading status
- Backend selection (webgl/cpu)
- Detection count per frame
- Errors and warnings

**Useful Commands**:
```javascript
// Check TensorFlow.js backend
console.log(tf.getBackend());

// Get memory info
console.log(tf.memory());

// Check active tracks
console.log(app.tracker.getActiveTracks());

// Get line counts
console.log(app.countingLines.map(l => ({
    name: l.name, 
    in: l.counts.total.in, 
    out: l.counts.total.out
})));
```

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- **TensorFlow.js Team**: For browser-based ML framework
- **COCO Dataset**: Training data for object detection
- **MobileNet**: Efficient CNN architecture for mobile/browser

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check troubleshooting section above
- Review browser console for errors

---

**Built with ❤️ for privacy-conscious traffic monitoring**

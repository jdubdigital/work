/* ========================================
   Browser Vehicle Counter - Main Application
   Author: AI Computer Vision Engineer
   Description: Real-time vehicle detection, tracking, and counting in the browser
   ======================================== */

// ========================================
// Constants and Configuration
// ========================================

const CONFIG = {
    // Detection
    DEFAULT_CONFIDENCE: 0.5,
    DEFAULT_IOU_THRESHOLD: 0.3,
    VEHICLE_CLASSES: ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
    
    // Tracking
    MAX_TRACK_AGE: 30, // frames
    MIN_HIT_STREAK: 3,
    IOU_THRESHOLD: 0.3,
    
    // Performance
    TARGET_WIDTH: 640,
    TARGET_HEIGHT: 480,
    INFERENCE_INTERVAL: 100, // ms (10 FPS for inference)
    
    // Visualization
    BBOX_COLORS: {
        car: '#00ff88',
        truck: '#ff6b6b',
        bus: '#4ecdc4',
        motorcycle: '#ffe66d',
        bicycle: '#a8dadc'
    },
    LINE_COLORS: ['#00d9ff', '#ff3366', '#00ff88', '#ffaa00'],
    
    // Heatmap
    HEATMAP_DECAY: 0.98,
    TRAIL_LENGTH: 30
};

// ========================================
// Utility Functions
// ========================================

/**
 * Calculate Intersection over Union (IOU) between two bounding boxes
 */
function calculateIOU(box1, box2) {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);
    
    const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const box1Area = box1.width * box1.height;
    const box2Area = box2.width * box2.height;
    const unionArea = box1Area + box2Area - intersectionArea;
    
    return unionArea > 0 ? intersectionArea / unionArea : 0;
}

/**
 * Get centroid of a bounding box
 */
function getCentroid(bbox) {
    return {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2
    };
}

/**
 * Calculate which side of a line a point is on
 * Returns positive if point is on one side, negative on the other, 0 if on the line
 */
function getLineSide(lineStart, lineEnd, point) {
    return (lineEnd.x - lineStart.x) * (point.y - lineStart.y) - 
           (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
}

/**
 * Calculate Euclidean distance between two points
 */
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// ========================================
// Detection Engine
// ========================================

class DetectionEngine {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        this.confidenceThreshold = CONFIG.DEFAULT_CONFIDENCE;
    }
    
    async initialize() {
        try {
            console.log('Loading COCO-SSD model...');
            
            // Try to use WebGL backend for better performance
            await tf.setBackend('webgl');
            await tf.ready();
            console.log('TensorFlow.js backend:', tf.getBackend());
            
            // Load COCO-SSD model
            this.model = await cocoSsd.load({
                base: 'lite_mobilenet_v2' // Faster model for real-time performance
            });
            
            this.isLoaded = true;
            console.log('COCO-SSD model loaded successfully');
            
            return true;
        } catch (error) {
            console.error('Error loading detection model:', error);
            throw error;
        }
    }
    
    async detect(videoElement) {
        if (!this.isLoaded || !this.model) {
            throw new Error('Model not loaded');
        }
        
        const startTime = performance.now();
        
        // Run detection
        const predictions = await this.model.detect(videoElement);
        
        const inferenceTime = performance.now() - startTime;
        
        // Filter for vehicle classes only
        const vehicleDetections = predictions
            .filter(pred => CONFIG.VEHICLE_CLASSES.includes(pred.class))
            .filter(pred => pred.score >= this.confidenceThreshold)
            .map(pred => ({
                class: pred.class,
                confidence: pred.score,
                bbox: {
                    x: pred.bbox[0],
                    y: pred.bbox[1],
                    width: pred.bbox[2],
                    height: pred.bbox[3]
                }
            }));
        
        return {
            detections: vehicleDetections,
            inferenceTime: Math.round(inferenceTime)
        };
    }
    
    setConfidenceThreshold(threshold) {
        this.confidenceThreshold = threshold;
    }
}

// ========================================
// Track Object
// ========================================

class Track {
    static nextId = 1;
    
    constructor(detection, frameNumber) {
        this.id = Track.nextId++;
        this.class = detection.class;
        this.bbox = detection.bbox;
        this.confidence = detection.confidence;
        this.age = 0;
        this.hitStreak = 1;
        this.timeSinceUpdate = 0;
        this.lastSeen = frameNumber;
        this.firstSeen = frameNumber;
        
        // For tracking
        this.centroid = getCentroid(detection.bbox);
        this.trail = [{ ...this.centroid, frame: frameNumber }];
        this.velocity = { x: 0, y: 0 };
        
        // For counting
        this.lineCrossings = {}; // lineId -> { side: number, counted: boolean, timestamp: number }
    }
    
    update(detection, frameNumber) {
        this.bbox = detection.bbox;
        this.confidence = detection.confidence;
        this.class = detection.class;
        this.age++;
        this.hitStreak++;
        this.timeSinceUpdate = 0;
        this.lastSeen = frameNumber;
        
        // Update centroid and velocity
        const newCentroid = getCentroid(detection.bbox);
        const deltaFrames = Math.max(1, frameNumber - this.trail[this.trail.length - 1].frame);
        this.velocity = {
            x: (newCentroid.x - this.centroid.x) / deltaFrames,
            y: (newCentroid.y - this.centroid.y) / deltaFrames
        };
        this.centroid = newCentroid;
        
        // Update trail
        this.trail.push({ ...this.centroid, frame: frameNumber });
        if (this.trail.length > CONFIG.TRAIL_LENGTH) {
            this.trail.shift();
        }
    }
    
    markMissed() {
        this.timeSinceUpdate++;
        this.hitStreak = 0;
    }
    
    isActive() {
        return this.timeSinceUpdate < CONFIG.MAX_TRACK_AGE && 
               this.hitStreak >= CONFIG.MIN_HIT_STREAK;
    }
    
    shouldDelete() {
        return this.timeSinceUpdate >= CONFIG.MAX_TRACK_AGE;
    }
}

// ========================================
// Object Tracker
// ========================================

class Tracker {
    constructor() {
        this.tracks = [];
        this.frameNumber = 0;
        this.iouThreshold = CONFIG.IOU_THRESHOLD;
    }
    
    update(detections) {
        this.frameNumber++;
        
        // Hungarian algorithm approximation using greedy matching
        const matched = new Set();
        const matchedTracks = new Set();
        
        // Match detections to existing tracks
        for (const track of this.tracks) {
            let bestMatch = null;
            let bestIOU = this.iouThreshold;
            let bestDetectionIdx = -1;
            
            detections.forEach((detection, idx) => {
                if (matched.has(idx) || detection.class !== track.class) return;
                
                const iou = calculateIOU(track.bbox, detection.bbox);
                if (iou > bestIOU) {
                    bestIOU = iou;
                    bestMatch = detection;
                    bestDetectionIdx = idx;
                }
            });
            
            if (bestMatch) {
                track.update(bestMatch, this.frameNumber);
                matched.add(bestDetectionIdx);
                matchedTracks.add(track.id);
            } else {
                track.markMissed();
            }
        }
        
        // Create new tracks for unmatched detections
        detections.forEach((detection, idx) => {
            if (!matched.has(idx)) {
                this.tracks.push(new Track(detection, this.frameNumber));
            }
        });
        
        // Remove old tracks
        this.tracks = this.tracks.filter(track => !track.shouldDelete());
        
        return this.tracks.filter(track => track.isActive());
    }
    
    getActiveTracks() {
        return this.tracks.filter(track => track.isActive());
    }
    
    setIOUThreshold(threshold) {
        this.iouThreshold = threshold;
    }
    
    reset() {
        this.tracks = [];
        this.frameNumber = 0;
    }
}

// ========================================
// Counting Line
// ========================================

class CountingLine {
    static nextId = 1;
    
    constructor(x1, y1, x2, y2, name = null) {
        this.id = CountingLine.nextId++;
        this.name = name || `Lane ${this.id}`;
        this.start = { x: x1, y: y1 };
        this.end = { x: x2, y: y2 };
        this.visible = true;
        this.color = CONFIG.LINE_COLORS[(this.id - 1) % CONFIG.LINE_COLORS.length];
        
        // Counts
        this.counts = {
            total: { in: 0, out: 0 },
            byClass: {}
        };
        
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            this.counts.byClass[cls] = { in: 0, out: 0 };
        });
    }
    
    checkCrossing(track) {
        const trackId = track.id;
        const centroid = track.centroid;
        
        // Calculate which side of the line the centroid is on
        const side = getLineSide(this.start, this.end, centroid);
        const currentSide = side > 0 ? 1 : (side < 0 ? -1 : 0);
        
        // Initialize tracking for this line if needed
        if (!track.lineCrossings[this.id]) {
            track.lineCrossings[this.id] = {
                side: currentSide,
                counted: false,
                timestamp: Date.now()
            };
            return null;
        }
        
        const previousSide = track.lineCrossings[this.id].side;
        
        // Check if crossed the line
        if (previousSide !== 0 && currentSide !== 0 && previousSide !== currentSide) {
            const direction = currentSide > 0 ? 'in' : 'out';
            
            // Count only if not already counted for this crossing
            if (!track.lineCrossings[this.id].counted) {
                this.counts.total[direction]++;
                this.counts.byClass[track.class][direction]++;
                track.lineCrossings[this.id].counted = true;
                track.lineCrossings[this.id].timestamp = Date.now();
                
                return {
                    lineId: this.id,
                    lineName: this.name,
                    direction,
                    class: track.class,
                    trackId: track.id,
                    timestamp: Date.now()
                };
            }
        }
        
        // Update side and reset counted flag if side changed
        if (currentSide !== previousSide) {
            track.lineCrossings[this.id].side = currentSide;
            track.lineCrossings[this.id].counted = false;
        }
        
        return null;
    }
    
    draw(ctx, scale = 1) {
        if (!this.visible) return;
        
        const x1 = this.start.x * scale;
        const y1 = this.start.y * scale;
        const x2 = this.end.x * scale;
        const y2 = this.end.y * scale;
        
        // Draw the line
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw endpoints
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x1, y1, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw label
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        ctx.fillStyle = this.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Background for text
        const textWidth = ctx.measureText(this.name).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(midX - textWidth / 2 - 8, midY - 12, textWidth + 16, 24);
        
        ctx.fillStyle = this.color;
        ctx.fillText(this.name, midX, midY);
        
        // Draw direction indicators (arrows)
        this.drawDirectionArrows(ctx, x1, y1, x2, y2);
    }
    
    drawDirectionArrows(ctx, x1, y1, x2, y2) {
        // Calculate perpendicular direction
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / len * 30;
        const perpY = dx / len * 30;
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // "IN" side (positive side)
        const inX = midX + perpX;
        const inY = midY + perpY;
        
        ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('IN', inX, inY);
        
        // "OUT" side (negative side)
        const outX = midX - perpX;
        const outY = midY - perpY;
        
        ctx.fillStyle = 'rgba(255, 51, 102, 0.3)';
        ctx.fillText('OUT', outX, outY);
    }
    
    resetCounts() {
        this.counts.total = { in: 0, out: 0 };
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            this.counts.byClass[cls] = { in: 0, out: 0 };
        });
    }
    
    isPointNear(x, y, threshold = 20) {
        const scale = 1; // Adjust if needed
        const distToStart = distance({ x, y }, { 
            x: this.start.x * scale, 
            y: this.start.y * scale 
        });
        const distToEnd = distance({ x, y }, { 
            x: this.end.x * scale, 
            y: this.end.y * scale 
        });
        
        return {
            start: distToStart < threshold,
            end: distToEnd < threshold
        };
    }
}

// ========================================
// Heatmap Renderer
// ========================================

class HeatmapRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        this.decay = CONFIG.HEATMAP_DECAY;
        this.opacity = 0.7;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    applyDecay() {
        // Create a semi-transparent overlay to fade previous trails
        this.ctx.fillStyle = `rgba(26, 26, 46, ${1 - this.decay})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawTrails(tracks) {
        this.applyDecay();
        
        const scaleX = this.canvas.width / CONFIG.TARGET_WIDTH;
        const scaleY = this.canvas.height / CONFIG.TARGET_HEIGHT;
        
        tracks.forEach(track => {
            if (!track.isActive() || track.trail.length < 2) return;
            
            const color = CONFIG.BBOX_COLORS[track.class] || '#ffffff';
            
            // Draw trail as connected line segments with gradient
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            this.ctx.beginPath();
            track.trail.forEach((point, idx) => {
                const x = point.x * scaleX;
                const y = point.y * scaleY;
                
                if (idx === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            
            // Set opacity based on track confidence
            this.ctx.globalAlpha = this.opacity * track.confidence;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
            
            // Draw current position as a bright dot
            const currentPos = track.trail[track.trail.length - 1];
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(currentPos.x * scaleX, currentPos.y * scaleY, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    setOpacity(opacity) {
        this.opacity = opacity;
    }
    
    setDecay(decay) {
        this.decay = decay;
    }
}

// ========================================
// Speed Estimator
// ========================================

class SpeedEstimator {
    constructor() {
        this.enabled = false;
        this.calibrationDistance = 5; // meters
        this.lines = []; // Reference to counting lines
        this.speedData = {}; // trackId -> { line1Time, line2Time, distance, speed }
        this.averageSpeeds = {}; // class -> array of speeds
        
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            this.averageSpeeds[cls] = [];
        });
    }
    
    setLines(lines) {
        this.lines = lines;
    }
    
    setCalibration(distanceInMeters) {
        this.calibrationDistance = distanceInMeters;
    }
    
    enable() {
        this.enabled = true;
    }
    
    disable() {
        this.enabled = false;
        this.speedData = {};
    }
    
    recordLineCrossing(event) {
        if (!this.enabled || this.lines.length < 2) return;
        
        const trackId = event.trackId;
        const lineId = event.lineId;
        const timestamp = event.timestamp;
        
        if (!this.speedData[trackId]) {
            this.speedData[trackId] = {
                crossings: {},
                speeds: []
            };
        }
        
        this.speedData[trackId].crossings[lineId] = timestamp;
        
        // Check if we have crossings for two different lines
        const crossings = Object.entries(this.speedData[trackId].crossings);
        if (crossings.length >= 2) {
            // Calculate speed between first two lines crossed
            const [line1Id, time1] = crossings[0];
            const [line2Id, time2] = crossings[1];
            
            if (line1Id !== line2Id) {
                const timeDiff = Math.abs(time2 - time1) / 1000; // seconds
                
                if (timeDiff > 0) {
                    const speedMPS = this.calibrationDistance / timeDiff; // m/s
                    const speedKMH = speedMPS * 3.6; // km/h
                    
                    this.speedData[trackId].speeds.push(speedKMH);
                    
                    // Add to class average
                    if (this.averageSpeeds[event.class]) {
                        this.averageSpeeds[event.class].push(speedKMH);
                        
                        // Keep only last 50 samples per class
                        if (this.averageSpeeds[event.class].length > 50) {
                            this.averageSpeeds[event.class].shift();
                        }
                    }
                    
                    // Reset for next pair
                    this.speedData[trackId].crossings = {};
                }
            }
        }
    }
    
    getAverageSpeed(vehicleClass) {
        if (!this.averageSpeeds[vehicleClass] || this.averageSpeeds[vehicleClass].length === 0) {
            return 0;
        }
        
        const sum = this.averageSpeeds[vehicleClass].reduce((a, b) => a + b, 0);
        return sum / this.averageSpeeds[vehicleClass].length;
    }
    
    reset() {
        this.speedData = {};
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            this.averageSpeeds[cls] = [];
        });
    }
}

// ========================================
// Main Application
// ========================================

class VehicleCounterApp {
    constructor() {
        // Video and Canvas elements
        this.videoElement = document.getElementById('videoElement');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.heatmapCanvas = document.getElementById('heatmapCanvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        
        // Core components
        this.detectionEngine = new DetectionEngine();
        this.tracker = new Tracker();
        this.heatmapRenderer = new HeatmapRenderer(this.heatmapCanvas);
        this.speedEstimator = new SpeedEstimator();
        
        // State
        this.cameraStream = null;
        this.isRunning = false;
        this.isPaused = false;
        this.animationFrameId = null;
        this.lastInferenceTime = 0;
        
        // Counting lines
        this.countingLines = [];
        
        // Settings
        this.enabledClasses = new Set(CONFIG.VEHICLE_CLASSES);
        this.showHeatmap = true;
        this.editMode = false;
        this.draggedPoint = null;
        
        // Performance metrics
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = Date.now();
        this.inferenceTime = 0;
        
        // Initialize
        this.initializeUI();
        this.initializeDefaultLines();
        this.loadModel();
    }
    
    async loadModel() {
        try {
            await this.detectionEngine.initialize();
            this.hideLoadingOverlay();
        } catch (error) {
            console.error('Failed to load model:', error);
            alert('Failed to load detection model. Please refresh the page.');
        }
    }
    
    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('hidden');
    }
    
    initializeUI() {
        // Camera controls
        this.populateCameraDevices();
        document.getElementById('startBtn').addEventListener('click', () => this.startCamera());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopCamera());
        
        // Detection controls
        document.getElementById('confidenceSlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('confidenceValue').textContent = value.toFixed(2);
            this.detectionEngine.setConfidenceThreshold(value);
        });
        
        document.getElementById('iouSlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('iouValue').textContent = value.toFixed(2);
            this.tracker.setIOUThreshold(value);
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseInference());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeInference());
        
        // Class toggles
        document.querySelectorAll('.class-toggle').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const className = e.target.dataset.class;
                if (e.target.checked) {
                    this.enabledClasses.add(className);
                } else {
                    this.enabledClasses.delete(className);
                }
            });
        });
        
        // Line controls
        document.getElementById('addLineBtn').addEventListener('click', () => this.addCountingLine());
        document.getElementById('editModeToggle').addEventListener('change', (e) => {
            this.editMode = e.target.checked;
            this.overlayCanvas.style.cursor = this.editMode ? 'crosshair' : 'default';
        });
        
        // Visualization controls
        document.getElementById('showHeatmap').addEventListener('change', (e) => {
            this.showHeatmap = e.target.checked;
            this.heatmapCanvas.style.display = this.showHeatmap ? 'block' : 'none';
        });
        
        document.getElementById('heatmapOpacitySlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('heatmapOpacityValue').textContent = value.toFixed(2);
            this.heatmapRenderer.setOpacity(value);
        });
        
        document.getElementById('heatmapDecaySlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('heatmapDecayValue').textContent = value.toFixed(2);
            this.heatmapRenderer.setDecay(value);
        });
        
        // Speed estimation
        document.getElementById('speedEstimationToggle').addEventListener('change', (e) => {
            const calibrationPanel = document.getElementById('calibrationPanel');
            const speedStatsSection = document.getElementById('speedStatsSection');
            
            if (e.target.checked) {
                this.speedEstimator.enable();
                calibrationPanel.style.display = 'block';
                speedStatsSection.style.display = 'block';
            } else {
                this.speedEstimator.disable();
                calibrationPanel.style.display = 'none';
                speedStatsSection.style.display = 'none';
            }
        });
        
        document.getElementById('calibrateBtn').addEventListener('click', () => {
            const distance = parseFloat(document.getElementById('calibrationDistance').value);
            this.speedEstimator.setCalibration(distance);
            alert(`Calibration updated: ${distance}m between lines`);
        });
        
        // Actions
        document.getElementById('resetCountsBtn').addEventListener('click', () => this.resetCounts());
        document.getElementById('clearHeatmapBtn').addEventListener('click', () => {
            this.heatmapRenderer.clear();
        });
        
        // Canvas interaction for line editing
        this.overlayCanvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        this.overlayCanvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.overlayCanvas.addEventListener('mouseup', () => this.handleCanvasMouseUp());
    }
    
    async populateCameraDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            const select = document.getElementById('cameraSelect');
            select.innerHTML = '<option value="">Select Camera...</option>';
            
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `Camera ${index + 1}`;
                select.appendChild(option);
            });
            
            // Auto-select first camera if available
            if (videoDevices.length > 0) {
                select.selectedIndex = 1;
            }
        } catch (error) {
            console.error('Error enumerating devices:', error);
        }
    }
    
    async startCamera() {
        const deviceId = document.getElementById('cameraSelect').value;
        
        if (!deviceId) {
            alert('Please select a camera device');
            return;
        }
        
        try {
            const constraints = {
                video: {
                    deviceId: { exact: deviceId },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.cameraStream;
            
            // Wait for video to be ready
            await new Promise(resolve => {
                this.videoElement.onloadedmetadata = () => {
                    resolve();
                };
            });
            
            // Setup canvases
            this.setupCanvases();
            
            // Update UI
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = false;
            
            // Start detection loop
            this.isRunning = true;
            this.startDetectionLoop();
            
        } catch (error) {
            console.error('Error starting camera:', error);
            alert('Failed to start camera. Please check permissions.');
        }
    }
    
    stopCamera() {
        this.isRunning = false;
        
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Clear canvases
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        this.heatmapRenderer.clear();
        
        // Update UI
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('resumeBtn').style.display = 'none';
    }
    
    setupCanvases() {
        const videoWidth = this.videoElement.videoWidth;
        const videoHeight = this.videoElement.videoHeight;
        
        // Set display size (scaled to fit container)
        const container = this.overlayCanvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const videoAspect = videoWidth / videoHeight;
        const containerAspect = containerWidth / containerHeight;
        
        let displayWidth, displayHeight;
        if (videoAspect > containerAspect) {
            displayWidth = containerWidth;
            displayHeight = containerWidth / videoAspect;
        } else {
            displayHeight = containerHeight;
            displayWidth = containerHeight * videoAspect;
        }
        
        // Set canvas sizes
        this.overlayCanvas.style.width = `${displayWidth}px`;
        this.overlayCanvas.style.height = `${displayHeight}px`;
        this.heatmapCanvas.style.width = `${displayWidth}px`;
        this.heatmapCanvas.style.height = `${displayHeight}px`;
        
        // Set internal resolution (use target resolution for performance)
        this.overlayCanvas.width = CONFIG.TARGET_WIDTH;
        this.overlayCanvas.height = CONFIG.TARGET_HEIGHT;
        this.heatmapCanvas.width = CONFIG.TARGET_WIDTH;
        this.heatmapCanvas.height = CONFIG.TARGET_HEIGHT;
    }
    
    initializeDefaultLines() {
        // Add two default counting lines
        const line1 = new CountingLine(200, 240, 440, 240, 'Lane 1');
        const line2 = new CountingLine(150, 350, 490, 350, 'Lane 2');
        
        this.countingLines.push(line1, line2);
        this.speedEstimator.setLines(this.countingLines);
        
        this.updateLineUI();
    }
    
    addCountingLine() {
        const y = 200 + this.countingLines.length * 50;
        const line = new CountingLine(150, y, 490, y, `Lane ${this.countingLines.length + 1}`);
        this.countingLines.push(line);
        this.speedEstimator.setLines(this.countingLines);
        this.updateLineUI();
    }
    
    removeLine(lineId) {
        this.countingLines = this.countingLines.filter(line => line.id !== lineId);
        this.speedEstimator.setLines(this.countingLines);
        this.updateLineUI();
    }
    
    updateLineUI() {
        const container = document.getElementById('linesContainer');
        container.innerHTML = '';
        
        this.countingLines.forEach(line => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line-item';
            lineDiv.innerHTML = `
                <div class="line-header">
                    <div class="line-name">
                        <input type="text" value="${line.name}" 
                               data-line-id="${line.id}" 
                               class="line-name-input">
                    </div>
                    <div class="line-controls">
                        <button class="remove-line-btn" data-line-id="${line.id}">✕</button>
                    </div>
                </div>
                <div class="line-visibility">
                    <input type="checkbox" 
                           ${line.visible ? 'checked' : ''} 
                           data-line-id="${line.id}" 
                           class="line-visibility-toggle">
                    <span>Visible</span>
                </div>
            `;
            
            container.appendChild(lineDiv);
        });
        
        // Add event listeners
        container.querySelectorAll('.line-name-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const lineId = parseInt(e.target.dataset.lineId);
                const line = this.countingLines.find(l => l.id === lineId);
                if (line) line.name = e.target.value;
                this.updateLaneStats();
            });
        });
        
        container.querySelectorAll('.remove-line-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lineId = parseInt(e.target.dataset.lineId);
                this.removeLine(lineId);
            });
        });
        
        container.querySelectorAll('.line-visibility-toggle').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const lineId = parseInt(e.target.dataset.lineId);
                const line = this.countingLines.find(l => l.id === lineId);
                if (line) line.visible = e.target.checked;
            });
        });
        
        this.updateLaneStats();
    }
    
    pauseInference() {
        this.isPaused = true;
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'inline-block';
    }
    
    resumeInference() {
        this.isPaused = false;
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('resumeBtn').style.display = 'none';
    }
    
    resetCounts() {
        this.countingLines.forEach(line => line.resetCounts());
        this.tracker.reset();
        this.speedEstimator.reset();
        this.updateStats();
        this.updateLaneStats();
        this.updateSpeedStats();
    }
    
    startDetectionLoop() {
        const loop = async () => {
            if (!this.isRunning) return;
            
            const now = performance.now();
            
            // Run inference at controlled intervals
            if (!this.isPaused && now - this.lastInferenceTime >= CONFIG.INFERENCE_INTERVAL) {
                this.lastInferenceTime = now;
                
                try {
                    // Run detection
                    const result = await this.detectionEngine.detect(this.videoElement);
                    this.inferenceTime = result.inferenceTime;
                    
                    // Filter by enabled classes
                    const filteredDetections = result.detections.filter(det => 
                        this.enabledClasses.has(det.class)
                    );
                    
                    // Update tracker
                    const activeTracks = this.tracker.update(filteredDetections);
                    
                    // Check line crossings
                    this.countingLines.forEach(line => {
                        activeTracks.forEach(track => {
                            const crossing = line.checkCrossing(track);
                            if (crossing) {
                                this.speedEstimator.recordLineCrossing(crossing);
                            }
                        });
                    });
                    
                    // Update stats
                    this.updateStats();
                    this.updateLaneStats();
                    if (this.speedEstimator.enabled) {
                        this.updateSpeedStats();
                    }
                    
                } catch (error) {
                    console.error('Detection error:', error);
                }
            }
            
            // Render at display refresh rate
            this.render();
            
            // Update FPS
            this.updateFPS();
            
            this.animationFrameId = requestAnimationFrame(loop);
        };
        
        loop();
    }
    
    render() {
        // Clear overlay
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        const scaleX = this.overlayCanvas.width / this.videoElement.videoWidth;
        const scaleY = this.overlayCanvas.height / this.videoElement.videoHeight;
        
        // Draw heatmap/trails
        if (this.showHeatmap) {
            this.heatmapRenderer.drawTrails(this.tracker.getActiveTracks());
        }
        
        // Draw bounding boxes
        const activeTracks = this.tracker.getActiveTracks();
        activeTracks.forEach(track => {
            const bbox = track.bbox;
            const x = bbox.x * scaleX;
            const y = bbox.y * scaleY;
            const w = bbox.width * scaleX;
            const h = bbox.height * scaleY;
            
            const color = CONFIG.BBOX_COLORS[track.class] || '#ffffff';
            
            // Draw bounding box
            this.overlayCtx.strokeStyle = color;
            this.overlayCtx.lineWidth = 2;
            this.overlayCtx.strokeRect(x, y, w, h);
            
            // Draw label background
            const label = `${track.class} #${track.id} (${(track.confidence * 100).toFixed(0)}%)`;
            this.overlayCtx.font = '12px Arial';
            const textWidth = this.overlayCtx.measureText(label).width;
            
            this.overlayCtx.fillStyle = color;
            this.overlayCtx.fillRect(x, y - 20, textWidth + 8, 20);
            
            // Draw label text
            this.overlayCtx.fillStyle = '#000';
            this.overlayCtx.fillText(label, x + 4, y - 6);
            
            // Draw centroid
            const centroid = track.centroid;
            this.overlayCtx.fillStyle = color;
            this.overlayCtx.beginPath();
            this.overlayCtx.arc(centroid.x * scaleX, centroid.y * scaleY, 3, 0, 2 * Math.PI);
            this.overlayCtx.fill();
        });
        
        // Draw counting lines
        this.countingLines.forEach(line => {
            line.draw(this.overlayCtx, 1);
        });
    }
    
    updateFPS() {
        this.frameCount++;
        const now = Date.now();
        const elapsed = now - this.lastFpsUpdate;
        
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastFpsUpdate = now;
            
            document.getElementById('fpsDisplay').textContent = this.fps;
            document.getElementById('inferenceTimeDisplay').textContent = `${this.inferenceTime}ms`;
        }
    }
    
    updateStats() {
        const activeTracks = this.tracker.getActiveTracks();
        document.getElementById('trackedCountDisplay').textContent = activeTracks.length;
        
        // Calculate total counts
        let totalIn = 0;
        let totalOut = 0;
        const classCounts = {};
        
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            classCounts[cls] = { in: 0, out: 0 };
        });
        
        this.countingLines.forEach(line => {
            totalIn += line.counts.total.in;
            totalOut += line.counts.total.out;
            
            Object.keys(line.counts.byClass).forEach(cls => {
                classCounts[cls].in += line.counts.byClass[cls].in;
                classCounts[cls].out += line.counts.byClass[cls].out;
            });
        });
        
        document.getElementById('totalInCount').textContent = totalIn;
        document.getElementById('totalOutCount').textContent = totalOut;
        
        // Update class stats
        Object.keys(classCounts).forEach(cls => {
            const statDiv = document.querySelector(`.class-stat[data-class="${cls}"]`);
            if (statDiv) {
                const inSpan = statDiv.querySelector('.count-in strong');
                const outSpan = statDiv.querySelector('.count-out strong');
                if (inSpan) inSpan.textContent = classCounts[cls].in;
                if (outSpan) outSpan.textContent = classCounts[cls].out;
            }
        });
    }
    
    updateLaneStats() {
        const container = document.getElementById('laneStatsContainer');
        container.innerHTML = '';
        
        this.countingLines.forEach(line => {
            const laneDiv = document.createElement('div');
            laneDiv.className = 'lane-stat';
            laneDiv.innerHTML = `
                <div class="lane-stat-name">${line.name}</div>
                <div class="lane-stat-counts">
                    <span class="in">IN: ${line.counts.total.in}</span>
                    <span class="out">OUT: ${line.counts.total.out}</span>
                </div>
            `;
            container.appendChild(laneDiv);
        });
    }
    
    updateSpeedStats() {
        const container = document.getElementById('speedStatsContainer');
        container.innerHTML = '';
        
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            const avgSpeed = this.speedEstimator.getAverageSpeed(cls);
            if (avgSpeed > 0) {
                const speedDiv = document.createElement('div');
                speedDiv.className = 'speed-stat';
                speedDiv.innerHTML = `
                    <span class="speed-stat-class">${cls}</span>
                    <span class="speed-stat-value">${avgSpeed.toFixed(1)} km/h</span>
                `;
                container.appendChild(speedDiv);
            }
        });
    }
    
    // Canvas interaction handlers for line editing
    handleCanvasMouseDown(e) {
        if (!this.editMode) return;
        
        const rect = this.overlayCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.overlayCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.overlayCanvas.height / rect.height);
        
        // Check if clicking near any line endpoint
        for (const line of this.countingLines) {
            const near = line.isPointNear(x, y, 20);
            if (near.start) {
                this.draggedPoint = { line, point: 'start' };
                return;
            }
            if (near.end) {
                this.draggedPoint = { line, point: 'end' };
                return;
            }
        }
    }
    
    handleCanvasMouseMove(e) {
        if (!this.editMode || !this.draggedPoint) return;
        
        const rect = this.overlayCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.overlayCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.overlayCanvas.height / rect.height);
        
        const { line, point } = this.draggedPoint;
        
        if (point === 'start') {
            line.start.x = x;
            line.start.y = y;
        } else if (point === 'end') {
            line.end.x = x;
            line.end.y = y;
        }
    }
    
    handleCanvasMouseUp() {
        this.draggedPoint = null;
    }
}

// ========================================
// Initialize Application
// ========================================

let app;

window.addEventListener('DOMContentLoaded', () => {
    app = new VehicleCounterApp();
});

/**
 * Browser Vehicle Counter
 * Real-time vehicle detection, tracking, and counting system
 * 100% client-side processing using TensorFlow.js
 */

// ============================================================================
// Configuration & Constants
// ============================================================================

const CONFIG = {
    // Model configuration
    MODEL_TYPE: 'coco-ssd', // Fast and reliable for browser
    MIN_CONFIDENCE: 0.5,
    
    // Detection classes (COCO-SSD vehicle classes)
    VEHICLE_CLASSES: ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
    
    // Tracking parameters
    IOU_THRESHOLD: 0.3,
    MAX_MISSED_FRAMES: 10,
    TRAIL_LENGTH: 30,
    
    // Performance settings
    TARGET_INFERENCE_FPS: 15,
    VIDEO_SCALE: 0.5, // Scale down video for faster inference
    
    // Visualization
    COLORS: {
        car: '#00ff88',
        truck: '#ffa600',
        bus: '#ff4757',
        motorcycle: '#00a8ff',
        bicycle: '#e056fd'
    },
    
    // Line settings
    LINE_THICKNESS: 3,
    ENDPOINT_RADIUS: 8,
    DEFAULT_LINE_COLOR: '#00a8ff',
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate Intersection over Union (IOU) between two bounding boxes
 */
function calculateIOU(box1, box2) {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);
    
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const area1 = box1.width * box1.height;
    const area2 = box2.width * box2.height;
    const union = area1 + area2 - intersection;
    
    return union > 0 ? intersection / union : 0;
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
 * Determine which side of a line a point is on
 * Returns: positive = one side, negative = other side, 0 = on line
 */
function pointLineSide(point, lineStart, lineEnd) {
    return (lineEnd.x - lineStart.x) * (point.y - lineStart.y) - 
           (lineEnd.y - lineStart.y) * (point.x - lineStart.x);
}

/**
 * Calculate distance between two points
 */
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// ============================================================================
// Track Class - Represents a tracked object
// ============================================================================

class Track {
    static nextId = 1;
    
    constructor(detection) {
        this.id = Track.nextId++;
        this.class = detection.class;
        this.bbox = detection.bbox;
        this.confidence = detection.score;
        this.lastSeen = Date.now();
        this.missedFrames = 0;
        this.trail = [getCentroid(detection.bbox)];
        this.velocity = { x: 0, y: 0 };
        this.lineCrossings = {}; // Track which lines have been crossed
    }
    
    update(detection) {
        const newCentroid = getCentroid(detection.bbox);
        const oldCentroid = getCentroid(this.bbox);
        
        // Update velocity (simple delta)
        this.velocity = {
            x: newCentroid.x - oldCentroid.x,
            y: newCentroid.y - oldCentroid.y
        };
        
        this.bbox = detection.bbox;
        this.confidence = detection.score;
        this.lastSeen = Date.now();
        this.missedFrames = 0;
        
        // Add to trail
        this.trail.push(newCentroid);
        if (this.trail.length > CONFIG.TRAIL_LENGTH) {
            this.trail.shift();
        }
    }
    
    incrementMissedFrames() {
        this.missedFrames++;
    }
    
    isExpired() {
        return this.missedFrames > CONFIG.MAX_MISSED_FRAMES;
    }
    
    getCentroid() {
        return getCentroid(this.bbox);
    }
}

// ============================================================================
// CountingLine Class - Represents a directional counting line
// ============================================================================

class CountingLine {
    static nextId = 1;
    
    constructor(name, start, end, color = CONFIG.DEFAULT_LINE_COLOR) {
        this.id = CountingLine.nextId++;
        this.name = name;
        this.start = start;
        this.end = end;
        this.color = color;
        this.enabled = true;
        this.counts = {
            in: {},
            out: {}
        };
        
        // Initialize counts for all vehicle classes
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            this.counts.in[cls] = 0;
            this.counts.out[cls] = 0;
        });
        
        // For tracking which side objects were on previously
        this.objectSides = new Map();
    }
    
    checkCrossing(track) {
        if (!this.enabled) return null;
        
        const centroid = track.getCentroid();
        const currentSide = pointLineSide(centroid, this.start, this.end);
        
        const key = track.id;
        const previousSide = this.objectSides.get(key);
        
        // Store current side for next frame
        this.objectSides.set(key, currentSide);
        
        // Check if crossed (side changed from positive to negative or vice versa)
        if (previousSide !== undefined && previousSide !== 0 && currentSide !== 0) {
            if (Math.sign(previousSide) !== Math.sign(currentSide)) {
                // Determine direction
                const direction = currentSide > 0 ? 'in' : 'out';
                return { direction, class: track.class };
            }
        }
        
        return null;
    }
    
    recordCrossing(direction, vehicleClass) {
        if (this.counts[direction] && this.counts[direction][vehicleClass] !== undefined) {
            this.counts[direction][vehicleClass]++;
        }
    }
    
    resetCounts() {
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            this.counts.in[cls] = 0;
            this.counts.out[cls] = 0;
        });
        this.objectSides.clear();
    }
    
    getTotalIn() {
        return Object.values(this.counts.in).reduce((sum, val) => sum + val, 0);
    }
    
    getTotalOut() {
        return Object.values(this.counts.out).reduce((sum, val) => sum + val, 0);
    }
}

// ============================================================================
// ObjectTracker Class - IOU-based multi-object tracker
// ============================================================================

class ObjectTracker {
    constructor(iouThreshold = CONFIG.IOU_THRESHOLD) {
        this.tracks = [];
        this.iouThreshold = iouThreshold;
    }
    
    update(detections) {
        // Predict step (simple: keep current position, could add Kalman filter)
        // For now, we just increment missed frames
        this.tracks.forEach(track => track.incrementMissedFrames());
        
        // Association step: match detections to tracks using IOU
        const usedDetections = new Set();
        const usedTracks = new Set();
        
        // For each track, find best matching detection
        this.tracks.forEach((track, trackIdx) => {
            let bestIOU = this.iouThreshold;
            let bestDetectionIdx = -1;
            
            detections.forEach((detection, detIdx) => {
                if (usedDetections.has(detIdx)) return;
                if (detection.class !== track.class) return;
                
                const iou = calculateIOU(track.bbox, detection.bbox);
                if (iou > bestIOU) {
                    bestIOU = iou;
                    bestDetectionIdx = detIdx;
                }
            });
            
            if (bestDetectionIdx !== -1) {
                track.update(detections[bestDetectionIdx]);
                usedDetections.add(bestDetectionIdx);
                usedTracks.add(trackIdx);
            }
        });
        
        // Create new tracks for unmatched detections
        detections.forEach((detection, idx) => {
            if (!usedDetections.has(idx)) {
                this.tracks.push(new Track(detection));
            }
        });
        
        // Remove expired tracks
        this.tracks = this.tracks.filter(track => !track.isExpired());
        
        return this.tracks;
    }
    
    getTracks() {
        return this.tracks;
    }
    
    clearTracks() {
        this.tracks = [];
    }
    
    setIOUThreshold(threshold) {
        this.iouThreshold = threshold;
    }
}

// ============================================================================
// HeatmapRenderer Class - Visualize vehicle paths as heatmap
// ============================================================================

class HeatmapRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.opacity = 0.5;
        this.decay = 0.95;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    applyDecay() {
        this.ctx.globalAlpha = this.decay;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1.0;
    }
    
    addTrackPoints(tracks) {
        tracks.forEach(track => {
            if (track.trail.length < 2) return;
            
            const gradient = this.ctx.createRadialGradient(
                track.trail[track.trail.length - 1].x,
                track.trail[track.trail.length - 1].y,
                0,
                track.trail[track.trail.length - 1].x,
                track.trail[track.trail.length - 1].y,
                20
            );
            
            gradient.addColorStop(0, CONFIG.COLORS[track.class] + 'AA');
            gradient.addColorStop(1, CONFIG.COLORS[track.class] + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                track.trail[track.trail.length - 1].x - 20,
                track.trail[track.trail.length - 1].y - 20,
                40,
                40
            );
        });
    }
    
    setOpacity(opacity) {
        this.opacity = opacity;
        this.canvas.style.opacity = opacity;
    }
    
    setDecay(decay) {
        this.decay = decay;
    }
}

// ============================================================================
// VehicleCounterApp Class - Main application
// ============================================================================

class VehicleCounterApp {
    constructor() {
        // DOM elements
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('outputCanvas');
        this.heatmapCanvas = document.getElementById('heatmapCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Core components
        this.model = null;
        this.tracker = new ObjectTracker();
        this.heatmapRenderer = new HeatmapRenderer(this.heatmapCanvas);
        this.countingLines = [];
        
        // State
        this.isRunning = false;
        this.isPaused = false;
        this.stream = null;
        this.detections = [];
        this.activeClasses = new Set(CONFIG.VEHICLE_CLASSES);
        
        // Performance metrics
        this.fps = 0;
        this.inferenceTime = 0;
        this.frameCount = 0;
        this.lastFrameTime = Date.now();
        this.lastInferenceTime = 0;
        this.targetInferenceFps = CONFIG.TARGET_INFERENCE_FPS;
        
        // Counting line interaction
        this.draggedLineEndpoint = null;
        this.draggedLineId = null;
        
        // Settings
        this.confidenceThreshold = CONFIG.MIN_CONFIDENCE;
        this.showTrails = true;
        this.showHeatmap = false;
        
        this.initializeUI();
    }
    
    // ========================================================================
    // Initialization
    // ========================================================================
    
    async initialize() {
        try {
            // Enable WebGL backend for better performance
            await tf.setBackend('webgl');
            await tf.ready();
            console.log('TensorFlow.js backend:', tf.getBackend());
            
            // Load COCO-SSD model
            console.log('Loading COCO-SSD model...');
            this.model = await cocoSsd.load({
                base: 'lite_mobilenet_v2' // Faster variant for real-time
            });
            console.log('Model loaded successfully');
            
            this.loadingOverlay.classList.add('hidden');
            
            // Add default counting lines
            this.addCountingLine('Lane 1', 
                { x: 0.2, y: 0.5 }, 
                { x: 0.8, y: 0.5 }
            );
            
            return true;
        } catch (error) {
            console.error('Failed to initialize:', error);
            alert('Failed to load AI model. Please refresh the page.');
            return false;
        }
    }
    
    initializeUI() {
        // Camera controls
        document.getElementById('startBtn').addEventListener('click', () => this.startCamera());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopCamera());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        // Populate camera selector
        this.populateCameraSelector();
        
        // Confidence slider
        const confidenceSlider = document.getElementById('confidenceSlider');
        confidenceSlider.addEventListener('input', (e) => {
            this.confidenceThreshold = parseFloat(e.target.value);
            document.getElementById('confidenceValue').textContent = this.confidenceThreshold.toFixed(2);
        });
        
        // IOU slider
        const iouSlider = document.getElementById('iouSlider');
        iouSlider.addEventListener('input', (e) => {
            const threshold = parseFloat(e.target.value);
            this.tracker.setIOUThreshold(threshold);
            document.getElementById('iouValue').textContent = threshold.toFixed(2);
        });
        
        // Inference FPS slider
        const inferenceFpsSlider = document.getElementById('inferenceFpsSlider');
        inferenceFpsSlider.addEventListener('input', (e) => {
            this.targetInferenceFps = parseInt(e.target.value);
            document.getElementById('inferenceFpsValue').textContent = this.targetInferenceFps;
        });
        
        // Class filters
        CONFIG.VEHICLE_CLASSES.forEach(cls => {
            const checkbox = document.getElementById(`classFilter_${cls}`);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        this.activeClasses.add(cls);
                    } else {
                        this.activeClasses.delete(cls);
                    }
                });
            }
        });
        
        // Visualization controls
        document.getElementById('showTrails').addEventListener('change', (e) => {
            this.showTrails = e.target.checked;
        });
        
        document.getElementById('showHeatmap').addEventListener('change', (e) => {
            this.showHeatmap = e.target.checked;
            if (!e.target.checked) {
                this.heatmapRenderer.clear();
            }
        });
        
        document.getElementById('heatmapOpacitySlider').addEventListener('input', (e) => {
            const opacity = parseFloat(e.target.value);
            this.heatmapRenderer.setOpacity(opacity);
            document.getElementById('heatmapOpacityValue').textContent = opacity.toFixed(1);
        });
        
        document.getElementById('trailDecaySlider').addEventListener('input', (e) => {
            const decay = parseFloat(e.target.value);
            this.heatmapRenderer.setDecay(decay);
            document.getElementById('trailDecayValue').textContent = decay.toFixed(2);
        });
        
        // Counting line controls
        document.getElementById('addLineBtn').addEventListener('click', () => {
            const lineNum = this.countingLines.length + 1;
            this.addCountingLine(`Lane ${lineNum}`, 
                { x: 0.3, y: 0.3 + (lineNum * 0.1) }, 
                { x: 0.7, y: 0.3 + (lineNum * 0.1) }
            );
        });
        
        document.getElementById('resetCountsBtn').addEventListener('click', () => {
            this.resetAllCounts();
        });
        
        // Canvas interaction for line dragging
        this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleCanvasMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleCanvasMouseUp());
    }
    
    async populateCameraSelector() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            const selector = document.getElementById('cameraSelect');
            selector.innerHTML = '<option value="">Select Camera...</option>';
            
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `Camera ${index + 1}`;
                selector.appendChild(option);
            });
            
            if (videoDevices.length > 0) {
                selector.selectedIndex = 1; // Select first camera by default
            }
        } catch (error) {
            console.error('Error enumerating cameras:', error);
        }
    }
    
    // ========================================================================
    // Camera Management
    // ========================================================================
    
    async startCamera() {
        try {
            const cameraSelect = document.getElementById('cameraSelect');
            const deviceId = cameraSelect.value;
            
            if (!deviceId) {
                alert('Please select a camera');
                return;
            }
            
            // Request camera access
            const constraints = {
                video: {
                    deviceId: { exact: deviceId },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            // Wait for video to be ready
            await new Promise(resolve => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
            
            // Set canvas sizes
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.heatmapCanvas.width = this.video.videoWidth;
            this.heatmapCanvas.height = this.video.videoHeight;
            
            // Update UI
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = false;
            document.getElementById('cameraSelect').disabled = true;
            
            // Start detection loop
            this.isRunning = true;
            this.lastInferenceTime = Date.now();
            this.detectionLoop();
            
        } catch (error) {
            console.error('Camera error:', error);
            alert('Failed to access camera. Please check permissions.');
        }
    }
    
    stopCamera() {
        this.isRunning = false;
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.heatmapRenderer.clear();
        
        // Reset UI
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('cameraSelect').disabled = false;
        
        // Clear tracks
        this.tracker.clearTracks();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pauseBtn');
        btn.textContent = this.isPaused ? 'Resume Inference' : 'Pause Inference';
    }
    
    // ========================================================================
    // Detection & Tracking Loop
    // ========================================================================
    
    async detectionLoop() {
        if (!this.isRunning) return;
        
        // Calculate FPS
        const now = Date.now();
        const elapsed = now - this.lastFrameTime;
        this.fps = Math.round(1000 / elapsed);
        this.lastFrameTime = now;
        
        // Run inference at target FPS
        const timeSinceLastInference = now - this.lastInferenceTime;
        const inferenceInterval = 1000 / this.targetInferenceFps;
        
        if (!this.isPaused && timeSinceLastInference >= inferenceInterval) {
            await this.runInference();
            this.lastInferenceTime = now;
        }
        
        // Always render (even when paused, to allow line editing)
        this.render();
        
        // Update HUD
        this.updateHUD();
        
        // Use requestVideoFrameCallback if available, otherwise requestAnimationFrame
        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
            this.video.requestVideoFrameCallback(() => this.detectionLoop());
        } else {
            requestAnimationFrame(() => this.detectionLoop());
        }
    }
    
    async runInference() {
        try {
            const startTime = performance.now();
            
            // Run detection (COCO-SSD returns predictions directly)
            const predictions = await this.model.detect(this.video);
            
            // Filter for vehicle classes and confidence
            this.detections = predictions
                .filter(pred => 
                    CONFIG.VEHICLE_CLASSES.includes(pred.class) &&
                    this.activeClasses.has(pred.class) &&
                    pred.score >= this.confidenceThreshold
                )
                .map(pred => ({
                    class: pred.class,
                    score: pred.score,
                    bbox: {
                        x: pred.bbox[0],
                        y: pred.bbox[1],
                        width: pred.bbox[2],
                        height: pred.bbox[3]
                    }
                }));
            
            // Update tracker
            this.tracker.update(this.detections);
            
            // Check line crossings
            this.checkLineCrossings();
            
            this.inferenceTime = Math.round(performance.now() - startTime);
            
        } catch (error) {
            console.error('Inference error:', error);
        }
    }
    
    // ========================================================================
    // Rendering
    // ========================================================================
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const tracks = this.tracker.getTracks();
        
        // Render heatmap
        if (this.showHeatmap) {
            this.heatmapRenderer.applyDecay();
            this.heatmapRenderer.addTrackPoints(tracks);
        }
        
        // Render trails
        if (this.showTrails) {
            tracks.forEach(track => this.drawTrail(track));
        }
        
        // Render bounding boxes
        tracks.forEach(track => this.drawBoundingBox(track));
        
        // Render counting lines
        this.countingLines.forEach(line => this.drawCountingLine(line));
    }
    
    drawBoundingBox(track) {
        const { bbox, class: cls, confidence, id } = track;
        const color = CONFIG.COLORS[cls] || '#fff';
        
        // Draw box
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
        
        // Draw label background
        const label = `${cls} #${id} (${(confidence * 100).toFixed(0)}%)`;
        this.ctx.font = '14px Arial';
        const textWidth = this.ctx.measureText(label).width;
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(bbox.x, bbox.y - 20, textWidth + 10, 20);
        
        // Draw label text
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(label, bbox.x + 5, bbox.y - 5);
    }
    
    drawTrail(track) {
        if (track.trail.length < 2) return;
        
        const color = CONFIG.COLORS[track.class] || '#fff';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(track.trail[0].x, track.trail[0].y);
        
        for (let i = 1; i < track.trail.length; i++) {
            this.ctx.lineTo(track.trail[i].x, track.trail[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
    }
    
    drawCountingLine(line) {
        if (!line.enabled) return;
        
        const { start, end, color, name } = line;
        
        // Draw line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = CONFIG.LINE_THICKNESS;
        this.ctx.setLineDash([10, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        
        // Draw endpoints
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(start.x, start.y, CONFIG.ENDPOINT_RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(end.x, end.y, CONFIG.ENDPOINT_RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw direction arrows (IN = left side, OUT = right side)
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        
        // Calculate perpendicular direction
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / length;
        const perpY = dx / length;
        
        // Draw "IN" arrow (positive side)
        const inX = midX + perpX * 30;
        const inY = midY + perpY * 30;
        
        this.ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('IN', inX - 10, inY + 5);
        
        // Draw "OUT" arrow (negative side)
        const outX = midX - perpX * 30;
        const outY = midY - perpY * 30;
        
        this.ctx.fillStyle = 'rgba(255, 166, 0, 0.7)';
        this.ctx.fillText('OUT', outX - 15, outY + 5);
        
        // Draw line name
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText(name, midX - 30, midY - 15);
    }
    
    // ========================================================================
    // Counting Line Management
    // ========================================================================
    
    addCountingLine(name, startNormalized, endNormalized) {
        const start = {
            x: startNormalized.x * this.canvas.width,
            y: startNormalized.y * this.canvas.height
        };
        const end = {
            x: endNormalized.x * this.canvas.width,
            y: endNormalized.y * this.canvas.height
        };
        
        const line = new CountingLine(name, start, end);
        this.countingLines.push(line);
        this.updateLineUI();
    }
    
    removeCountingLine(lineId) {
        this.countingLines = this.countingLines.filter(line => line.id !== lineId);
        this.updateLineUI();
    }
    
    toggleCountingLine(lineId) {
        const line = this.countingLines.find(l => l.id === lineId);
        if (line) {
            line.enabled = !line.enabled;
            this.updateLineUI();
        }
    }
    
    updateLineUI() {
        const container = document.getElementById('linesContainer');
        container.innerHTML = '';
        
        this.countingLines.forEach(line => {
            const item = document.createElement('div');
            item.className = 'line-item';
            
            const totalIn = line.getTotalIn();
            const totalOut = line.getTotalOut();
            
            item.innerHTML = `
                <div class="line-item-header">
                    <span class="line-item-name">${line.name}</span>
                    <div class="line-item-controls">
                        <button class="line-item-toggle" data-id="${line.id}">
                            ${line.enabled ? '👁️ Hide' : '👁️‍🗨️ Show'}
                        </button>
                        <button class="line-item-delete" data-id="${line.id}">✕</button>
                    </div>
                </div>
                <div class="line-item-stats">
                    <div class="line-item-count">
                        <span class="count-in">IN: ${totalIn}</span>
                        <span class="count-out">OUT: ${totalOut}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(item);
            
            // Add event listeners
            item.querySelector('.line-item-toggle').addEventListener('click', () => {
                this.toggleCountingLine(line.id);
            });
            
            item.querySelector('.line-item-delete').addEventListener('click', () => {
                if (confirm(`Delete ${line.name}?`)) {
                    this.removeCountingLine(line.id);
                }
            });
        });
    }
    
    checkLineCrossings() {
        const tracks = this.tracker.getTracks();
        
        this.countingLines.forEach(line => {
            tracks.forEach(track => {
                const crossing = line.checkCrossing(track);
                if (crossing) {
                    line.recordCrossing(crossing.direction, crossing.class);
                    console.log(`${line.name}: ${crossing.class} crossed ${crossing.direction}`);
                }
            });
        });
        
        this.updateLineUI();
    }
    
    resetAllCounts() {
        this.countingLines.forEach(line => line.resetCounts());
        this.updateLineUI();
    }
    
    // ========================================================================
    // Canvas Interaction (Line Dragging)
    // ========================================================================
    
    handleCanvasMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        // Check if clicked on any line endpoint
        for (const line of this.countingLines) {
            if (!line.enabled) continue;
            
            const distToStart = distance({ x: mouseX, y: mouseY }, line.start);
            const distToEnd = distance({ x: mouseX, y: mouseY }, line.end);
            
            if (distToStart < CONFIG.ENDPOINT_RADIUS * 2) {
                this.draggedLineEndpoint = 'start';
                this.draggedLineId = line.id;
                return;
            }
            
            if (distToEnd < CONFIG.ENDPOINT_RADIUS * 2) {
                this.draggedLineEndpoint = 'end';
                this.draggedLineId = line.id;
                return;
            }
        }
    }
    
    handleCanvasMouseMove(e) {
        if (!this.draggedLineEndpoint || !this.draggedLineId) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        const line = this.countingLines.find(l => l.id === this.draggedLineId);
        if (line) {
            line[this.draggedLineEndpoint] = { x: mouseX, y: mouseY };
            // Clear object sides when line moves to recalculate crossings
            line.objectSides.clear();
        }
    }
    
    handleCanvasMouseUp() {
        this.draggedLineEndpoint = null;
        this.draggedLineId = null;
    }
    
    // ========================================================================
    // HUD Update
    // ========================================================================
    
    updateHUD() {
        document.getElementById('fpsDisplay').textContent = this.fps;
        document.getElementById('inferenceDisplay').textContent = `${this.inferenceTime}ms`;
        document.getElementById('trackedDisplay').textContent = this.tracker.getTracks().length;
        
        // Update counts display
        const countsDisplay = document.getElementById('countsDisplay');
        countsDisplay.innerHTML = '';
        
        this.countingLines.forEach(line => {
            if (!line.enabled) return;
            
            const group = document.createElement('div');
            group.className = 'count-group';
            
            const title = document.createElement('div');
            title.className = 'count-group-title';
            title.textContent = line.name;
            group.appendChild(title);
            
            // Total counts
            const totalIn = line.getTotalIn();
            const totalOut = line.getTotalOut();
            
            const totalItem = document.createElement('div');
            totalItem.className = 'count-item';
            totalItem.innerHTML = `
                <span class="count-item-label">Total:</span>
                <span class="count-item-value">
                    <span style="color: var(--success)">↑${totalIn}</span>
                    <span style="color: var(--warning)">↓${totalOut}</span>
                </span>
            `;
            group.appendChild(totalItem);
            
            // Per-class counts (only show if non-zero)
            CONFIG.VEHICLE_CLASSES.forEach(cls => {
                const inCount = line.counts.in[cls];
                const outCount = line.counts.out[cls];
                
                if (inCount > 0 || outCount > 0) {
                    const item = document.createElement('div');
                    item.className = 'count-item';
                    item.innerHTML = `
                        <span class="count-item-label">${cls}:</span>
                        <span class="count-item-value">
                            <span style="color: var(--success)">↑${inCount}</span>
                            <span style="color: var(--warning)">↓${outCount}</span>
                        </span>
                    `;
                    group.appendChild(item);
                }
            });
            
            countsDisplay.appendChild(group);
        });
    }
}

// ============================================================================
// Application Entry Point
// ============================================================================

let app;

window.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Browser Vehicle Counter...');
    
    app = new VehicleCounterApp();
    const initialized = await app.initialize();
    
    if (initialized) {
        console.log('Application ready!');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app && app.isRunning) {
        app.stopCamera();
    }
});

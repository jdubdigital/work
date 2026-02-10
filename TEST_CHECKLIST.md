# ✅ Test Checklist

Use this checklist to verify all features are working correctly.

## 🚀 Pre-Test Setup

- [ ] Start local server (Python, Node, or Live Server)
- [ ] Open browser (Chrome recommended)
- [ ] Navigate to http://localhost:8000
- [ ] Wait for "Loading AI model..." to disappear
- [ ] Open browser console (F12) to check for errors

---

## 📹 Camera Tests

### Basic Camera Operations
- [ ] Select camera from dropdown
- [ ] Click "Start Camera" - camera feed should appear
- [ ] Grant permissions if prompted
- [ ] Video should display clearly
- [ ] Click "Stop Camera" - video should stop
- [ ] Start camera again - should work

### Camera Selection
- [ ] Try different cameras (if multiple available)
- [ ] Each camera should work independently

**Expected**: Smooth video feed at 20-30 FPS

---

## 🤖 Detection Tests

### Basic Detection
- [ ] Click "Pause Inference" - detections should stop updating
- [ ] Click "Resume Inference" - detections should continue
- [ ] Point camera at vehicles (screen, toy cars, etc.)
- [ ] Bounding boxes should appear around vehicles
- [ ] Class labels should display (car, truck, etc.)
- [ ] Track IDs should persist as vehicles move
- [ ] Confidence scores should show in labels

### Confidence Threshold
- [ ] Adjust "Confidence Threshold" slider to 0.3
- [ ] More detections should appear
- [ ] Adjust to 0.7
- [ ] Fewer detections (only high confidence)

**Expected**: Detections respond to threshold changes immediately

---

## 🎯 Tracking Tests

### Track Persistence
- [ ] Move an object across the frame
- [ ] Track ID should remain the same
- [ ] Trail should follow behind object
- [ ] Multiple objects should have different IDs

### IOU Threshold
- [ ] Adjust "IOU Threshold" slider to 0.5
- [ ] Tracks may swap IDs more easily
- [ ] Adjust to 0.2
- [ ] Tracks should be more stable

### Track Expiration
- [ ] Remove an object from view
- [ ] Track should disappear after 2-3 seconds
- [ ] Track ID should not reappear on that object

**Expected**: Stable tracking with minimal ID swaps

---

## 📏 Counting Line Tests

### Default Line
- [ ] Default "Lane 1" line should be visible
- [ ] Line should have circular endpoints
- [ ] "IN" and "OUT" labels should be visible
- [ ] Line name should display at center

### Dragging Lines
- [ ] Click and drag left endpoint
- [ ] Endpoint should follow mouse
- [ ] Release mouse - endpoint stays in place
- [ ] Drag right endpoint - same behavior
- [ ] Line should redraw smoothly

### Line Crossings
- [ ] Position line perpendicular to movement
- [ ] Move object across line (IN direction)
- [ ] Count should increment in HUD
- [ ] Move object back (OUT direction)
- [ ] OUT count should increment
- [ ] Same object should NOT double-count in same direction

**Expected**: Accurate directional counting with no double-counts

---

## 🏁 Multi-Lane Tests

### Adding Lines
- [ ] Click "+ Add Line" button
- [ ] New "Lane 2" should appear
- [ ] Drag endpoints to different position
- [ ] Add "Lane 3"
- [ ] All lines should be visible

### Line Management
- [ ] Toggle "👁️ Hide" on Lane 2
- [ ] Lane 2 should disappear but still exist in UI
- [ ] Toggle "👁️ Show"
- [ ] Lane 2 should reappear
- [ ] Click "✕" to delete Lane 3
- [ ] Lane 3 should be removed completely

### Independent Counts
- [ ] Cross Lane 1 with object
- [ ] Lane 1 count should increment
- [ ] Cross Lane 2 with object
- [ ] Lane 2 count should increment independently
- [ ] Lane 1 count should not change

**Expected**: Each lane tracks independently

---

## 🎨 Visualization Tests

### Trails
- [ ] "Show Trails" should be checked by default
- [ ] Moving objects should leave trails
- [ ] Uncheck "Show Trails"
- [ ] Trails should disappear
- [ ] Re-enable trails

### Heatmap
- [ ] Check "Show Heatmap"
- [ ] Move objects around for 30 seconds
- [ ] Heat should accumulate where objects pass
- [ ] Adjust "Heatmap Opacity" slider
- [ ] Heatmap should become more/less visible
- [ ] Adjust "Trail Decay" slider to 0.9
- [ ] Heat should fade faster
- [ ] Adjust to 0.99
- [ ] Heat should persist longer

**Expected**: Smooth heatmap accumulation with visible decay

---

## 🎛️ Control Tests

### Class Filters
- [ ] Uncheck "Car"
- [ ] Cars should not be detected
- [ ] Check "Car" again
- [ ] Cars should reappear
- [ ] Try unchecking all classes
- [ ] No detections should appear
- [ ] Re-enable all classes

### Inference FPS
- [ ] Set "Inference FPS" to 5
- [ ] Detections should update slowly
- [ ] HUD "Inference" time might be lower
- [ ] Set to 30
- [ ] Detections should update quickly
- [ ] Set back to 15

### Reset Counts
- [ ] Cross lines several times to build up counts
- [ ] Click "Reset Counts" button
- [ ] All counts in HUD should reset to 0
- [ ] Lines should remain in place
- [ ] New crossings should count from 0

**Expected**: All controls respond immediately

---

## 📊 HUD Tests

### Metrics Display
- [ ] HUD should show:
  - [ ] FPS (should be 20-30+)
  - [ ] Inference time (should be <150ms)
  - [ ] Tracked objects count
  - [ ] Per-line counts (IN/OUT)
  - [ ] Per-class breakdown

### Real-time Updates
- [ ] Metrics should update every frame
- [ ] FPS should be relatively stable
- [ ] Tracked count should match visible tracks
- [ ] Counts should match observed crossings

**Expected**: Accurate, real-time metrics

---

## ⚡ Performance Tests

### Frame Rate
- [ ] Check FPS in HUD
- [ ] Should be 20-30 on modern laptops
- [ ] Should stay stable during detection

### Inference Time
- [ ] Check "Inference" in HUD
- [ ] Desktop (good GPU): 25-50ms
- [ ] Laptop (integrated GPU): 80-150ms
- [ ] Should be relatively consistent

### Memory Usage
- [ ] Open Chrome Task Manager (Shift+Esc)
- [ ] Find browser tab
- [ ] Memory should be 200-400MB
- [ ] Should remain stable (no leaks)

### Stress Test
- [ ] Add 4-5 counting lines
- [ ] Enable heatmap
- [ ] Move multiple objects
- [ ] System should remain responsive
- [ ] FPS may drop slightly but should stay >10

**Expected**: Stable performance with no crashes

---

## 🐛 Error Handling Tests

### Camera Errors
- [ ] Deny camera permissions
- [ ] Error message should appear
- [ ] Refresh page and grant permissions
- [ ] Should work normally

### No Devices
- [ ] Unplug all cameras (if possible)
- [ ] Camera selector should show no devices
- [ ] Should not crash

### Model Loading
- [ ] Disable internet (after first load)
- [ ] Refresh page
- [ ] Model should load from cache
- [ ] Should work normally

**Expected**: Graceful error handling, no crashes

---

## 🌐 Browser Compatibility

### Chrome (Primary)
- [ ] All features work
- [ ] Performance is good
- [ ] WebGL backend active (check console)

### Edge (Chromium)
- [ ] All features work
- [ ] Performance similar to Chrome

### Firefox (Best Effort)
- [ ] Camera access works
- [ ] Detections work
- [ ] May have performance differences

**Expected**: Full functionality in Chrome/Edge

---

## 📱 Responsive Design

### Window Resizing
- [ ] Resize browser window
- [ ] UI should adapt
- [ ] Canvas should remain proportional
- [ ] Controls should remain accessible

### Zoom Levels
- [ ] Zoom in (Ctrl/Cmd +)
- [ ] UI should scale appropriately
- [ ] Zoom out (Ctrl/Cmd -)
- [ ] Everything should remain readable

**Expected**: Usable at various sizes

---

## 🎓 Documentation Tests

### README Accuracy
- [ ] Follow QUICKSTART.md instructions
- [ ] All steps should work
- [ ] Check one troubleshooting solution
- [ ] Should resolve issue

### Code Comments
- [ ] Open app.js in editor
- [ ] Check class and function comments
- [ ] Should be clear and helpful

### Examples
- [ ] Try one configuration from EXAMPLES.md
- [ ] Should work as described

**Expected**: Documentation matches implementation

---

## ✅ Final Verification

### All Core Features
- [ ] Real-time detection ✓
- [ ] Object tracking ✓
- [ ] Directional counting ✓
- [ ] Lane-based counting ✓
- [ ] Heatmap visualization ✓
- [ ] Performance optimization ✓
- [ ] No data transmission ✓

### Quality Checks
- [ ] No console errors (F12)
- [ ] UI is responsive and intuitive
- [ ] Features work as documented
- [ ] Performance meets benchmarks

### User Experience
- [ ] Easy to set up (<2 minutes)
- [ ] Controls are intuitive
- [ ] Visual feedback is clear
- [ ] System is stable

---

## 📋 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

Camera Tests:         [ PASS / FAIL ]
Detection Tests:      [ PASS / FAIL ]
Tracking Tests:       [ PASS / FAIL ]
Counting Line Tests:  [ PASS / FAIL ]
Multi-Lane Tests:     [ PASS / FAIL ]
Visualization Tests:  [ PASS / FAIL ]
Control Tests:        [ PASS / FAIL ]
HUD Tests:            [ PASS / FAIL ]
Performance Tests:    [ PASS / FAIL ]
Error Handling Tests: [ PASS / FAIL ]

Overall Result:       [ PASS / FAIL ]

Notes:
__________________________________
__________________________________
__________________________________
```

---

## 🚨 Critical Issues Checklist

If any of these fail, it's a critical issue:

- [ ] Camera does not start
- [ ] Model fails to load
- [ ] No detections appear
- [ ] Tracks lose IDs immediately
- [ ] Counts never increment
- [ ] Browser crashes
- [ ] Memory leak (>1GB usage)

---

## 💡 Testing Tips

1. **Use test videos**: Search "traffic camera" on YouTube
2. **Point camera at screen**: Test with video playback
3. **Use toy cars**: Physical objects work well
4. **Test in pairs**: One person moves objects, one monitors
5. **Document issues**: Screenshot + console logs
6. **Test incrementally**: One feature at a time
7. **Test edge cases**: Fast movement, occlusion, edge of frame

---

## 📞 Report Issues

If you find bugs:
1. Check browser console (F12) for errors
2. Note your browser and device
3. Document steps to reproduce
4. Include screenshots if helpful
5. Open an issue on GitHub

---

**Testing Complete!** ✅

If all tests pass, the system is ready for production use! 🎉

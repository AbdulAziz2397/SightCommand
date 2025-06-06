import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Crosshair, Eye, RotateCcw, CircleCheck as CheckCircle, Play, Target } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function EyeTrackingScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [gazePosition, setGazePosition] = useState({ x: screenWidth / 2, y: screenHeight / 2 });
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  const [tapFeedback, setTapFeedback] = useState(false);
  
  const pulseScale = useSharedValue(1);
  const gazeX = useSharedValue(screenWidth / 2);
  const gazeY = useSharedValue(screenHeight / 2);
  const feedbackOpacity = useSharedValue(0);

  // Adjusted calibration points with better spacing from edges
  const calibrationPoints = [
    { x: screenWidth * 0.15, y: screenHeight * 0.2 }, // Top-left
    { x: screenWidth * 0.85, y: screenHeight * 0.2 }, // Top-right
    { x: screenWidth * 0.5, y: screenHeight * 0.5 }, // Center
    { x: screenWidth * 0.15, y: screenHeight * 0.8 }, // Bottom-left
    { x: screenWidth * 0.85, y: screenHeight * 0.8 }, // Bottom-right
  ];

  useEffect(() => {
    if (isCalibrating) {
      pulseScale.value = withRepeat(withSpring(1.3, { damping: 2 }), -1, true);
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isCalibrating]);

  // Simulate eye tracking with random movement
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        const newX = Math.max(50, Math.min(screenWidth - 50, gazePosition.x + (Math.random() - 0.5) * 30));
        const newY = Math.max(100, Math.min(screenHeight - 100, gazePosition.y + (Math.random() - 0.5) * 30));
        
        setGazePosition({ x: newX, y: newY });
        gazeX.value = withSpring(newX, { damping: 15 });
        gazeY.value = withSpring(newY, { damping: 15 });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const gazeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: gazeX.value - 15 },
      { translateY: gazeY.value - 15 },
    ],
  }));

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Loading camera permissions...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Eye size={64} color="#60a5fa" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to track your eye movements and enable hands-free control.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep(0);
    setIsTracking(false);
    setCalibrationComplete(false);
    setTapFeedback(false);
  };

  const nextCalibrationStep = () => {
    // Show tap feedback
    setTapFeedback(true);
    feedbackOpacity.value = withTiming(1, { duration: 200 }, () => {
      feedbackOpacity.value = withTiming(0, { duration: 300 });
    });

    setTimeout(() => {
      setTapFeedback(false);
      
      if (calibrationStep < calibrationPoints.length - 1) {
        setCalibrationStep(calibrationStep + 1);
      } else {
        // Calibration complete
        setIsCalibrating(false);
        setCalibrationComplete(true);
        Alert.alert(
          'Calibration Complete!',
          'Your eye tracking has been successfully calibrated. You can now start tracking.',
          [
            {
              text: 'Start Tracking',
              onPress: () => setIsTracking(true)
            }
          ]
        );
      }
    }, 500);
  };

  const startTracking = () => {
    if (!calibrationComplete) {
      Alert.alert(
        'Calibration Required',
        'Please complete the calibration process first before starting eye tracking.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsTracking(!isTracking);
  };

  const skipCalibration = () => {
    Alert.alert(
      'Skip Calibration',
      'Are you sure you want to skip calibration? This may affect tracking accuracy.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            setIsCalibrating(false);
            setCalibrationComplete(true);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eye Tracking</Text>
        <Text style={styles.subtitle}>Calibrate and test your eye movement detection</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front" />
        
        {/* Calibration overlay */}
        {isCalibrating && (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={[
                styles.calibrationPointContainer,
                {
                  left: calibrationPoints[calibrationStep].x - 60,
                  top: calibrationPoints[calibrationStep].y - 60,
                }
              ]}
              onPress={nextCalibrationStep}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.calibrationPoint, pulseStyle]}>
                <Target size={48} color="#60a5fa" strokeWidth={3} />
              </Animated.View>
            </TouchableOpacity>

            {/* Tap feedback */}
            {tapFeedback && (
              <Animated.View 
                style={[
                  styles.tapFeedback,
                  feedbackStyle,
                  {
                    left: calibrationPoints[calibrationStep].x - 30,
                    top: calibrationPoints[calibrationStep].y - 30,
                  }
                ]}
              >
                <CheckCircle size={60} color="#16a34a" />
              </Animated.View>
            )}

            <View style={styles.calibrationInfo}>
              <Text style={styles.calibrationText}>
                Look at the target and tap it
              </Text>
              <Text style={styles.calibrationStep}>
                Step {calibrationStep + 1} of {calibrationPoints.length}
              </Text>
              <TouchableOpacity style={styles.skipButton} onPress={skipCalibration}>
                <Text style={styles.skipButtonText}>Skip Calibration</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Gaze cursor */}
        {isTracking && (
          <Animated.View style={[styles.gazeCursor, gazeStyle]}>
            <View style={styles.gazeIndicator} />
            <View style={styles.gazeRing} />
          </Animated.View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.calibrateButton]}
          onPress={startCalibration}
          disabled={isCalibrating}
        >
          <RotateCcw size={24} color="white" />
          <Text style={styles.controlButtonText}>
            {isCalibrating ? 'Calibrating...' : 'Calibrate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton, 
            isTracking ? styles.stopButton : styles.startButton,
            !calibrationComplete && !isTracking && styles.disabledButton
          ]}
          onPress={startTracking}
          disabled={isCalibrating}
        >
          {isTracking ? (
            <CheckCircle size={24} color="white" />
          ) : (
            <Play size={24} color="white" />
          )}
          <Text style={styles.controlButtonText}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusItem, calibrationComplete ? styles.activeStatus : styles.inactiveStatus]}>
          <Eye size={20} color={calibrationComplete ? '#16a34a' : '#dc2626'} />
          <Text style={[styles.statusText, { color: calibrationComplete ? '#16a34a' : '#dc2626' }]}>
            {calibrationComplete ? 'Calibration complete' : 'Calibration required'}
          </Text>
        </View>

        <View style={[styles.statusItem, isTracking ? styles.activeStatus : styles.inactiveStatus]}>
          <Target size={20} color={isTracking ? '#16a34a' : '#dc2626'} />
          <Text style={[styles.statusText, { color: isTracking ? '#16a34a' : '#dc2626' }]}>
            {isTracking ? 'Eye tracking active' : 'Eye tracking inactive'}
          </Text>
        </View>
        
        {isTracking && (
          <Text style={styles.positionText}>
            Gaze Position: ({Math.round(gazePosition.x)}, {Math.round(gazePosition.y)})
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calibrationPointContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calibrationPoint: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
  tapFeedback: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calibrationInfo: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  calibrationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  calibrationStep: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 16,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  skipButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  gazeCursor: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gazeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60a5fa',
    position: 'absolute',
  },
  gazeRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#60a5fa',
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 60,
    flex: 0.45,
    justifyContent: 'center',
  },
  calibrateButton: {
    backgroundColor: '#2563eb',
  },
  startButton: {
    backgroundColor: '#16a34a',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    backgroundColor: '#374151',
    opacity: 0.6,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  activeStatus: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
  inactiveStatus: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  positionText: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: '#f8fafc',
    fontSize: 18,
    textAlign: 'center',
  },
});
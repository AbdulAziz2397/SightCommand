import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Power, Eye, Shield, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function ControlScreen() {
  const [isActive, setIsActive] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const scale = useSharedValue(1);

  // Check calibration status from storage or state management
  useEffect(() => {
    // In a real app, you'd check AsyncStorage or a state management solution
    // For demo purposes, we'll simulate checking calibration status
    const checkCalibrationStatus = () => {
      // This would normally check if calibration was completed
      // For now, we'll assume it needs to be done
      setIsCalibrated(false);
    };

    checkCalibrationStatus();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleActivate = () => {
    if (!isCalibrated) {
      Alert.alert(
        'Calibration Required',
        'Please calibrate your eye tracking first in the Eye Tracking tab.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Go to Calibration', 
            onPress: () => {
              // In a real app, you'd navigate to the tracking tab
              Alert.alert('Navigation', 'Please switch to the Eye Tracking tab to calibrate.');
            }
          }
        ]
      );
      return;
    }

    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });

    setIsActive(!isActive);
    
    // Simulate background service activation
    setTimeout(() => {
      Alert.alert(
        isActive ? 'Deactivated' : 'Activated',
        isActive 
          ? 'Eye control has been deactivated. You can now use your device normally.'
          : 'Eye control is now active. The app will run in the background and track your eye movements.',
        [{ text: 'OK' }]
      );
    }, 300);
  };

  const handleEmergencyStop = () => {
    setIsActive(false);
    Alert.alert(
      'Emergency Stop',
      'Eye control has been immediately deactivated.',
      [{ text: 'OK' }]
    );
  };

  const handleCalibrationUpdate = () => {
    // This would be called when calibration is completed
    setIsCalibrated(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EyeAccess Control</Text>
        <Text style={styles.subtitle}>Independence through eye movement</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusCard, isActive ? styles.activeCard : styles.inactiveCard]}>
          <View style={styles.statusIcon}>
            {isActive ? (
              <CheckCircle size={32} color="#16a34a" />
            ) : (
              <XCircle size={32} color="#dc2626" />
            )}
          </View>
          <Text style={styles.statusText}>
            {isActive ? 'Eye Control Active' : 'Eye Control Inactive'}
          </Text>
          <Text style={styles.statusSubtext}>
            {isActive 
              ? 'Move your eyes to control the cursor' 
              : 'Tap activate to begin eye control'}
          </Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[styles.primaryButton, isActive ? styles.deactivateButton : styles.activateButton]}
            onPress={handleActivate}
          >
            <Power size={36} color="white" />
            <Text style={styles.primaryButtonText}>
              {isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyStop}
        >
          <Shield size={28} color="white" />
          <Text style={styles.emergencyButtonText}>Emergency Stop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calibrationStatus}>
        <Eye size={24} color={isCalibrated ? '#16a34a' : '#dc2626'} />
        <Text style={[styles.calibrationText, { color: isCalibrated ? '#16a34a' : '#dc2626' }]}>
          {isCalibrated ? 'Eye tracking calibrated' : 'Eye tracking not calibrated'}
        </Text>
        {!isCalibrated && (
          <TouchableOpacity 
            style={styles.calibrateLink}
            onPress={() => Alert.alert('Navigation', 'Please switch to the Eye Tracking tab to calibrate.')}
          >
            <Text style={styles.calibrateLinkText}>Calibrate Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>• Look at where you want to click</Text>
        <Text style={styles.infoText}>• Double blink to perform a tap</Text>
        <Text style={styles.infoText}>• Single blink to drag/hold</Text>
        <Text style={styles.infoText}>• Works across all apps</Text>
        
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>Requirements:</Text>
          <View style={styles.requirementItem}>
            <CheckCircle size={16} color={isCalibrated ? '#16a34a' : '#64748b'} />
            <Text style={[styles.requirementText, { color: isCalibrated ? '#16a34a' : '#64748b' }]}>
              Eye tracking calibrated
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <CheckCircle size={16} color="#16a34a" />
            <Text style={[styles.requirementText, { color: '#16a34a' }]}>
              Camera permission granted
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 40,
  },
  statusCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  activeCard: {
    backgroundColor: '#064e3b',
    borderColor: '#16a34a',
  },
  inactiveCard: {
    backgroundColor: '#450a0a',
    borderColor: '#dc2626',
  },
  statusIcon: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginBottom: 16,
    minWidth: 200,
    minHeight: 80,
  },
  activateButton: {
    backgroundColor: '#2563eb',
  },
  deactivateButton: {
    backgroundColor: '#dc2626',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minHeight: 60,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  calibrationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    flexWrap: 'wrap',
  },
  calibrationText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 12,
  },
  calibrateLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  calibrateLinkText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  infoContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
    lineHeight: 20,
  },
  requirementsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});
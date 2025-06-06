import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, Eye, Zap, Shield, CircleHelp as HelpCircle, ChevronRight, RotateCcw, Volume2, Smartphone, Globe } from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  type: 'navigation' | 'toggle' | 'action';
  enabled?: boolean;
}

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  const handleCalibrationReset = () => {
    Alert.alert(
      'Reset Calibration',
      'This will clear your current eye tracking calibration. You\'ll need to recalibrate before using eye control.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Calibration has been reset. Please recalibrate in the Eye Tracking tab.');
          }
        }
      ]
    );
  };

  const handleSensitivitySettings = () => {
    Alert.alert(
      'Sensitivity Settings',
      'Adjust how sensitive the eye tracking responds to your movements.',
      [{ text: 'OK' }]
    );
  };

  const handleAdvancedSettings = () => {
    Alert.alert(
      'Advanced Settings',
      'Advanced configuration options for power users.',
      [{ text: 'OK' }]
    );
  };

  const handleAccessibilitySettings = () => {
    Alert.alert(
      'Accessibility',
      'Configure additional accessibility features and integrations.',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'Access tutorials, documentation, and support resources.',
      [{ text: 'OK' }]
    );
  };

  const handleLanguageSettings = () => {
    Alert.alert(
      'Language Settings',
      'Current language: English\n\nAdditional languages coming soon:\n• Urdu\n• Spanish\n• French',
      [{ text: 'OK' }]
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'calibration',
      title: 'Reset Calibration',
      description: 'Clear current calibration and start fresh',
      icon: <RotateCcw size={24} color="#60a5fa" />,
      action: handleCalibrationReset,
      type: 'action',
    },
    {
      id: 'sensitivity',
      title: 'Eye Tracking Sensitivity',
      description: 'Adjust tracking sensitivity and responsiveness',
      icon: <Eye size={24} color="#60a5fa" />,
      action: handleSensitivitySettings,
      type: 'navigation',
    },
    {
      id: 'advanced',
      title: 'Advanced Settings',
      description: 'Fine-tune tracking parameters and algorithms',
      icon: <Zap size={24} color="#60a5fa" />,
      action: handleAdvancedSettings,
      type: 'navigation',
    },
    {
      id: 'accessibility',
      title: 'Accessibility Features',
      description: 'Additional accessibility options and integrations',
      icon: <Shield size={24} color="#60a5fa" />,
      action: handleAccessibilitySettings,
      type: 'navigation',
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Change app language and regional settings',
      icon: <Globe size={24} color="#60a5fa" />,
      action: handleLanguageSettings,
      type: 'navigation',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Tutorials, documentation, and support',
      icon: <HelpCircle size={24} color="#60a5fa" />,
      action: handleHelp,
      type: 'navigation',
    },
  ];

  const toggles = [
    {
      id: 'sound',
      title: 'Sound Feedback',
      description: 'Play sounds for eye tracking events',
      icon: <Volume2 size={24} color="#60a5fa" />,
      enabled: soundEnabled,
      onToggle: setSoundEnabled,
    },
    {
      id: 'haptic',
      title: 'Haptic Feedback',
      description: 'Vibration feedback for interactions',
      icon: <Smartphone size={24} color="#60a5fa" />,
      enabled: hapticEnabled,
      onToggle: setHapticEnabled,
    },
    {
      id: 'adaptive',
      title: 'Adaptive Mode',
      description: 'Automatically adjust settings based on usage',
      icon: <Zap size={24} color="#60a5fa" />,
      enabled: adaptiveMode,
      onToggle: setAdaptiveMode,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your eye control experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Toggle Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {toggles.map((toggle) => (
            <TouchableOpacity
              key={toggle.id}
              style={styles.settingItem}
              onPress={() => toggle.onToggle(!toggle.enabled)}
            >
              <View style={styles.settingIcon}>
                {toggle.icon}
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{toggle.title}</Text>
                <Text style={styles.settingDescription}>{toggle.description}</Text>
              </View>
              <View style={[styles.toggle, toggle.enabled ? styles.toggleEnabled : styles.toggleDisabled]}>
                <View style={[styles.toggleButton, toggle.enabled && styles.toggleButtonEnabled]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          {settings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              style={styles.settingItem}
              onPress={setting.action}
            >
              <View style={styles.settingIcon}>
                {setting.icon}
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              {setting.type === 'navigation' && (
                <ChevronRight size={20} color="#64748b" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.appName}>EyeAccess</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Empowering independence through eye movement technology.
              Designed specifically for people with limited mobility.
            </Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Shield size={20} color="#16a34a" />
          <Text style={styles.privacyText}>
            Your privacy is protected. All eye tracking data is processed locally on your device and never shared.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 18,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleEnabled: {
    backgroundColor: '#2563eb',
  },
  toggleDisabled: {
    backgroundColor: '#374151',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleButtonEnabled: {
    alignSelf: 'flex-end',
  },
  infoContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#16a34a',
    lineHeight: 20,
    marginLeft: 12,
  },
});
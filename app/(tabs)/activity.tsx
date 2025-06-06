import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, MousePointer, Clock, ChartBar as BarChart3, Trash2 } from 'lucide-react-native';

interface ActivityLog {
  id: string;
  type: 'gaze' | 'blink' | 'click' | 'calibration';
  timestamp: Date;
  description: string;
  details?: string;
}

export default function ActivityScreen() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalGazeTime: 0,
    totalClicks: 0,
    avgAccuracy: 95.2,
  });

  useEffect(() => {
    // Simulate activity logs
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        type: 'calibration',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        description: 'Eye tracking calibrated',
        details: '5-point calibration completed',
      },
      {
        id: '2',
        type: 'gaze',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        description: 'Eye tracking session started',
        details: 'Duration: 15 minutes',
      },
      {
        id: '3',
        type: 'click',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        description: 'Double blink detected',
        details: 'Action: Tap on home button',
      },
      {
        id: '4',
        type: 'click',
        timestamp: new Date(Date.now() - 1000 * 60 * 18),
        description: 'Double blink detected',
        details: 'Action: Open messages app',
      },
      {
        id: '5',
        type: 'gaze',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        description: 'Eye tracking session ended',
        details: 'Total interactions: 23',
      },
      {
        id: '6',
        type: 'calibration',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        description: 'Recalibration performed',
        details: 'Accuracy improved to 97.8%',
      },
    ];

    setActivityLogs(mockLogs);
    setStats({
      totalSessions: 12,
      totalGazeTime: 145,
      totalClicks: 234,
      avgAccuracy: 95.2,
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'gaze':
        return <Eye size={20} color="#60a5fa" />;
      case 'blink':
        return <Eye size={20} color="#34d399" />;
      case 'click':
        return <MousePointer size={20} color="#f59e0b" />;
      case 'calibration':
        return <BarChart3 size={20} color="#a78bfa" />;
      default:
        return <Clock size={20} color="#94a3b8" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Monitor</Text>
        <Text style={styles.subtitle}>Track your eye control usage and performance</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalGazeTime}m</Text>
            <Text style={styles.statLabel}>Gaze Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalClicks}</Text>
            <Text style={styles.statLabel}>Total Clicks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgAccuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
      </View>

      <View style={styles.logsHeader}>
        <Text style={styles.logsTitle}>Recent Activity</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearActivityLogs}>
          <Trash2 size={18} color="#dc2626" />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logsContainer} showsVerticalScrollIndicator={false}>
        {activityLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color="#64748b" />
            <Text style={styles.emptyStateText}>No activity logs yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start using eye tracking to see your activity history
            </Text>
          </View>
        ) : (
          activityLogs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logIcon}>
                {getActivityIcon(log.type)}
              </View>
              <View style={styles.logContent}>
                <Text style={styles.logDescription}>{log.description}</Text>
                {log.details && (
                  <Text style={styles.logDetails}>{log.details}</Text>
                )}
                <View style={styles.logTimeContainer}>
                  <Text style={styles.logTime}>
                    {formatDate(log.timestamp)} at {formatTime(log.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  logsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  logIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  logContent: {
    flex: 1,
  },
  logDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  logTimeContainer: {
    marginTop: 4,
  },
  logTime: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
});
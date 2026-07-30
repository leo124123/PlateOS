import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TableItem } from '../types';

interface CustomerHeaderProps {
  table: TableItem;
  onDisconnect: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ table, onDisconnect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🍽️</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>
            Plate<Text style={styles.brandAccent}>OS</Text>
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Mesa #{table.number} • En Vivo</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <View style={styles.tableBadge}>
          <Text style={styles.tableBadgeText}>Mesa #{table.number}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onDisconnect}>
          <Text style={styles.logoutEmoji}>🚪</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  brandAccent: {
    color: '#f59e0b',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tableBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#f59e0b',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#1e293b',
  },
  logoutEmoji: {
    fontSize: 14,
  },
});

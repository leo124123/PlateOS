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
          <Text style={styles.logoEmoji}>👑</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>
            Plate<Text style={styles.brandAccent}>OS</Text> <Text style={styles.brandSubTag}>GOURMET</Text>
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
        <TouchableOpacity style={styles.logoutButton} onPress={onDisconnect} activeOpacity={0.8}>
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
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(245, 158, 11, 0.25)',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  brandAccent: {
    color: '#f59e0b',
  },
  brandSubTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#f59e0b',
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
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
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tableBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f59e0b',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutEmoji: {
    fontSize: 14,
  },
});

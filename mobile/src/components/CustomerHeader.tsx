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
      {/* Left Menu Button */}
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Center Brand Title */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>PLATEOS</Text>
        <Text style={styles.brandSub}>GOURMET</Text>
      </View>

      {/* Right Table Badge & Disconnect */}
      <View style={styles.rightGroup}>
        <View style={styles.tableBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.tableBadgeText}>Mesa #{table.number}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={onDisconnect} activeOpacity={0.7}>
          <Text style={styles.logoutIcon}>🚪</Text>
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
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#090a0f',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuIcon: {
    color: '#d4af37',
    fontSize: 20,
    fontWeight: '300',
  },
  logoutIcon: {
    fontSize: 16,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#d4af37',
    letterSpacing: 4,
    fontFamily: 'serif',
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#c59b27',
    letterSpacing: 3,
    marginTop: -2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  tableBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#d4af37',
    letterSpacing: 0.5,
  },
});

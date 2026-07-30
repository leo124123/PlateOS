import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TableItem } from '../types';

interface CustomerHeaderProps {
  table: TableItem;
  onDisconnect: () => void;
  onOpenDrawer?: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  table,
  onDisconnect,
  onOpenDrawer,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Menu Hamburger Button */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onOpenDrawer}
        activeOpacity={0.7}
      >
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

        <TouchableOpacity
          style={styles.disconnectBtn}
          onPress={onDisconnect}
          activeOpacity={0.7}
        >
          <Text style={styles.disconnectText}>SALIR</Text>
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  menuIcon: {
    color: '#d4af37',
    fontSize: 22,
    fontWeight: '300',
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
  disconnectBtn: {
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectText: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

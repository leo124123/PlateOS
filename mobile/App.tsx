import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useClientStore } from './src/store/useClientStore';
import { TablePinModal } from './src/components/TablePinModal';
import { QRCameraScanner } from './src/components/QRCameraScanner';
import { CustomerHeader } from './src/components/CustomerHeader';
import { CallWaiterButton } from './src/components/CallWaiterButton';
import { DigitalMenu } from './src/components/DigitalMenu';
import { OrderTracker } from './src/components/OrderTracker';

export default function App() {
  const {
    connectedTable,
    connectTable,
    disconnectTable,
    isConnecting,
    cart,
  } = useClientStore();

  const [activeTab, setActiveTab] = useState<'menu' | 'order'>('menu');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleConnect = async (tableCode: string) => {
    await connectTable(tableCode);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {!connectedTable ? (
        <View style={styles.flexOne}>
          <TablePinModal
            onConnect={handleConnect}
            onOpenScanner={() => setIsScannerOpen(true)}
            isConnecting={isConnecting}
          />
          <QRCameraScanner
            visible={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanSuccess={handleConnect}
          />
        </View>
      ) : (
        <View style={styles.flexOne}>
          <CustomerHeader table={connectedTable} onDisconnect={disconnectTable} />
          <CallWaiterButton />
          <View style={styles.contentArea}>
            {activeTab === 'menu' ? <DigitalMenu /> : <OrderTracker />}
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={[styles.navBtn, activeTab === 'menu' && styles.navBtnActive]}
              onPress={() => setActiveTab('menu')}
            >
              <Text style={styles.navIcon}>🍽️</Text>
              <Text
                style={[
                  styles.navBtnText,
                  activeTab === 'menu' && styles.navBtnTextActive,
                ]}
              >
                Menú Digital
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, activeTab === 'order' && styles.navBtnActive]}
              onPress={() => setActiveTab('order')}
            >
              <View style={styles.iconBadgeWrapper}>
                <Text style={styles.navIcon}>🛒</Text>
                {cartTotalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartTotalItems}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navBtnText,
                  activeTab === 'order' && styles.navBtnTextActive,
                ]}
              >
                Mi Pedido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  flexOne: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  navBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  navBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  navIcon: {
    fontSize: 20,
  },
  navBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 4,
  },
  navBtnTextActive: {
    color: '#f59e0b',
  },
  iconBadgeWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: '900',
  },
});

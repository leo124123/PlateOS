import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
  } = useClientStore();

  const [activeTab, setActiveTab] = useState<'inicio' | 'menu' | 'reservas' | 'experiencias' | 'mesa'>('inicio');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleConnect = async (tableCode: string) => {
    await connectTable(tableCode);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#090a0f" />

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
              {activeTab === 'mesa' ? <OrderTracker /> : <DigitalMenu />}
            </View>

            {/* Luxury Bottom Navigation Bar (Matches AURUM Mockup) */}
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => setActiveTab('inicio')}
                activeOpacity={0.8}
              >
                <Text style={[styles.navIcon, activeTab === 'inicio' && styles.navIconActive]}>🏠</Text>
                <Text style={[styles.navBtnText, activeTab === 'inicio' && styles.navBtnTextActive]}>
                  INICIO
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => setActiveTab('menu')}
                activeOpacity={0.8}
              >
                <Text style={[styles.navIcon, activeTab === 'menu' && styles.navIconActive]}>📖</Text>
                <Text style={[styles.navBtnText, activeTab === 'menu' && styles.navBtnTextActive]}>
                  MENÚ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => setActiveTab('reservas')}
                activeOpacity={0.8}
              >
                <Text style={[styles.navIcon, activeTab === 'reservas' && styles.navIconActive]}>📅</Text>
                <Text style={[styles.navBtnText, activeTab === 'reservas' && styles.navBtnTextActive]}>
                  RESERVAS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => setActiveTab('experiencias')}
                activeOpacity={0.8}
              >
                <Text style={[styles.navIcon, activeTab === 'experiencias' && styles.navIconActive]}>✨</Text>
                <Text style={[styles.navBtnText, activeTab === 'experiencias' && styles.navBtnTextActive]}>
                  EXPERIENCIAS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => setActiveTab('mesa')}
                activeOpacity={0.8}
              >
                <Text style={[styles.navIcon, activeTab === 'mesa' && styles.navIconActive]}>👤</Text>
                <Text style={[styles.navBtnText, activeTab === 'mesa' && styles.navBtnTextActive]}>
                  MI MESA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090a0f',
  },
  flexOne: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0d0e15',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBtn: {
    alignItems: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7e8494',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  navBtnTextActive: {
    color: '#d4af37',
    fontWeight: '900',
  },
});

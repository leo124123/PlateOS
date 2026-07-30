import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal,
  ScrollView,
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
    callWaiter,
    requestBill,
  } = useClientStore();

  const [activeTab, setActiveTab] = useState<'inicio' | 'menu' | 'reservas' | 'experiencias' | 'mesa'>('inicio');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            <CustomerHeader
              table={connectedTable}
              onDisconnect={disconnectTable}
              onOpenDrawer={() => setIsDrawerOpen(true)}
            />
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

            {/* ── FUNCTIONAL LUXURY DRAWER SIDE MENU ── */}
            <Modal
              visible={isDrawerOpen}
              animationType="slide"
              transparent
              onRequestClose={() => setIsDrawerOpen(false)}
            >
              <View style={styles.drawerOverlay}>
                <TouchableOpacity
                  style={styles.drawerBackdrop}
                  onPress={() => setIsDrawerOpen(false)}
                  activeOpacity={1}
                />
                <View style={styles.drawerContent}>
                  <View style={styles.drawerHeader}>
                    <Text style={styles.drawerBrandTitle}>PLATEOS GOURMET</Text>
                    <TouchableOpacity
                      style={styles.drawerCloseBtn}
                      onPress={() => setIsDrawerOpen(false)}
                    >
                      <Text style={styles.drawerCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawerTableBanner}>
                    <Text style={styles.drawerTableTitle}>Mesa #{connectedTable.number}</Text>
                    <Text style={styles.drawerTableSub}>Conectado en tiempo real</Text>
                  </View>

                  <ScrollView style={styles.drawerMenuScroll}>
                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('inicio');
                      }}
                    >
                      <Text style={styles.drawerMenuIcon}>🏠</Text>
                      <Text style={styles.drawerMenuText}>Inicio / Destacados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        callWaiter();
                      }}
                    >
                      <Text style={styles.drawerMenuIcon}>🛎️</Text>
                      <Text style={styles.drawerMenuText}>Llamar al Mesero</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('menu');
                      }}
                    >
                      <Text style={styles.drawerMenuIcon}>📖</Text>
                      <Text style={styles.drawerMenuText}>Carta Digital Gourmet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('experiencias');
                      }}
                    >
                      <Text style={styles.drawerMenuIcon}>🍷</Text>
                      <Text style={styles.drawerMenuText}>Menú Degustación & Maridaje</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        requestBill();
                      }}
                    >
                      <Text style={styles.drawerMenuIcon}>💳</Text>
                      <Text style={styles.drawerMenuText}>Solicitar la Cuenta</Text>
                    </TouchableOpacity>

                    <View style={styles.drawerDivider} />

                    <TouchableOpacity
                      style={styles.drawerDisconnectBtn}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        disconnectTable();
                      }}
                    >
                      <Text style={styles.drawerDisconnectText}>SALIR DE LA MESA</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </Modal>
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

  /* DRAWER MODAL STYLES */
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerContent: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#090a0f',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(212, 175, 55, 0.25)',
    padding: 24,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerBrandTitle: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'serif',
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#12141d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  drawerCloseText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  drawerTableBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 14,
    marginBottom: 20,
  },
  drawerTableTitle: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: '900',
  },
  drawerTableSub: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  drawerMenuScroll: {
    flex: 1,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#12141d',
  },
  drawerMenuIcon: {
    fontSize: 18,
  },
  drawerMenuText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    marginVertical: 20,
  },
  drawerDisconnectBtn: {
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  drawerDisconnectText: {
    color: '#f43f5e',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

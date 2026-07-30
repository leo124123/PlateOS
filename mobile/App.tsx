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
import { ExperiencesScreen } from './src/components/ExperiencesScreen';
import { VIPReservationsScreen } from './src/components/VIPReservationsScreen';
import { WaiterReviewScreen } from './src/components/WaiterReviewScreen';
import { PremiumIcon, IconName } from './src/components/common/PremiumIcon';

export default function App() {
  const {
    connectedTable,
    connectTable,
    disconnectTable,
    isConnecting,
    callWaiter,
    requestBill,
  } = useClientStore();

  const [activeTab, setActiveTab] = useState<
    'inicio' | 'menu' | 'experiencias' | 'reservas' | 'reseñas' | 'mesa'
  >('inicio');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleConnect = async (tableCode: string) => {
    await connectTable(tableCode);
  };

  const NAV_ITEMS: Array<{
    id: 'inicio' | 'menu' | 'experiencias' | 'reservas' | 'reseñas' | 'mesa';
    label: string;
    icon: IconName;
  }> = [
    { id: 'inicio', label: 'INICIO', icon: 'home' },
    { id: 'menu', label: 'MENÚ', icon: 'menu' },
    { id: 'experiencias', label: 'EXPERIENCIAS', icon: 'sparkles' },
    { id: 'reservas', label: 'RESERVAS', icon: 'calendar' },
    { id: 'reseñas', label: 'RESEÑAS', icon: 'award' },
    { id: 'mesa', label: 'MI MESA', icon: 'user' },
  ];

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
              {activeTab === 'mesa' ? (
                <OrderTracker />
              ) : activeTab === 'experiencias' ? (
                <ExperiencesScreen />
              ) : activeTab === 'reservas' ? (
                <VIPReservationsScreen />
              ) : activeTab === 'reseñas' ? (
                <WaiterReviewScreen />
              ) : (
                <DigitalMenu activeTab={activeTab} />
              )}
            </View>

            {/* ── LUXURY FLOATING SLIDE BAR (NAVIGATION BAR) ── */}
            <View style={styles.bottomNavContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bottomNavScroll}
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.navBtn, isActive && styles.navBtnActive]}
                      onPress={() => setActiveTab(item.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                        <PremiumIcon
                          name={item.icon}
                          size={18}
                          color={isActive ? '#090a0f' : '#94a3b8'}
                          strokeWidth={isActive ? 2.5 : 1.8}
                        />
                      </View>
                      <Text style={[styles.navBtnText, isActive && styles.navBtnTextActive]}>
                        {item.label}
                      </Text>
                      {isActive && <View style={styles.activeGlowDot} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
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
                    <View style={styles.drawerBrandBox}>
                      <PremiumIcon name="sparkles" size={16} color="#d4af37" />
                      <Text style={styles.drawerBrandTitle}>PLATEOS GOURMET</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.drawerCloseBtn}
                      onPress={() => setIsDrawerOpen(false)}
                    >
                      <PremiumIcon name="x" size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawerTableBanner}>
                    <View style={styles.tableBannerHeader}>
                      <PremiumIcon name="user" size={16} color="#d4af37" />
                      <Text style={styles.drawerTableTitle}>Mesa #{connectedTable.number}</Text>
                    </View>
                    <Text style={styles.drawerTableSub}>Conectado en tiempo real</Text>
                  </View>

                  <ScrollView style={styles.drawerMenuScroll} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('inicio');
                      }}
                    >
                      <PremiumIcon name="home" size={18} color="#d4af37" />
                      <Text style={styles.drawerMenuText}>Inicio / Destacados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('menu');
                      }}
                    >
                      <PremiumIcon name="menu" size={18} color="#d4af37" />
                      <Text style={styles.drawerMenuText}>Carta Digital Gourmet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('experiencias');
                      }}
                    >
                      <PremiumIcon name="sparkles" size={18} color="#d4af37" />
                      <Text style={styles.drawerMenuText}>Degustación & Maridaje</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('reservas');
                      }}
                    >
                      <PremiumIcon name="calendar" size={18} color="#d4af37" />
                      <Text style={styles.drawerMenuText}>Reservas VIP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        setActiveTab('reseñas');
                      }}
                    >
                      <PremiumIcon name="award" size={18} color="#d4af37" />
                      <Text style={styles.drawerMenuText}>Reseñas & Valoración Mesero</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        callWaiter();
                      }}
                    >
                      <PremiumIcon name="bell" size={18} color="#f59e0b" />
                      <Text style={styles.drawerMenuText}>Llamar al Mesero</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.drawerMenuItem}
                      onPress={() => {
                        setIsDrawerOpen(false);
                        requestBill();
                      }}
                    >
                      <PremiumIcon name="credit-card" size={18} color="#10b981" />
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
                      <PremiumIcon name="x" size={14} color="#f43f5e" />
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

  /* SLIDE BAR / BOTTOM NAVIGATION STYLES */
  bottomNavContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 17, 26, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 6,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomNavScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    minWidth: '100%',
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    minWidth: 64,
    position: 'relative',
  },
  navBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#d4af37',
  },
  navBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  navBtnTextActive: {
    color: '#d4af37',
    fontWeight: '900',
  },
  activeGlowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4af37',
    marginTop: 2,
  },

  /* DRAWER MODAL STYLES */
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerContent: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: '#0f111a',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(212, 175, 55, 0.3)',
    padding: 22,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerBrandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerBrandTitle: {
    color: '#d4af37',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a1d2b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  drawerTableBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 14,
    marginBottom: 20,
  },
  tableBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerTableTitle: {
    color: '#d4af37',
    fontSize: 15,
    fontWeight: '900',
  },
  drawerTableSub: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
  drawerMenuScroll: {
    flex: 1,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d2b',
  },
  drawerMenuText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    marginVertical: 18,
  },
  drawerDisconnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
    paddingVertical: 12,
  },
  drawerDisconnectText: {
    color: '#f43f5e',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

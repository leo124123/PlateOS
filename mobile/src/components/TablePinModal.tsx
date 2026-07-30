import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { PremiumIcon } from './common/PremiumIcon';

interface TablePinModalProps {
  onConnect: (pin: string) => void;
  onOpenScanner: () => void;
  isConnecting: boolean;
}

const { width } = Dimensions.get('window');
const isTabletOrLandscape = width > 700;

const LUXURY_BG =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80';

const USER_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

const FAKE_QR =
  'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PlateOS-Table-1&color=d4af37&bgcolor=090a0f';

export const TablePinModal: React.FC<TablePinModalProps> = ({
  onConnect,
  onOpenScanner,
  isConnecting,
}) => {
  const [pinCode, setPinCode] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${hours}:${minutesStr} ${ampm}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      const formattedDate = now.toLocaleDateString('es-ES', options);
      setCurrentDate(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (val: string) => {
    if (pinCode.length < 4) {
      const nextPin = pinCode + val;
      setPinCode(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => onConnect(nextPin), 300);
      }
    }
  };

  const handleDelete = () => {
    setPinCode((prev) => prev.slice(0, -1));
  };

  const handleQuickConnectTable = (tableNum: number) => {
    setPinCode(tableNum.toString());
    onConnect(tableNum.toString());
  };

  return (
    <ImageBackground source={{ uri: LUXURY_BG }} style={styles.backgroundImage}>
      <View style={styles.darkOverlay}>
        {/* Top Status Header */}
        <View style={styles.topStatusHeader}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{currentTime || '8:42 PM'}</Text>
            <Text style={styles.dateText}>{currentDate || 'Jueves, 30 Julio'}</Text>
          </View>

          <View style={styles.serverStatusBadge}>
            <View style={styles.greenPulseDot} />
            <View>
              <Text style={styles.serverStatusTitle}>Sistema conectado</Text>
              <Text style={styles.serverStatusSub}>Servidor Online</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Central Logo Header */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircleGlow}>
              <View style={styles.logoIconInner}>
                <PremiumIcon name="crown" size={24} color="#d4af37" />
                <View style={{ marginTop: 2 }}>
                  <PremiumIcon name="utensils" size={16} color="#d4af37" />
                </View>
              </View>
            </View>

            <Text style={styles.brandTitle}>SABORÉ</Text>
            <Text style={styles.brandSubtitle}>R E S T A U R A N T</Text>
            <Text style={styles.brandTagline}>RESTAURANT MANAGEMENT SYSTEM</Text>
          </View>

          {/* Dual Luxury Cards Layout */}
          <View style={[styles.dualCardsRow, isTabletOrLandscape && styles.dualCardsRowTablet]}>
            {/* ── CARD 1: PIN ENTRY (LEFT) ── */}
            <View style={styles.luxuryCard}>
              <Text style={styles.cardGreeting}>Bienvenido de nuevo</Text>

              {/* User Profile Info Badge */}
              <View style={styles.userProfileBanner}>
                <Image source={{ uri: USER_AVATAR }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Mario Rosario</Text>
                  <View style={styles.userRoleRow}>
                    <Text style={styles.userRoleText}>Administrador</Text>
                    <PremiumIcon name="check-circle" size={12} color="#d4af37" />
                  </View>
                </View>
              </View>

              <Text style={styles.pinInstructionLabel}>Ingresa tu PIN</Text>

              {/* PIN Indicator Dots */}
              <View style={styles.pinDotsRow}>
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinCode.length > idx;
                  return (
                    <View
                      key={idx}
                      style={[styles.pinDotCircle, isFilled && styles.pinDotCircleActive]}
                    />
                  );
                })}
              </View>

              {/* Tactile Keypad */}
              <View style={styles.keypadGrid}>
                {[
                  { num: '1', letters: '' },
                  { num: '2', letters: 'ABC' },
                  { num: '3', letters: 'DEF' },
                  { num: '4', letters: 'GHI' },
                  { num: '5', letters: 'JKL' },
                  { num: '6', letters: 'MNO' },
                  { num: '7', letters: 'PQRS' },
                  { num: '8', letters: 'TUV' },
                  { num: '9', letters: 'WXYZ' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.num}
                    style={styles.keypadBtn}
                    onPress={() => handleKeyPress(item.num)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keypadNumText}>{item.num}</Text>
                    {item.letters ? (
                      <Text style={styles.keypadSubText}>{item.letters}</Text>
                    ) : null}
                  </TouchableOpacity>
                ))}

                {/* Fingerprint key */}
                <TouchableOpacity
                  style={styles.keypadBtn}
                  onPress={() => onConnect('1')}
                  activeOpacity={0.7}
                >
                  <PremiumIcon name="fingerprint" size={22} color="#d4af37" />
                </TouchableOpacity>

                {/* 0 Key */}
                <TouchableOpacity
                  style={styles.keypadBtn}
                  onPress={() => handleKeyPress('0')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keypadNumText}>0</Text>
                </TouchableOpacity>

                {/* Delete key */}
                <TouchableOpacity
                  style={styles.keypadBtn}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                >
                  <PremiumIcon name="delete" size={20} color="#d4af37" />
                </TouchableOpacity>
              </View>

              {/* Divider 'ó' */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerOrText}>ó</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Face ID Button */}
              <TouchableOpacity
                style={styles.faceIdButton}
                onPress={() => onConnect('1')}
                activeOpacity={0.85}
              >
                <View style={styles.faceIdIconCircle}>
                  <PremiumIcon name="face-id" size={22} color="#d4af37" />
                </View>
                <View style={styles.faceIdTextContent}>
                  <Text style={styles.faceIdTitle}>Ingresar con Face ID</Text>
                  <Text style={styles.faceIdSub}>Accede de forma rápida y segura</Text>
                </View>
              </TouchableOpacity>

              {/* Fingerprint Alternative Button */}
              <TouchableOpacity
                style={styles.fingerprintAltBtn}
                onPress={() => onConnect('1')}
                activeOpacity={0.85}
              >
                <PremiumIcon name="fingerprint" size={18} color="#d4af37" />
                <Text style={styles.fingerprintAltText}>Ingresar con Huella Digital</Text>
              </TouchableOpacity>
            </View>

            {/* ── CARD 2: QR SCANNER (RIGHT) ── */}
            <View style={styles.luxuryCard}>
              <View style={styles.qrHeaderIconCircle}>
                <PremiumIcon name="qr" size={24} color="#d4af37" />
              </View>

              <Text style={styles.qrCardTitle}>Escanear QR</Text>
              <Text style={styles.qrCardSub}>
                Escanea el código QR de la mesa para acceder rápidamente al menú
              </Text>

              {/* 3D QR Code Frame Container */}
              <View style={styles.qrFrameContainer}>
                {/* Corner Bracket Graphics */}
                <View style={[styles.cornerBracket, styles.cornerTopLeft]} />
                <View style={[styles.cornerBracket, styles.cornerTopRight]} />
                <View style={[styles.cornerBracket, styles.cornerBottomLeft]} />
                <View style={[styles.cornerBracket, styles.cornerBottomRight]} />

                <Image source={{ uri: FAKE_QR }} style={styles.qrImageGraphic} />
              </View>

              {/* Open Camera Button */}
              <TouchableOpacity
                style={styles.openCameraButton}
                onPress={onOpenScanner}
                activeOpacity={0.85}
              >
                <View style={styles.cameraIconRow}>
                  <PremiumIcon name="camera" size={18} color="#d4af37" />
                  <Text style={styles.openCameraText}>Abrir cámara</Text>
                </View>
                <PremiumIcon name="arrow-right" size={16} color="#d4af37" />
              </TouchableOpacity>

              {/* Quick Select Table Shortcut */}
              <Text style={styles.quickTableTitle}>Mesas de Demostración:</Text>
              <View style={styles.quickTablesGrid}>
                {[1, 2, 3, 4, 5, 11].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={styles.quickTableChip}
                    onPress={() => handleQuickConnectTable(n)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickTableChipText}>Mesa #{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom System Operational Bar */}
          <View style={styles.bottomOperationalBar}>
            <View style={styles.cloudIconBox}>
              <PremiumIcon name="cloud" size={16} color="#d4af37" />
            </View>
            <View style={styles.operationalTextContent}>
              <Text style={styles.operationalTitle}>Sistema conectado</Text>
              <Text style={styles.operationalSub}>Todos los servicios operativos</Text>
            </View>
            <View style={styles.greenOperationalDot} />
          </View>

          {/* Footer Footnote */}
          <View style={styles.footerBox}>
            <Text style={styles.versionText}>Versión 1.0.0</Text>
            <Text style={styles.poweredText}>Powered by Nomia</Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 6, 10, 0.93)',
  },
  topStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 10,
  },
  timeBox: {
    flexDirection: 'column',
  },
  timeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  dateText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  serverStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 17, 26, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  greenPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10b981',
  },
  serverStatusTitle: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  serverStatusSub: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },

  /* Central Logo Header */
  logoContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  logoCircleGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1.5,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoIconInner: {
    alignItems: 'center',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  brandSubtitle: {
    color: '#d4af37',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 6,
    marginTop: 2,
  },
  brandTagline: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 6,
  },

  /* Dual Cards Layout */
  dualCardsRow: {
    width: '100%',
    maxWidth: 820,
    gap: 16,
  },
  dualCardsRowTablet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  luxuryCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 17, 26, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGreeting: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },
  userProfileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#d4af37',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  userRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userRoleText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  pinInstructionLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },

  /* PIN Dots */
  pinDotsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  pinDotCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    backgroundColor: 'transparent',
  },
  pinDotCircleActive: {
    backgroundColor: '#d4af37',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },

  /* Keypad */
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 270,
  },
  keypadBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadNumText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  keypadSubText: {
    color: '#64748b',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerOrText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Face ID Button */
  faceIdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d4af37',
    padding: 12,
    width: '100%',
    gap: 12,
    marginBottom: 10,
  },
  faceIdIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceIdTextContent: {
    flex: 1,
  },
  faceIdTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  faceIdSub: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  fingerprintAltBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  fingerprintAltText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Card 2 QR */
  qrHeaderIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  qrCardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  qrCardSub: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  /* QR Frame */
  qrFrameContainer: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  cornerBracket: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#d4af37',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  qrImageGraphic: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },

  /* Open Camera Button */
  openCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d4af37',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    marginTop: 24,
  },
  cameraIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  openCameraText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  quickTableTitle: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  quickTablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
  },
  quickTableChip: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickTableChipText: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: '800',
  },

  /* Bottom Operational Bar */
  bottomOperationalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 17, 26, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 24,
    width: '100%',
    maxWidth: 380,
  },
  cloudIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  operationalTextContent: {
    flex: 1,
  },
  operationalTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  operationalSub: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  greenOperationalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  footerBox: {
    alignItems: 'center',
    marginTop: 14,
  },
  versionText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  poweredText: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
});

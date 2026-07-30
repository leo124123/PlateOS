import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { PremiumIcon } from './common/PremiumIcon';

interface TablePinModalProps {
  onConnect: (pin: string) => void;
  onOpenScanner: () => void;
  isConnecting: boolean;
}

const { width, height } = Dimensions.get('window');

const DARK_MARBLE_BG =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80';

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
    <ImageBackground source={{ uri: DARK_MARBLE_BG }} style={styles.backgroundImage}>
      <View style={styles.darkOverlay}>
        {/* Top Status Bar */}
        <View style={styles.topStatusBar}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{currentTime || '8:42 PM'}</Text>
            <Text style={styles.dateText}>{currentDate || 'Jueves, 30 Julio'}</Text>
          </View>

          <View style={styles.onlineBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.onlineText}>PlateOS Online</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Centered Luxury Card */}
          <View style={styles.mainLuxuryCard}>
            {/* 1. Logo Header */}
            <View style={styles.logoWrapper}>
              <View style={styles.crownCircleBadge}>
                <PremiumIcon name="crown" size={26} color="#d4af37" />
                <View style={{ marginTop: 1 }}>
                  <PremiumIcon name="utensils" size={16} color="#d4af37" />
                </View>
              </View>
              <Text style={styles.brandNameTitle}>
                PLATE<Text style={styles.brandGoldAccent}>OS</Text>
              </Text>
              <Text style={styles.brandSubTitle}>G O U R M E T</Text>
            </View>

            {/* 2. Welcome Title & Decorative Line */}
            <View style={styles.welcomeBox}>
              <Text style={styles.welcomeTitle}>Bienvenido</Text>
              <Text style={styles.welcomeSub}>Inicia sesión para continuar</Text>
              <View style={styles.decoLineRow}>
                <View style={styles.decoLine} />
                <View style={styles.decoDiamond} />
                <View style={styles.decoLine} />
              </View>
            </View>

            {/* 3. Keypad Inner Container */}
            <View style={styles.keypadInnerCard}>
              <Text style={styles.pinLabelText}>INGRESA TU PIN</Text>

              {/* PIN Dot Indicators */}
              <View style={styles.pinDotsRow}>
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinCode.length > idx;
                  return (
                    <View
                      key={idx}
                      style={[styles.dotCircle, isFilled && styles.dotCircleActive]}
                    />
                  );
                })}
              </View>

              {/* Numeric Keypad Grid */}
              <View style={styles.keypadGrid}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.keypadBtn}
                    onPress={() => handleKeyPress(num)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keypadNum}>{num}</Text>
                  </TouchableOpacity>
                ))}

                {/* Fingerprint / Biometric key */}
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
                  <Text style={styles.keypadNum}>0</Text>
                </TouchableOpacity>

                {/* Delete / Backspace key */}
                <TouchableOpacity
                  style={styles.keypadBtn}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                >
                  <PremiumIcon name="delete" size={20} color="#d4af37" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 4. Elegant Line Divider with Center Circle */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerCircle} />
              <View style={styles.dividerLine} />
            </View>

            {/* 5. Escanear Código QR Button */}
            <TouchableOpacity
              style={styles.qrScanCardBtn}
              onPress={onOpenScanner}
              activeOpacity={0.85}
            >
              <View style={styles.qrIconFrameBox}>
                <PremiumIcon name="qr" size={22} color="#d4af37" />
              </View>

              <View style={styles.qrTextContent}>
                <Text style={styles.qrBtnTitle}>ESCANEAR CÓDIGO QR</Text>
                <Text style={styles.qrBtnSub}>Accede al menú de la mesa</Text>
              </View>

              <PremiumIcon name="arrow-right" size={16} color="#d4af37" />
            </TouchableOpacity>

            {/* Quick Mesa Selector (Demo mode) */}
            <View style={styles.quickMesaContainer}>
              <Text style={styles.quickMesaLabel}>SELECCIÓN RÁPIDA (MODO PRUEBA):</Text>
              <View style={styles.quickMesaGrid}>
                {[1, 2, 3, 4, 5, 11].map((tableNum) => (
                  <TouchableOpacity
                    key={tableNum}
                    style={styles.quickMesaChip}
                    onPress={() => handleQuickConnectTable(tableNum)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickMesaChipText}>Mesa #{tableNum}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
    backgroundColor: 'rgba(5, 6, 10, 0.94)',
  },
  topStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 44,
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
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 17, 26, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  onlineText: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  /* Main Luxury Card Container */
  mainLuxuryCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 17, 26, 0.88)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  /* Logo Header */
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  crownCircleBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1.5,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  brandNameTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 5,
    textAlign: 'center',
  },
  brandGoldAccent: {
    color: '#d4af37',
  },
  brandSubTitle: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 7,
    marginTop: 2,
  },

  /* Welcome & Deco */
  welcomeBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  welcomeSub: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  decoLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  decoLine: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
  },
  decoDiamond: {
    width: 5,
    height: 5,
    backgroundColor: '#d4af37',
    transform: [{ rotate: '45deg' }],
  },

  /* Keypad Inner Container */
  keypadInnerCard: {
    width: '100%',
    backgroundColor: 'rgba(9, 10, 15, 0.75)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  pinLabelText: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 22,
  },
  dotCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    backgroundColor: 'transparent',
  },
  dotCircleActive: {
    backgroundColor: '#d4af37',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 270,
  },
  keypadBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadNum: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },

  /* Divider Line with Circle */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  dividerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#d4af37',
    backgroundColor: 'transparent',
  },

  /* QR Scan Button Card */
  qrScanCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 10, 15, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d4af37',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    gap: 14,
  },
  qrIconFrameBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrTextContent: {
    flex: 1,
  },
  qrBtnTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  qrBtnSub: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },

  /* Quick Mesa Demo Selector */
  quickMesaContainer: {
    width: '100%',
    marginTop: 18,
    alignItems: 'center',
  },
  quickMesaLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  quickMesaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  quickMesaChip: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickMesaChipText: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: '800',
  },
});

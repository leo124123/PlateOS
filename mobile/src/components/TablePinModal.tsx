import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';

interface TablePinModalProps {
  onConnect: (pin: string) => void;
  onOpenScanner: () => void;
  isConnecting: boolean;
}

const { width } = Dimensions.get('window');

const RESTAURANT_BG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

export const TablePinModal: React.FC<TablePinModalProps> = ({
  onConnect,
  onOpenScanner,
  isConnecting,
}) => {
  const [pinCode, setPinCode] = useState('');

  const handleQuickSelect = (num: number) => {
    setPinCode(num.toString());
    onConnect(num.toString());
  };

  const handleKeyPress = (val: string) => {
    if (pinCode.length < 4) {
      setPinCode((prev) => prev + val);
    }
  };

  const handleDelete = () => {
    setPinCode((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pinCode.trim()) {
      onConnect(pinCode.trim());
    }
  };

  return (
    <ImageBackground source={{ uri: RESTAURANT_BG }} style={styles.backgroundImage}>
      <View style={styles.darkOverlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>👑</Text>
            </View>
            <Text style={styles.brandTitle}>
              Plate<Text style={styles.brandAccent}>OS</Text>
            </Text>
            <Text style={styles.brandTagline}>EXPERIENCIA GASTRONÓMICA DIGITAL</Text>
          </View>

          {/* Main Glassmorphic Card */}
          <View style={styles.glassCard}>
            <Text style={styles.cardHeaderTitle}>Conectar Mesa</Text>
            <Text style={styles.cardHeaderSub}>
              Escanea el código QR de tu mesa o ingresa el número de mesa para ver el menú y pedir.
            </Text>

            {/* Main QR Scanner Entrance */}
            <TouchableOpacity
              style={styles.qrScanButton}
              onPress={onOpenScanner}
              activeOpacity={0.85}
            >
              <Text style={styles.qrScanIcon}>📷</Text>
              <Text style={styles.qrScanText}>ESCANEAR CÓDIGO QR DE MESA</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O INGRESA CÓDIGO DE MESA</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* PIN Display Boxes */}
            <View style={styles.pinDisplayRow}>
              <TextInput
                style={styles.pinInput}
                value={pinCode}
                onChangeText={setPinCode}
                placeholder="Nº de Mesa (ej. 1, 2, 11)"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                maxLength={4}
              />
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!pinCode || isConnecting) && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!pinCode || isConnecting}
              >
                <Text style={styles.submitBtnText}>{isConnecting ? '⏳' : 'CONECTAR'}</Text>
              </TouchableOpacity>
            </View>

            {/* Tactile On-Screen Keypad */}
            <View style={styles.keypadGrid}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.keypadKey}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keypadKeyText}>{key}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.keypadKeyAction}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadActionText}>⌫ Borrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadKey}
                onPress={() => handleKeyPress('0')}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadKeyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadKeyActionSubmit}
                onPress={handleSubmit}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadActionTextSubmit}>→ Entrar</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Test Table Pills */}
            <Text style={styles.quickLabel}>Selección Rápida de Mesa (Modo Prueba):</Text>
            <View style={styles.quickGrid}>
              {[1, 2, 3, 4, 5, 6, 11, 15].map((tableNum) => (
                <TouchableOpacity
                  key={tableNum}
                  style={styles.quickPill}
                  onPress={() => handleQuickSelect(tableNum)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickPillText}>Mesa #{tableNum}</Text>
                </TouchableOpacity>
              ))}
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
    backgroundColor: 'rgba(2, 6, 23, 0.88)',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 26,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#f59e0b',
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '900',
    color: '#f59e0b',
    letterSpacing: 2,
    marginTop: 4,
  },
  glassCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  cardHeaderSub: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 18,
  },
  qrScanButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  qrScanIcon: {
    fontSize: 18,
  },
  qrScanText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e293b',
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
  },
  pinDisplayRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 12,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 8,
  },
  keypadKey: {
    width: (width - 110) / 3,
    height: 46,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadKeyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  keypadKeyAction: {
    width: (width - 110) / 3,
    height: 46,
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadActionText: {
    color: '#f43f5e',
    fontSize: 12,
    fontWeight: '900',
  },
  keypadKeyActionSubmit: {
    width: (width - 110) / 3,
    height: 46,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadActionTextSubmit: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '900',
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickPill: {
    backgroundColor: '#020617',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  quickPillText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
});

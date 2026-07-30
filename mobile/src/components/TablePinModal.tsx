import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { QrCode, Keypad, ArrowRight, Sparkles, Utensils } from 'lucide-react-native';

interface TablePinModalProps {
  onConnect: (pin: string) => void;
  onOpenScanner: () => void;
  isConnecting: boolean;
}

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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.iconCircle}>
          <Utensils size={28} color="#f59e0b" />
        </View>
        <Text style={styles.brandTitle}>
          Plate<Text style={styles.brandAccent}>OS</Text> Go
        </Text>
        <Text style={styles.brandSub}>Experiencia Digital de Mesa para Clientes</Text>
      </View>

      {/* Main Connection Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conecta tu Mesa</Text>
        <Text style={styles.cardDesc}>
          Escanea el código QR en el acrílico de tu mesa o ingresa el número / PIN de mesa.
        </Text>

        {/* QR Scanner Trigger Button */}
        <TouchableOpacity style={styles.qrButton} onPress={onOpenScanner} activeOpacity={0.8}>
          <QrCode size={22} color="#0f172a" />
          <Text style={styles.qrButtonText}>ESCANEAR CÓDIGO QR</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O INGRESA CÓDIGO DE MESA</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* PIN Display Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.pinInput}
            value={pinCode}
            onChangeText={setPinCode}
            placeholder="Ej. 1, 2, 11..."
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            maxLength={4}
          />
          <TouchableOpacity
            style={[styles.submitButton, (!pinCode || isConnecting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!pinCode || isConnecting}
          >
            <ArrowRight size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Quick Select Table Pills */}
        <Text style={styles.quickLabel}>Acceso Rápido por Mesa (Modo Prueba):</Text>
        <View style={styles.quickGrid}>
          {[1, 2, 3, 4, 5, 6, 11, 15].map((tableNum) => (
            <TouchableOpacity
              key={tableNum}
              style={styles.quickPill}
              onPress={() => handleQuickSelect(tableNum)}
            >
              <Text style={styles.quickPillText}>Mesa #{tableNum}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#f59e0b',
  },
  brandSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 24,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  qrButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  qrButtonText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e293b',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 20,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPill: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickPillText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
});

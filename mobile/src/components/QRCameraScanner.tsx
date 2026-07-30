import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { X, QrCode, Sparkles, CheckCircle2 } from 'lucide-react-native';

interface QRCameraScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (tableCode: string) => void;
}

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export const QRCameraScanner: React.FC<QRCameraScannerProps> = ({
  visible,
  onClose,
  onScanSuccess,
}) => {
  const [selectedSimulatedTable, setSelectedSimulatedTable] = useState<number | null>(null);

  const handleSimulateScan = (num: number) => {
    setSelectedSimulatedTable(num);
    setTimeout(() => {
      onScanSuccess(num.toString());
      setSelectedSimulatedTable(null);
      onClose();
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Escáner QR de Mesa</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Camera Scanner Reticle Viewport */}
        <View style={styles.viewportContainer}>
          <View style={styles.scanReticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <QrCode size={64} color="#f59e0b" style={{ opacity: 0.6 }} />
          </View>
          <Text style={styles.scanHint}>Apunta la cámara al código QR impreso en el acrílico de tu mesa</Text>
        </View>

        {/* Simulation Selector Bar for Testing / Expo Go */}
        <View style={styles.simContainer}>
          <Text style={styles.simTitle}>⚡ Simulador de Escaneo QR (Modo Prueba Expo Go):</Text>
          <View style={styles.simGrid}>
            {[1, 2, 3, 4, 5, 6, 11, 15].map((tableNum) => (
              <TouchableOpacity
                key={tableNum}
                style={[
                  styles.simPill,
                  selectedSimulatedTable === tableNum && styles.simPillActive,
                ]}
                onPress={() => handleSimulateScan(tableNum)}
              >
                {selectedSimulatedTable === tableNum ? (
                  <CheckCircle2 size={14} color="#0f172a" />
                ) : (
                  <Sparkles size={12} color="#f59e0b" />
                )}
                <Text
                  style={[
                    styles.simPillText,
                    selectedSimulatedTable === tableNum && styles.simPillTextActive,
                  ]}
                >
                  QR Mesa #{tableNum}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewportContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanReticle: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#f59e0b',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanHint: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  simContainer: {
    paddingHorizontal: 24,
  },
  simTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  simGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  simPill: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simPillActive: {
    backgroundColor: '#10b981',
    borderColor: '#34d399',
  },
  simPillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  simPillTextActive: {
    color: '#0f172a',
  },
});

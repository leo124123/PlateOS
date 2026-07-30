import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { getSocket } from '../services/socket';
import api from '../services/api';
import { PremiumIcon } from './common/PremiumIcon';

interface ReservationResponse {
  reservationId: string;
  tableNumber: number;
  status: 'CONFIRMED' | 'REJECTED';
  adminMessage?: string;
}

export const VIPReservationsScreen: React.FC = () => {
  const { connectedTable, customerName } = useClientStore();

  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState('20:30');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  // Incoming Real-time Admin Response Modal
  const [incomingResponse, setIncomingResponse] = useState<ReservationResponse | null>(null);

  const TIME_SLOTS = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data: ReservationResponse) => {
      console.log('[PlateOS Mobile] Respuesta de reserva recibida:', data);
      if (!connectedTable || data.tableNumber === connectedTable.number) {
        setIncomingResponse(data);
      }
    };

    socket.on('reservation:status_updated', handleStatusUpdate);

    return () => {
      socket.off('reservation:status_updated', handleStatusUpdate);
    };
  }, [connectedTable]);

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);

    const payload = {
      tableNumber: connectedTable?.number || 1,
      tableId: connectedTable?.id || null,
      customerName: customerName || `Cliente Mesa #${connectedTable?.number || 1}`,
      guests,
      date: new Date().toISOString().split('T')[0],
      time: selectedTime,
      notes,
    };

    try {
      // 1. Post to API
      const res = await api.post('/reservations', payload);
      const createdRes = res.data?.data || payload;

      // 2. Emit WebSocket event to Reception / Web App Admin
      const socket = getSocket();
      socket.emit('reservation:create', createdRes);

      setIsReserved(true);
    } catch (e) {
      console.log('[PlateOS Mobile] Error enviando reserva, usando socket directo');
      const socket = getSocket();
      socket.emit('reservation:create', {
        id: `res-${Date.now()}`,
        ...payload,
        status: 'PENDING',
      });
      setIsReserved(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReserved) {
    return (
      <View style={styles.successContainer}>
        {/* Incoming Real-time Admin Message Modal */}
        <Modal
          visible={!!incomingResponse}
          transparent
          animationType="fade"
          onRequestClose={() => setIncomingResponse(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.responseModalCard}>
              <View
                style={[
                  styles.responseIconCircle,
                  incomingResponse?.status === 'CONFIRMED'
                    ? styles.responseIconSuccess
                    : styles.responseIconDanger,
                ]}
              >
                <PremiumIcon
                  name={incomingResponse?.status === 'CONFIRMED' ? 'check' : 'x'}
                  size={32}
                  color={incomingResponse?.status === 'CONFIRMED' ? '#10b981' : '#f43f5e'}
                  strokeWidth={3}
                />
              </View>

              <Text style={styles.responseAlertTag}>¡MENSAJE DE LA RECEPCIÓN!</Text>
              <Text style={styles.responseTitle}>
                {incomingResponse?.status === 'CONFIRMED'
                  ? '¡Su Reserva ha sido CONFIRMADA!'
                  : 'Actualización sobre su Reserva'}
              </Text>

              {incomingResponse?.adminMessage && (
                <View style={styles.adminMessageBox}>
                  <PremiumIcon name="sparkles" size={14} color="#d4af37" />
                  <Text style={styles.adminMessageText}>"{incomingResponse.adminMessage}"</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIncomingResponse(null)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCloseText font-bold}>ENTENDIDO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <PremiumIcon name="calendar" size={40} color="#d4af37" />
          </View>
          <Text style={styles.successTitle}>¡Solicitud de Reserva Enviada!</Text>
          <Text style={styles.successSub}>
            Tu reserva para {guests} personas a las {selectedTime} hs fue enviada a la recepción. Recibirás una notificación en pantalla en cuanto la confirmen.
          </Text>

          {incomingResponse && (
            <TouchableOpacity
              style={styles.viewMessageBtn}
              onPress={() => setIncomingResponse(incomingResponse)}
              activeOpacity={0.8}
            >
              <PremiumIcon name="bell" size={16} color="#090a0f" />
              <Text style={styles.viewMessageText}>
                VER RESPUESTA DE RECEPCIÓN ({incomingResponse.status === 'CONFIRMED' ? 'CONFIRMADA' : 'REVISAR'})
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.newReserveBtn}
            onPress={() => setIsReserved(false)}
            activeOpacity={0.85}
          >
            <PremiumIcon name="sparkles" size={14} color="#090a0f" />
            <Text style={styles.newReserveText}>NUEVA RESERVA VIP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Real-time Response Notification Bar if arrived while filling */}
      {incomingResponse && (
        <TouchableOpacity
          style={styles.bannerAlert}
          onPress={() => setIncomingResponse(incomingResponse)}
          activeOpacity={0.85}
        >
          <PremiumIcon name="bell" size={16} color="#090a0f" />
          <Text style={styles.bannerAlertText}>
            ¡NUEVO MENSAJE DE RECEPCIÓN SOBRE TU RESERVA! TOCA AQUÍ
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.headerBox}>
        <View style={styles.badgeRow}>
          <PremiumIcon name="calendar" size={14} color="#d4af37" />
          <Text style={styles.headerTagline}>EXPERIENCIA EXCLUSIVA</Text>
        </View>
        <Text style={styles.headerTitle}>Reservas VIP & Prioritarias</Text>
        <Text style={styles.headerSub}>
          Garantiza tu mesa preferida para tus próximos momentos especiales.
        </Text>
      </View>

      {/* Current Table Info */}
      <View style={styles.currentTableBanner}>
        <View style={styles.currentTableIconBox}>
          <PremiumIcon name="user" size={18} color="#d4af37" />
        </View>
        <View style={styles.currentTableTextContent}>
          <Text style={styles.currentTableTag}>MESA ACTUALMENTE CONECTADA</Text>
          <Text style={styles.currentTableTitle}>
            Mesa #{connectedTable?.number || 1} • Salón Principal
          </Text>
        </View>
      </View>

      {/* Guest Selector */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeaderRow}>
          <PremiumIcon name="user" size={14} color="#d4af37" />
          <Text style={styles.sectionLabel}>NÚMERO DE COMENSALES</Text>
        </View>
        <View style={styles.guestRow}>
          {[1, 2, 3, 4, 6, 8].map((num) => {
            const isSelected = guests === num;
            return (
              <TouchableOpacity
                key={num}
                style={[styles.guestBtn, isSelected && styles.guestBtnActive]}
                onPress={() => setGuests(num)}
                activeOpacity={0.8}
              >
                <Text style={[styles.guestBtnText, isSelected && styles.guestBtnTextActive]}>
                  {num} Pers.
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Time Slot Picker */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeaderRow}>
          <PremiumIcon name="clock" size={14} color="#d4af37" />
          <Text style={styles.sectionLabel}>HORARIO DISPONIBLE HOY</Text>
        </View>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeBtn, isSelected && styles.timeBtnActive]}
                onPress={() => setSelectedTime(time)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeBtnText, isSelected && styles.timeBtnTextActive]}>
                  {time} HS
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Special Requests */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeaderRow}>
          <PremiumIcon name="sparkles" size={14} color="#d4af37" />
          <Text style={styles.sectionLabel}>SOLICITUD ESPECIAL O ANIVERSARIO</Text>
        </View>
        <TextInput
          style={styles.notesInput}
          placeholder="Ej: Aniversario, mesa cerca del ventanal, maridaje exclusivo..."
          placeholderTextColor="#64748b"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* Confirm Action */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={handleConfirmReservation}
        disabled={isSubmitting}
        activeOpacity={0.85}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#090a0f" size="small" />
        ) : (
          <>
            <PremiumIcon name="calendar" size={16} color="#090a0f" />
            <Text style={styles.confirmBtnText}>CONFIRMAR Y ENVIAR A RECEPCIÓN</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 130,
    gap: 14,
  },
  bannerAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d4af37',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  bannerAlertText: {
    color: '#090a0f',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    flex: 1,
  },
  headerBox: {
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerTagline: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  currentTableBanner: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentTableIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentTableTextContent: {
    flex: 1,
  },
  currentTableTag: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  currentTableTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  cardSection: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  guestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guestBtn: {
    flex: 1,
    minWidth: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  guestBtnActive: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  guestBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  guestBtnTextActive: {
    color: '#090a0f',
    fontWeight: '900',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeBtn: {
    width: '31%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeBtnActive: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  timeBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  timeBtnTextActive: {
    color: '#090a0f',
    fontWeight: '900',
  },
  notesInput: {
    backgroundColor: '#090a0f',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: 12,
    fontSize: 12,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  confirmBtnText: {
    color: '#090a0f',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successCard: {
    backgroundColor: '#0f111a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d4af37',
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  successTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSub: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  viewMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#d4af37',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  viewMessageText: {
    color: '#090a0f',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  newReserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#d4af37',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
  },
  newReserveText: {
    color: '#d4af37',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  /* Response Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  responseModalCard: {
    backgroundColor: '#0f111a',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  responseIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
  },
  responseIconSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  responseIconDanger: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#f43f5e',
  },
  responseAlertTag: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  responseTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  adminMessageBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 18,
    width: '100%',
  },
  adminMessageText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    flex: 1,
  },
  modalCloseBtn: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#090a0f',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

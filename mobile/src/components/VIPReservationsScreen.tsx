import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { PremiumIcon } from './common/PremiumIcon';

export const VIPReservationsScreen: React.FC = () => {
  const { connectedTable } = useClientStore();

  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState('20:30');
  const [notes, setNotes] = useState('');
  const [isReserved, setIsReserved] = useState(false);

  const TIME_SLOTS = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const handleConfirmReservation = () => {
    setIsReserved(true);
  };

  if (isReserved) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <PremiumIcon name="calendar" size={40} color="#d4af37" />
          </View>
          <Text style={styles.successTitle}>¡Reserva VIP Confirmada!</Text>
          <Text style={styles.successSub}>
            Tu próxima experiencia gourmet en Mesa VIP está reservada para {guests} personas a las {selectedTime} hs.
          </Text>
          <TouchableOpacity
            style={styles.newReserveBtn}
            onPress={() => setIsReserved(false)}
            activeOpacity={0.85}
          >
            <PremiumIcon name="sparkles" size={14} color="#090a0f" />
            <Text style={styles.newReserveText}>NUEVA RESERVA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.currentTableTitle}>Mesa #{connectedTable?.number || 1} • Salón Principal</Text>
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
                  {num} {num === 1 ? 'Pers.' : 'Pers.'}
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
        activeOpacity={0.85}
      >
        <PremiumIcon name="calendar" size={16} color="#090a0f" />
        <Text style={styles.confirmBtnText}>CONFIRMAR RESERVA VIP</Text>
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
  newReserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#d4af37',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
  },
  newReserveText: {
    color: '#090a0f',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

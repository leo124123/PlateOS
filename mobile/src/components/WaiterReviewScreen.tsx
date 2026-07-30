import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { getSocket } from '../services/socket';
import api from '../services/api';
import { PremiumIcon, IconName } from './common/PremiumIcon';

interface AspectTag {
  id: string;
  label: string;
  icon: IconName;
  iconColor: string;
}

interface WaiterOption {
  id: string;
  name: string;
  role: string;
  email?: string;
  tagline?: string;
}

const DEFAULT_WAITERS: WaiterOption[] = [
  { id: 'w-1', name: 'Carlos Mendoza', role: 'Mesero Senior', tagline: 'Especialista en Vinos' },
  { id: 'w-2', name: 'Leonardo Luis', role: 'Mesero Principal', tagline: 'Atención VIP' },
  { id: 'w-3', name: 'Ana Gutiérrez', role: 'Capitana de Mesas', tagline: 'Servicio Gourmet' },
  { id: 'w-4', name: 'Mateo Rossi', role: 'Sommelier & Mesero', tagline: 'Maridaje de Autor' },
  { id: 'w-5', name: 'Sofía Valenzuela', role: 'Mesera de Terraza', tagline: 'Atención Personalizada' },
];

const ASPECT_TAGS: AspectTag[] = [
  { id: 'rapido', label: 'Servicio Rápido', icon: 'zap', iconColor: '#10b981' },
  { id: 'amable', label: 'Trato Amable', icon: 'smile', iconColor: '#3b82f6' },
  { id: 'maridaje', label: 'Excelente Maridaje', icon: 'wine', iconColor: '#e11d48' },
  { id: 'impecable', label: 'Mesa Impecable', icon: 'check', iconColor: '#d4af37' },
  { id: 'recomendacion', label: 'Buena Recomendación', icon: 'sparkles', iconColor: '#a855f7' },
];

export const WaiterReviewScreen: React.FC = () => {
  const { connectedTable } = useClientStore();

  const [waiters, setWaiters] = useState<WaiterOption[]>(DEFAULT_WAITERS);
  const [selectedWaiter, setSelectedWaiter] = useState<WaiterOption>(DEFAULT_WAITERS[0]);
  const [loadingWaiters, setLoadingWaiters] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [selectedTip, setSelectedTip] = useState<string>('15%');
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({
    rapido: true,
    amable: true,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchWaitersList = async () => {
      setLoadingWaiters(true);
      try {
        const res = await api.get('/auth/waiters');
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const formatted = res.data.data.map((w: any, index: number) => ({
            id: w.id || `w-${index}`,
            name: w.name,
            role: w.role === 'ADMIN' ? 'Gerente de Servicio' : 'Mesero Profesional',
            tagline: 'Atención Gourmet',
          }));
          setWaiters(formatted);
          setSelectedWaiter(formatted[0]);
        }
      } catch (e) {
        console.log('[PlateOS Review] Usando meseros predeterminados');
      } finally {
        setLoadingWaiters(false);
      }
    };
    fetchWaitersList();
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => ({ ...prev, [tagId]: !prev[tagId] }));
  };

  const handleSubmitReview = () => {
    if (!connectedTable) return;

    const activeTags = ASPECT_TAGS.filter((t) => selectedTags[t.id]).map((t) => t.label);
    const socket = getSocket();

    socket.emit('waiter:review_submitted', {
      tableNumber: connectedTable.number,
      tableId: connectedTable.id,
      waiterId: selectedWaiter.id,
      waiterName: selectedWaiter.name,
      rating,
      comment,
      tags: activeTags,
      tip: selectedTip,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <PremiumIcon name="award" size={42} color="#d4af37" />
          </View>
          <Text style={styles.successTitle}>¡Reseña Enviada a {selectedWaiter.name}!</Text>
          <Text style={styles.successSub}>
            Agradecemos tu valoración para {selectedWaiter.name}. Tu opinión permite a nuestro equipo mantener los estándares gourmet de la Mesa #{connectedTable?.number}.
          </Text>
          <TouchableOpacity
            style={styles.newReviewBtn}
            onPress={() => setIsSubmitted(false)}
            activeOpacity={0.85}
          >
            <PremiumIcon name="sparkles" size={14} color="#090a0f" />
            <Text style={styles.newReviewText}>MODIFICAR RESEÑA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.badgeRow}>
          <PremiumIcon name="award" size={14} color="#d4af37" />
          <Text style={styles.headerTagline}>EXCELENCIA EN SERVICIO</Text>
        </View>
        <Text style={styles.headerTitle}>Valoración del Servicio</Text>
        <Text style={styles.headerSub}>
          Selecciona a tu camarero/mesero y califica la atención brindada en la Mesa #{connectedTable?.number || 1}.
        </Text>
      </View>

      {/* Waiter Selection Section */}
      <View style={styles.waiterSelectorCard}>
        <View style={styles.sectionHeaderRow}>
          <PremiumIcon name="user" size={14} color="#d4af37" />
          <Text style={styles.sectionLabel}>SELECCIONA A TU CAMARERO / MESERO</Text>
        </View>

        {loadingWaiters ? (
          <ActivityIndicator color="#d4af37" size="small" style={{ marginVertical: 12 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.waitersScrollRow}
          >
            {waiters.map((waiter) => {
              const isSelected = selectedWaiter.id === waiter.id;
              return (
                <TouchableOpacity
                  key={waiter.id}
                  style={[styles.waiterChip, isSelected && styles.waiterChipActive]}
                  onPress={() => setSelectedWaiter(waiter)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.waiterChipAvatar, isSelected && styles.waiterChipAvatarActive]}>
                    <PremiumIcon name="chef" size={18} color={isSelected ? '#090a0f' : '#d4af37'} />
                  </View>
                  <View style={styles.waiterChipInfo}>
                    <Text style={[styles.waiterChipName, isSelected && styles.waiterChipNameActive]}>
                      {waiter.name}
                    </Text>
                    <Text style={styles.waiterChipRole}>{waiter.role}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedBadgeCheck}>
                      <PremiumIcon name="check" size={12} color="#090a0f" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Selected Waiter Profile Card */}
      <View style={styles.waiterCard}>
        <View style={styles.waiterAvatarCircle}>
          <PremiumIcon name="chef" size={26} color="#d4af37" />
        </View>
        <View style={styles.waiterInfo}>
          <Text style={styles.waiterName}>{selectedWaiter.name}</Text>
          <Text style={styles.waiterRole}>
            {selectedWaiter.role} • Mesa #{connectedTable?.number || 1}
          </Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>ASIGNADO</Text>
        </View>
      </View>

      {/* Interactive Star Rating */}
      <View style={styles.ratingCard}>
        <Text style={styles.sectionLabel}>¿CÓMO FUE LA ATENCIÓN DE {selectedWaiter.name.toUpperCase()}?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= rating;
            return (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={[styles.starBtn, isActive && styles.starBtnActive]}
              >
                <PremiumIcon
                  name="star"
                  size={26}
                  color={isActive ? '#d4af37' : '#475569'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.ratingStatusText}>
          {rating === 5
            ? '¡Excelente Servicio de Autor!'
            : rating === 4
            ? 'Muy Buen Servicio'
            : rating === 3
            ? 'Servicio Aceptable'
            : 'Servicio Regular'}
        </Text>
      </View>

      {/* Aspect Tags ("Cómo fue el servicio") */}
      <View style={styles.tagsCard}>
        <Text style={styles.sectionLabel}>ASPECTOS DESTACADOS DEL SERVICIO</Text>
        <View style={styles.tagsGrid}>
          {ASPECT_TAGS.map((tag) => {
            const isSelected = !!selectedTags[tag.id];
            return (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tagPill, isSelected && styles.tagPillActive]}
                onPress={() => toggleTag(tag.id)}
                activeOpacity={0.8}
              >
                <PremiumIcon
                  name={tag.icon}
                  size={14}
                  color={isSelected ? '#090a0f' : tag.iconColor}
                />
                <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tip Selector */}
      <View style={styles.tipCard}>
        <Text style={styles.sectionLabel}>RECONOCIMIENTO A {selectedWaiter.name.toUpperCase()} (PROPINA)</Text>
        <View style={styles.tipRow}>
          {['10%', '15%', '20%', 'Sin Propina'].map((tip) => {
            const isSelected = selectedTip === tip;
            return (
              <TouchableOpacity
                key={tip}
                style={[styles.tipBtn, isSelected && styles.tipBtnActive]}
                onPress={() => setSelectedTip(tip)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tipBtnText, isSelected && styles.tipBtnTextActive]}>
                  {tip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Comment Section */}
      <View style={styles.commentCard}>
        <Text style={styles.sectionLabel}>COMENTARIO O DETALLE ADICIONAL</Text>
        <TextInput
          style={styles.commentInput}
          placeholder={`Escribe aquí tu opinión sobre el trato de ${selectedWaiter.name}...`}
          placeholderTextColor="#64748b"
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmitReview}
        activeOpacity={0.85}
      >
        <PremiumIcon name="award" size={16} color="#090a0f" />
        <Text style={styles.submitBtnText}>ENVIAR RESEÑA A {selectedWaiter.name.toUpperCase()}</Text>
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

  /* Waiter Selector */
  waiterSelectorCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    padding: 16,
  },
  waitersScrollRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  waiterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    minWidth: 160,
  },
  waiterChipActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderColor: '#d4af37',
  },
  waiterChipAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waiterChipAvatarActive: {
    backgroundColor: '#d4af37',
  },
  waiterChipInfo: {
    flex: 1,
  },
  waiterChipName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  waiterChipNameActive: {
    color: '#d4af37',
    fontWeight: '900',
  },
  waiterChipRole: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  selectedBadgeCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Active Waiter Display */
  waiterCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  waiterAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1.5,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waiterInfo: {
    flex: 1,
  },
  waiterName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  waiterRole: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  onlineText: {
    color: '#10b981',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ratingCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    padding: 16,
    alignItems: 'center',
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
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 6,
  },
  starBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  starBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  ratingStatusText: {
    color: '#d4af37',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  tagsCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    padding: 16,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagPillActive: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  tagPillText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  tagPillTextActive: {
    color: '#090a0f',
    fontWeight: '900',
  },
  tipCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    padding: 16,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipBtnActive: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  tipBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  tipBtnTextActive: {
    color: '#090a0f',
    fontWeight: '900',
  },
  commentCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    padding: 16,
  },
  commentInput: {
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  submitBtnText: {
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
  newReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#d4af37',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
  },
  newReviewText: {
    color: '#090a0f',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

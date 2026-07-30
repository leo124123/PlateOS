import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { getSocket } from '../services/socket';
import { PremiumIcon } from './common/PremiumIcon';

interface ExperienceItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  highlights: string[];
}

const GOURMET_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-7-pasos',
    tag: 'EDICIÓN LIMITADA',
    title: 'Menú Degustación Signature (7 Pasos)',
    subtitle: 'Un viaje sensorial por la alta gastronomía contemporánea',
    price: 3800,
    duration: '2h 30min',
    description:
      'Diseñado minuciosamente por nuestro Chef Ejecutivo. Cada paso armoniza ingredientes selectos, texturas contrastantes y técnicas de vanguardia.',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Amuse-Bouche: Esfera de Foie Gras y Maracuyá',
      'Entrante: Carpaccio de Trufa Negra y Wagyu',
      'Principal: Pulpo a la Parilla con Papa Trufada',
      'Pre-Postre: Espuma de Cítricos y Menta',
      'Postre: Esfera Dorada de Cacao 70%',
    ],
  },
  {
    id: 'exp-sommelier',
    tag: 'EXCLUSIVO SOMMELIER',
    title: 'Maridaje Sommelier Gran Reserva',
    subtitle: 'Vinos de colección seleccionados etiqueta por etiqueta',
    price: 2400,
    duration: '1h 45min',
    description:
      'Nuestra sommelier principal presenta 5 copas exclusivas de bodegas boutique internacionales perfectamente alineadas con tus platos.',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Champagne French Premier Cru de Bienvenida',
      'Sauvignon Blanc Valle de Casablanca 2021',
      'Cabernet Sauvignon Gran Reserva Maipo 2018',
      'Oporto Vintage Reserva Especial para el Cierre',
    ],
  },
  {
    id: 'exp-chef-table',
    tag: 'EXPERIENCIA PRIVADA',
    title: 'Chef’s Table & Cocina en Vivo',
    subtitle: 'Atención personalizada y pase exclusivo a la estación del chef',
    price: 4900,
    duration: '3h 00min',
    description:
      'Mesa en primera fila frente a nuestra cocina de diseño. El Chef elaborará y explicará cada plato personalmente ante tus ojos.',
    image:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Charla personalizada con el Chef Ejecutivo',
      'Corte de Wagyu A5 importado en vivo',
      'Maridaje VIP ilimitado durante la velada',
      'Regalo gourmet de recuerdo de la casa',
    ],
  },
  {
    id: 'exp-mixology',
    tag: 'NIGHT & SENSES',
    title: 'Mixología Sensorial & Ahumados',
    subtitle: 'Coctelería conceptual con esencias botánicas y nitrógeno',
    price: 1850,
    duration: '1h 15min',
    description:
      'Demostración de mixología en mesa con ahumado al momento en madera de roble, infusiones criogénicas y maridaje de finger foods.',
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      '3 Cócteles de Autor Ahumados en Vivo',
      'Hielo Tallado a Mano con Sello de Oro',
      'Tabla de Quesos Artesanales Madurados',
    ],
  },
];

export const ExperiencesScreen: React.FC = () => {
  const { connectedTable } = useClientStore();
  const [selectedExp, setSelectedExp] = useState<ExperienceItem | null>(null);
  const [isRequested, setIsRequested] = useState(false);

  const handleRequestExperience = (exp: ExperienceItem) => {
    setSelectedExp(exp);
    const socket = getSocket();
    if (connectedTable) {
      socket.emit('experience:requested', {
        tableNumber: connectedTable.number,
        tableId: connectedTable.id,
        experienceId: exp.id,
        title: exp.title,
        price: exp.price,
      });
    }
    setIsRequested(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.badgeRow}>
          <PremiumIcon name="sparkles" size={14} color="#d4af37" />
          <Text style={styles.headerTagline}>GASTRONOMÍA DE ALTA ESCALA</Text>
        </View>
        <Text style={styles.headerTitle}>Experiencias & Maridaje</Text>
        <Text style={styles.headerSub}>
          Eleva tu estancia en la Mesa #{connectedTable?.number || 1} con vivencias gastronómicas diseñadas para paladares exigentes.
        </Text>
      </View>

      {/* List of Experiences */}
      {GOURMET_EXPERIENCES.map((exp) => (
        <View key={exp.id} style={styles.card}>
          <View style={styles.imageBox}>
            <Image source={{ uri: exp.image }} style={styles.cardImage} />
            <View style={styles.imageOverlay} />
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{exp.tag}</Text>
            </View>
            <View style={styles.durationBadge}>
              <PremiumIcon name="clock" size={12} color="#ffffff" />
              <Text style={styles.durationText}>{exp.duration}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.expTitle}>{exp.title}</Text>
            <Text style={styles.expSub}>{exp.subtitle}</Text>
            <Text style={styles.expDesc}>{exp.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.highlightsHeader}>LO QUE INCLUYE LA EXPERIENCIA:</Text>
            {exp.highlights.map((h, i) => (
              <View key={i} style={styles.highlightItem}>
                <PremiumIcon name="check" size={14} color="#10b981" />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.priceLabel}>PRECIO POR PERSONA</Text>
                <Text style={styles.priceValue}>${exp.price.toLocaleString('es-DO')}</Text>
              </View>

              <TouchableOpacity
                style={styles.requestBtn}
                onPress={() => handleRequestExperience(exp)}
                activeOpacity={0.85}
              >
                <PremiumIcon name="sparkles" size={14} color="#090a0f" />
                <Text style={styles.requestBtnText}>SOLICITAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Confirmation Modal */}
      <Modal
        visible={isRequested}
        transparent
        animationType="fade"
        onRequestClose={() => setIsRequested(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <PremiumIcon name="sparkles" size={32} color="#d4af37" />
            </View>
            <Text style={styles.modalTitle}>¡Experiencia Solicitada!</Text>
            <Text style={styles.modalSub}>
              Has solicitado "{selectedExp?.title}" para la Mesa #{connectedTable?.number}. Nuestro Sommelier/Chef se acercará en unos instantes.
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsRequested(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCloseText}>ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 130,
    gap: 18,
  },
  headerBox: {
    marginBottom: 6,
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
  card: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    overflow: 'hidden',
  },
  imageBox: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 10, 15, 0.45)',
  },
  tagBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(9, 10, 15, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  tagText: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  durationBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: {
    padding: 18,
  },
  expTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 2,
  },
  expSub: {
    color: '#d4af37',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  expDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    marginVertical: 14,
  },
  highlightsHeader: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  highlightText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  priceLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  priceValue: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  requestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#d4af37',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  requestBtnText: {
    color: '#090a0f',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#0f111a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d4af37',
    padding: 24,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: '#d4af37',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#090a0f',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

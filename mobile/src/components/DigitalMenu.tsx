import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { PremiumIcon, IconName } from './common/PremiumIcon';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 40;

const HERO_SLIDES = [
  {
    id: 'slide-1',
    tagline: 'EXPERIENCIAS ÚNICAS',
    title: 'Alta cocina,\nmomentos\ninolvidables.',
    sub: 'Ingredientes selectos, técnicas de autor y pasión en cada plato.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'slide-2',
    tagline: 'CORTES PRIME & MADURADOS',
    title: 'Sabores intensos,\ncorte perfecto.',
    sub: 'Carnes de selección premium cocinadas al punto exacto a las brasas.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'slide-3',
    tagline: 'MIXOLOGÍA DE AUTOR',
    title: 'Cócteles ahumados\ny vinos reserva.',
    sub: 'Un maridaje de excepción diseñado por nuestros sommeliers.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'slide-4',
    tagline: 'ALTA REPOSTERÍA',
    title: 'El broche de oro\npara tu velada.',
    sub: 'Postres de autor elaborados diariamente por nuestros maestros pasteleros.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
  },
];

const DEGUSTACION_IMAGE =
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80';

const GOURMET_IMAGES: Record<string, string> = {
  'Pulpo a las Brasas':
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  'Rack de Cordero':
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  'Tagliatelle al Tartufo':
    'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
  'Carpaccio de Res Trufado':
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  'Ceviche de Pulpo al Olivo':
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  'Empanaditas de Mariscos (4ud)':
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
  'Ribeye Steak Prime 400g':
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
  'Salmón Glaseado al Maracuyá':
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
  'Risotto de Hongos Porcini':
    'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
  'Volcán de Chocolate con Helado':
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
  'Cheesecake de Frutos Rojos':
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
  'Cocktail Smoked Old Fashioned':
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
  'Copa de Vino Tinto Reserva':
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';

const RECOMMENDED_ITEMS = [
  {
    id: 'rec-1',
    name: 'Pulpo a las Brasas',
    description: 'Parmentier de papa trufada, ajíes asados y oliva negra.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec-2',
    name: 'Rack de Cordero',
    description: 'Costra de hierbas, puré de coliflor y reducción de vino tinto.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec-3',
    name: 'Tagliatelle al Tartufo',
    description: 'Salsa cremosa de parmesano y trufa negra fresca.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
  },
];

const CATEGORY_ICONS: Record<string, IconName> = {
  ENTRADAS: 'menu',
  'PLATOS FUERTES': 'chef',
  POSTRES: 'sparkles',
  BEBIDAS: 'wine',
  'CHEF ESPECIALES': 'award',
};

interface DigitalMenuProps {
  activeTab?: string;
}

export const DigitalMenu: React.FC<DigitalMenuProps> = ({ activeTab = 'inicio' }) => {
  const { categories, connectedTable } = useClientStore();
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'rec-1': true,
    'rec-2': true,
  });

  const heroScrollRef = useRef<ScrollView>(null);

  // Auto-scroll hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => {
        const nextIndex = (prev + 1) % HERO_SLIDES.length;
        heroScrollRef.current?.scrollTo({
          x: nextIndex * SLIDE_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleHeroScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    if (slide !== activeSlideIndex && slide >= 0 && slide < HERO_SLIDES.length) {
      setActiveSlideIndex(slide);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const filteredItems =
    activeCategory?.items?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
      {/* ── 1. INTERACTIVE PARALLAX HERO CAROUSEL ── */}
      <View style={styles.heroWrapper}>
        <ScrollView
          ref={heroScrollRef}
          horizontal
          pagingEnabled
          snapToInterval={SLIDE_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleHeroScroll}
          scrollEventThrottle={16}
        >
          {HERO_SLIDES.map((slide) => (
            <View key={slide.id} style={{ width: SLIDE_WIDTH }}>
              <ImageBackground
                source={{ uri: slide.image }}
                style={styles.heroBg}
                imageStyle={{ borderRadius: 24 }}
              >
                <View style={styles.heroGradient}>
                  <Text style={styles.heroTagline}>{slide.tagline}</Text>
                  <Text style={styles.heroTitle}>{slide.title}</Text>
                  <Text style={styles.heroSub}>{slide.sub}</Text>

                  <TouchableOpacity style={styles.heroCtaBtn} activeOpacity={0.85}>
                    <Text style={styles.heroCtaText}>
                      MESA #{connectedTable?.number || 1}
                    </Text>
                    <View style={styles.heroCtaIconCircle}>
                      <PremiumIcon name="arrow-right" size={12} color="#090a0f" />
                    </View>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {/* Dynamic Carousel Active Dots */}
        <View style={styles.dotsRow}>
          {HERO_SLIDES.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                heroScrollRef.current?.scrollTo({ x: idx * SLIDE_WIDTH, animated: true });
                setActiveSlideIndex(idx);
              }}
              style={[styles.dot, activeSlideIndex === idx && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      {/* ── 2. CIRCULAR CATEGORY ICONS ROW ── */}
      <View style={styles.categorySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categorySlider}>
          {categories.map((cat) => {
            const isActive = selectedCatId === cat.id;
            const iconName = CATEGORY_ICONS[cat.name.toUpperCase()] || 'menu';

            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCircleItem}
                onPress={() => setSelectedCatId(cat.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryCircle, isActive && styles.categoryCircleActive]}>
                  <PremiumIcon
                    name={iconName}
                    size={20}
                    color={isActive ? '#090a0f' : '#d4af37'}
                  />
                </View>
                <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                  {cat.name.toUpperCase()}
                </Text>
                {isActive && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 3. RECOMENDADOS PARA TI CAROUSEL (IF INICIO) ── */}
      {activeTab === 'inicio' && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleSerif}>Recomendados para ti</Text>
            <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Ver todo</Text>
              <PremiumIcon name="arrow-right" size={12} color="#d4af37" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedSlider}>
            {RECOMMENDED_ITEMS.map((item) => {
              const isFav = favorites[item.id];
              return (
                <View key={item.id} style={styles.recommendedCard}>
                  <Image source={{ uri: item.image }} style={styles.recommendedImage} />
                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={() => toggleFavorite(item.id)}
                    activeOpacity={0.8}
                  >
                    <PremiumIcon
                      name="heart"
                      size={14}
                      color={isFav ? '#e11d48' : '#ffffff'}
                    />
                  </TouchableOpacity>

                  <View style={styles.recommendedCardBody}>
                    <Text style={styles.recommendedTitle}>{item.name}</Text>
                    <Text style={styles.recommendedSub} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.recommendedPrice}>RD${item.price.toLocaleString()}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* ── 4. MENÚ DEGUSTACIÓN BANNER ── */}
          <View style={styles.degustacionWrapper}>
            <View style={styles.degustacionCard}>
              <Image source={{ uri: DEGUSTACION_IMAGE }} style={styles.degustacionImg} />
              <View style={styles.degustacionContent}>
                <Text style={styles.degustacionTag}>MENÚ DEGUSTACIÓN</Text>
                <Text style={styles.degustacionTitle}>7 tiempos, una experiencia para los sentidos.</Text>
                <Text style={styles.degustacionPrice}>RD$2,950</Text>
              </View>
              <TouchableOpacity style={styles.degustacionArrowBtn} activeOpacity={0.8}>
                <PremiumIcon name="arrow-right" size={14} color="#090a0f" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* ── 5. FULL MENU CATALOG LIST ── */}
      <View style={styles.fullCatalogSection}>
        <View style={styles.searchBar}>
          <PremiumIcon name="menu" size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar platillo o ingrediente..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <PremiumIcon name="x" size={14} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.categoryTitleHeader}>{activeCategory?.name || 'Menú Digital'}</Text>

        <View style={styles.dishesGrid}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <PremiumIcon name="chef" size={32} color="#64748b" />
              <Text style={styles.emptyTitle}>Sin platillos disponibles</Text>
              <Text style={styles.emptySub}>Selecciona otra categoría o limpia tu búsqueda.</Text>
            </View>
          ) : (
            filteredItems.map((item) => {
              const imageUri = item.imageUrl || GOURMET_IMAGES[item.name] || DEFAULT_IMAGE;

              return (
                <View key={item.id} style={styles.dishCard}>
                  <Image source={{ uri: imageUri }} style={styles.dishImage} />
                  <View style={styles.dishDetails}>
                    <View style={styles.dishHeaderRow}>
                      <Text style={styles.dishTitle}>{item.name}</Text>
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>GOURMET</Text>
                      </View>
                    </View>
                    <Text style={styles.dishDesc} numberOfLines={2}>
                      {item.description || 'Exquisito platillo gourmet preparado con ingredientes seleccionados.'}
                    </Text>
                    <View style={styles.dishFooterRow}>
                      <View style={styles.prepTimeRow}>
                        <PremiumIcon name="clock" size={12} color="#94a3b8" />
                        <Text style={styles.prepTimeText}>{item.prepTimeMinutes || 15} min</Text>
                      </View>
                      <Text style={styles.priceTag}>RD${item.price.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heroWrapper: {
    marginBottom: 20,
  },
  heroBg: {
    height: 190,
    width: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroGradient: {
    backgroundColor: 'rgba(9, 10, 15, 0.75)',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTagline: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  heroSub: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 4,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#d4af37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 10,
  },
  heroCtaText: {
    color: '#090a0f',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroCtaIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(9, 10, 15, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#d4af37',
  },
  categorySection: {
    marginBottom: 20,
  },
  categorySlider: {
    gap: 14,
  },
  categoryCircleItem: {
    alignItems: 'center',
  },
  categoryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0f111a',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCircleActive: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  categoryLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  categoryLabelActive: {
    color: '#d4af37',
    fontWeight: '900',
  },
  activeUnderline: {
    width: 12,
    height: 2,
    backgroundColor: '#d4af37',
    borderRadius: 1,
    marginTop: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleSerif: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: '#d4af37',
    fontSize: 11,
    fontWeight: '800',
  },
  recommendedSlider: {
    gap: 12,
    marginBottom: 20,
  },
  recommendedCard: {
    width: 160,
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 110,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(9, 10, 15, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedCardBody: {
    padding: 12,
  },
  recommendedTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  recommendedSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  recommendedPrice: {
    color: '#d4af37',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
  },
  degustacionWrapper: {
    marginBottom: 20,
  },
  degustacionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
    padding: 12,
    gap: 12,
  },
  degustacionImg: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  degustacionContent: {
    flex: 1,
  },
  degustacionTag: {
    color: '#d4af37',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  degustacionTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  degustacionPrice: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },
  degustacionArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullCatalogSection: {
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f111a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
  },
  categoryTitleHeader: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  dishesGrid: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
  emptySub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    overflow: 'hidden',
    padding: 12,
    gap: 12,
  },
  dishImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  dishDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },
  tagBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  tagText: {
    color: '#d4af37',
    fontSize: 8,
    fontWeight: '900',
  },
  dishDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
  },
  dishFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prepTimeText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  priceTag: {
    color: '#d4af37',
    fontSize: 14,
    fontWeight: '900',
  },
});

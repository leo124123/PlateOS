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
    favorite: true,
  },
  {
    id: 'rec-2',
    name: 'Rack de Cordero',
    description: 'Costra de hierbas, puré de coliflor y reducción de vino tinto.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    favorite: true,
  },
  {
    id: 'rec-3',
    name: 'Tagliatelle al Tartufo',
    description: 'Salsa cremosa de parmesano y trufa negra fresca.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
    favorite: false,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  ENTRADAS: '🍱',
  'PLATOS FUERTES': '🥩',
  POSTRES: '🍰',
  BEBIDAS: '🍸',
  'CHEF ESPECIALES': '👨‍🍳',
};

export const DigitalMenu: React.FC = () => {
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                imageStyle={{ borderRadius: 28 }}
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
                      <Text style={styles.heroCtaArrow}>❯</Text>
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
            const iconEmoji = CATEGORY_ICONS[cat.name.toUpperCase()] || '🍽️';

            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCircleItem}
                onPress={() => setSelectedCatId(cat.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryCircle, isActive && styles.categoryCircleActive]}>
                  <Text style={styles.categoryEmoji}>{iconEmoji}</Text>
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

      {/* ── 3. RECOMENDADOS PARA TI CAROUSEL ── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleSerif}>Recomendados para ti</Text>
        <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Ver todo</Text>
          <Text style={styles.seeAllArrow}>❯</Text>
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
                <Text style={styles.favHeart}>{isFav ? '❤️' : '🤍'}</Text>
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
            <Text style={styles.degustacionArrow}>❯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 5. FULL MENU CATALOG LIST ── */}
      <View style={styles.fullCatalogSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar platillo o ingrediente..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.categoryTitleHeader}>{activeCategory?.name || 'Menú Digital'}</Text>

        <View style={styles.dishesGrid}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
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
                        <Text style={styles.prepTimeIcon}>⏱️</Text>
                        <Text style={styles.prepTimeText}>{item.prepTimeMinutes || 15} min</Text>
                      </View>
                      <Text style={styles.priceTag}>RD${item.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.viewOnlyBadge}>
                      <Text style={styles.viewOnlyText}>Consulta el menú y solicita tu pedido con el mesero</Text>
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
    backgroundColor: '#090a0f',
  },

  /* HERO SECTION */
  heroWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  heroBg: {
    height: 310,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroGradient: {
    backgroundColor: 'rgba(9, 10, 15, 0.72)',
    padding: 20,
    borderRadius: 28,
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroTagline: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'serif',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSub: {
    color: '#a0a5b5',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 16,
    maxWidth: '85%',
  },
  heroCtaBtn: {
    backgroundColor: '#d4af37',
    borderRadius: 24,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 12,
  },
  heroCtaText: {
    color: '#090a0f',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  heroCtaIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#090a0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCtaArrow: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: '900',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dotActive: {
    backgroundColor: '#d4af37',
    width: 16,
  },

  /* CATEGORY CIRCLE ROW */
  categorySection: {
    marginBottom: 24,
  },
  categorySlider: {
    paddingHorizontal: 20,
    gap: 18,
  },
  categoryCircleItem: {
    alignItems: 'center',
    width: 76,
  },
  categoryCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#12141d',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryCircleActive: {
    borderColor: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    color: '#7e8494',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  categoryLabelActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  activeUnderline: {
    width: 20,
    height: 2,
    backgroundColor: '#d4af37',
    borderRadius: 1,
    marginTop: 4,
  },

  /* RECOMENDADOS SECTION */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitleSerif: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'serif',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: '#d4af37',
    fontSize: 12,
    fontWeight: '700',
  },
  seeAllArrow: {
    color: '#d4af37',
    fontSize: 10,
  },
  recommendedSlider: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 10,
  },
  recommendedCard: {
    width: 200,
    backgroundColor: '#12141d',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#1a1d29',
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(9, 10, 15, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favHeart: {
    fontSize: 14,
  },
  recommendedCardBody: {
    padding: 12,
  },
  recommendedTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  recommendedSub: {
    color: '#7e8494',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 10,
    height: 28,
  },
  recommendedPrice: {
    color: '#d4af37',
    fontSize: 15,
    fontWeight: '900',
  },

  /* DEGUSTACIÓN BANNER */
  degustacionWrapper: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  degustacionCard: {
    backgroundColor: '#12141d',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  degustacionImg: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: '#1a1d29',
  },
  degustacionContent: {
    flex: 1,
  },
  degustacionTag: {
    color: '#d4af37',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  degustacionTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    lineHeight: 16,
  },
  degustacionPrice: {
    color: '#d4af37',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },
  degustacionArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  degustacionArrow: {
    color: '#d4af37',
    fontSize: 12,
  },

  /* FULL CATALOG SECTION */
  fullCatalogSection: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141d',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  clearSearchText: {
    color: '#7e8494',
    fontSize: 14,
    fontWeight: '900',
  },
  categoryTitleHeader: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'serif',
    marginBottom: 14,
  },
  dishesGrid: {
    gap: 14,
  },
  emptyCard: {
    backgroundColor: '#12141d',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    padding: 30,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
  },
  emptySub: {
    color: '#7e8494',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  dishCard: {
    backgroundColor: '#12141d',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  dishImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#1a1d29',
  },
  dishDetails: {
    flex: 1,
  },
  dishHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    flex: 1,
  },
  tagBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  tagText: {
    color: '#d4af37',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dishDesc: {
    fontSize: 11,
    color: '#7e8494',
    marginTop: 3,
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
  prepTimeIcon: {
    fontSize: 11,
  },
  prepTimeText: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '800',
  },
  priceTag: {
    fontSize: 15,
    fontWeight: '900',
    color: '#d4af37',
  },
  viewOnlyBadge: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  viewOnlyText: {
    color: '#7e8494',
    fontSize: 9,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

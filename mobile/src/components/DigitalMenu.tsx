import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useClientStore } from '../store/useClientStore';

const GOURMET_IMAGES: Record<string, string> = {
  'Carpaccio de Res Trufado':
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
  'Ceviche de Pulpo al Olivo':
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80',
  'Empanaditas de Mariscos (4ud)':
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80',
  'Ribeye Steak Prime 400g':
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80',
  'Salmón Glaseado al Maracuyá':
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
  'Risotto de Hongos Porcini':
    'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=500&q=80',
  'Volcán de Chocolate con Helado':
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
  'Cheesecake de Frutos Rojos':
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80',
  'Cocktail Smoked Old Fashioned':
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80',
  'Copa de Vino Tinto Reserva':
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80';

export const DigitalMenu: React.FC = () => {
  const { categories, cart, addToCart, updateCartQuantity } = useClientStore();
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const filteredItems =
    activeCategory?.items?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  const getItemCartQty = (itemId: string) => {
    const found = cart.find((i) => i.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en la carta gourmet..."
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

      {/* Gourmet Categories Horizontal Slider */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesSlider}
        >
          {categories.map((cat) => {
            const isActive = selectedCatId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => {
                  setSelectedCatId(cat.id);
                  setSearchQuery('');
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.catText, isActive && styles.catTextActive]}>
                  {cat.name}
                </Text>
                {cat.items && cat.items.length > 0 && (
                  <View style={[styles.catBadge, isActive && styles.catBadgeActive]}>
                    <Text style={[styles.catBadgeText, isActive && styles.catBadgeTextActive]}>
                      {cat.items.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Gourmet Dishes List */}
      <ScrollView
        contentContainerStyle={styles.dishesGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Sin platillos disponibles</Text>
            <Text style={styles.emptySub}>Prueba seleccionando otra categoría o limpiando tu búsqueda.</Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const qty = getItemCartQty(item.id);
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
                    <Text style={styles.priceTag}>${item.price.toFixed(2)}</Text>
                  </View>

                  {/* View-only Menu Details */}
                  <View style={styles.viewOnlyBadge}>
                    <Text style={styles.viewOnlyText}>Consulta el menú y solicita tu pedido con el mesero</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  clearSearchText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '900',
    padding: 4,
  },
  categoriesWrapper: {
    marginBottom: 8,
  },
  categoriesSlider: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 6,
  },
  catPill: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catPillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  catText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
  },
  catTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  catBadge: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  catBadgeActive: {
    backgroundColor: '#0f172a',
  },
  catBadgeText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '900',
  },
  catBadgeTextActive: {
    color: '#f59e0b',
  },
  dishesGrid: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    gap: 14,
  },
  emptyCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
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
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  dishCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  dishImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#1e293b',
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  tagText: {
    color: '#f59e0b',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dishDesc: {
    fontSize: 11,
    color: '#94a3b8',
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
    fontSize: 16,
    fontWeight: '900',
    color: '#f59e0b',
  },
  viewOnlyBadge: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  viewOnlyText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

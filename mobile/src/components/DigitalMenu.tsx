import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { Search, Plus, Minus, Utensils, Clock, ShoppingBag } from 'lucide-react-native';
import { useClientStore } from '../store/useClientStore';
import { MenuItem } from '../types';

const GOURMET_IMAGES: Record<string, string> = {
  'Carpaccio de Res Trufado': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
  'Ceviche de Pulpo al Olivo': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80',
  'Empanaditas de Mariscos (4ud)': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80',
  'Ribeye Steak Prime 400g': 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80',
  'Salmón Glaseado al Maracuyá': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
  'Risotto de Hongos Porcini': 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=500&q=80',
  'Volcán de Chocolate con Helado': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
  'Cheesecake de Frutos Rojos': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80',
  'Cocktail Smoked Old Fashioned': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80',
  'Copa de Vino Tinto Reserva': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80';

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
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#f59e0b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar platillo por nombre..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills Slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryPill,
              selectedCatId === cat.id && styles.categoryPillActive,
            ]}
            onPress={() => {
              setSelectedCatId(cat.id);
              setSearchQuery('');
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCatId === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items List */}
      <ScrollView contentContainerStyle={styles.menuGrid} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Utensils size={40} color="#334155" />
            <Text style={styles.emptyText}>No se encontraron platillos en esta categoría</Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const qty = getItemCartQty(item.id);
            const imageUri = item.imageUrl || GOURMET_IMAGES[item.name] || DEFAULT_IMAGE;

            return (
              <View key={item.id} style={styles.card}>
                <Image source={{ uri: imageUri }} style={styles.cardImage} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description || 'Exquisito platillo gourmet preparado con ingredientes selectos.'}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.prepText}>⏱️ {item.prepTimeMinutes || 15}m prep</Text>
                    <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                  </View>

                  {/* Actions */}
                  {qty === 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                      <Plus size={14} color="#0f172a" />
                      <Text style={styles.addButtonText}>Agregar</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateCartQuantity(item.id, -1)}
                      >
                        <Minus size={14} color="#ffffff" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateCartQuantity(item.id, 1)}
                      >
                        <Plus size={14} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#ffffff',
    fontSize: 13,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  categoryPillActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
  },
  categoryTextActive: {
    color: '#0f172a',
  },
  menuGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 15,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  prepText: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '700',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#f59e0b',
  },
  addButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 11,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignSelf: 'flex-start',
    marginTop: 8,
    padding: 2,
    gap: 8,
  },
  qtyButton: {
    padding: 4,
    backgroundColor: '#1e293b',
    borderRadius: 6,
  },
  qtyText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
    paddingHorizontal: 4,
  },
});

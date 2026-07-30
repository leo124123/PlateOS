import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useClientStore } from '../store/useClientStore';

export const OrderTracker: React.FC = () => {
  const {
    cart,
    activeOrder,
    connectedTable,
    customerName,
    setCustomerName,
    updateCartQuantity,
    removeFromCart,
    submitOrder,
    requestBill,
    orderSuccessMessage,
  } = useClientStore();

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateSubtotal = () =>
    cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmit = async () => {
    if (cart.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    await submitOrder(notes);
    setIsSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── SECTION 1: LIVE ACTIVE ORDER IN KITCHEN ── */}
      {activeOrder && (
        <View style={styles.activeOrderCard}>
          <View style={styles.activeOrderHeader}>
            <View>
              <Text style={styles.activeOrderTitle}>Pedido #{activeOrder.orderNumber}</Text>
              <Text style={styles.activeOrderSub}>Mesa #{connectedTable?.number}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{activeOrder.status}</Text>
            </View>
          </View>

          {/* Timeline Status */}
          <View style={styles.timelineRow}>
            {['PENDING', 'IN_PREPARATION', 'READY_FOR_DELIVERY', 'SERVED'].map((st, idx) => {
              const currentIdx = ['PENDING', 'IN_PREPARATION', 'READY_FOR_DELIVERY', 'SERVED'].indexOf(activeOrder.status);
              const isActive = idx <= currentIdx;

              return (
                <View key={st} style={styles.timelineStep}>
                  <View style={[styles.timelineDot, isActive && styles.timelineDotActive]} />
                  <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>
                    {st === 'PENDING' ? '📝 Marchado' : st === 'IN_PREPARATION' ? '👨‍🍳 Cocina' : st === 'READY_FOR_DELIVERY' ? '✅ ¡Listo!' : '🍽️ En Mesa'}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Order Items Summary */}
          <View style={styles.itemsList}>
            {activeOrder.items?.map((item, idx) => (
              <View key={idx} style={styles.activeItemRow}>
                <Text style={styles.activeItemQty}>{item.quantity}x</Text>
                <Text style={styles.activeItemName}>{item.menuItem?.name || 'Platillo'}</Text>
                <Text style={styles.activeItemPrice}>${(item.quantity * item.unitPrice).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Comanda:</Text>
            <Text style={styles.totalValue}>${activeOrder.total.toFixed(2)}</Text>
          </View>

          {/* Request Bill Action */}
          <TouchableOpacity
            style={[styles.billButton, connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonDone]}
            onPress={requestBill}
            disabled={connectedTable?.status === 'BILL_REQUESTED'}
          >
            <Text style={[styles.billButtonText, connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonTextDone]}>
              {connectedTable?.status === 'BILL_REQUESTED' ? '✓ CUENTA SOLICITADA A CAJA' : '💳 SOLICITAR LA CUENTA'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── SECTION 2: CART & CHECKOUT ── */}
      <View style={styles.cartCard}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartIcon}>🛒</Text>
          <Text style={styles.cartTitle}>Comanda Actual en Mesa</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>No tienes platillos en el carrito aún.</Text>
            <Text style={styles.emptyCartSub}>Selecciona platillos del Menú Digital para agregarlos.</Text>
          </View>
        ) : (
          <View>
            {/* Customer Name */}
            <TextInput
              style={styles.input}
              placeholder="Tu Nombre (Opcional)"
              placeholderTextColor="#64748b"
              value={customerName}
              onChangeText={setCustomerName}
            />

            {/* Cart Items */}
            {cart.map((item) => (
              <View key={item.menuItem.id} style={styles.cartItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartItemName}>{item.menuItem.name}</Text>
                  <Text style={styles.cartItemPrice}>
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQuantity(item.menuItem.id, -1)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyVal}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQuantity(item.menuItem.id, 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Kitchen Notes */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notas para cocina (ej. Sin cebolla, término medio...)"
              placeholderTextColor="#64748b"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* Totals */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Impuestos (18%):</Text>
                <Text style={styles.summaryVal}>${tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text style={styles.summaryTotalLabel}>Total:</Text>
                <Text style={styles.summaryTotalVal}>${total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Submit Order Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? '⏳ ENVIANDO A COCINA...' : '📤 ENVIAR COMANDA A COCINA'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  activeOrderCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#38bdf8',
    padding: 20,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  activeOrderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  activeOrderSub: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '800',
  },
  statusPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  statusPillText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#334155',
    marginBottom: 6,
  },
  timelineDotActive: {
    backgroundColor: '#10b981',
  },
  timelineText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
  },
  timelineTextActive: {
    color: '#10b981',
  },
  itemsList: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    marginVertical: 10,
  },
  activeItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeItemQty: {
    color: '#f59e0b',
    fontWeight: '900',
    fontSize: 12,
    width: 24,
  },
  activeItemName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  activeItemPrice: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
  },
  totalValue: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '900',
  },
  billButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  billButtonDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  billButtonText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
  },
  billButtonTextDone: {
    color: '#10b981',
  },
  cartCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cartIcon: {
    fontSize: 20,
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyCartText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCartSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#020617',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 10,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  cartItemName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  cartItemPrice: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    backgroundColor: '#1e293b',
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  qtyVal: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  summaryContainer: {
    marginVertical: 14,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  summaryVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  summaryTotalLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  summaryTotalVal: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '900',
  },
  submitBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

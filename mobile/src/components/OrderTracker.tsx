import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useClientStore } from '../store/useClientStore';

export const OrderTracker: React.FC = () => {
  const { activeOrder, connectedTable, requestBill } = useClientStore();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── SECTION 1: LIVE ACTIVE ORDER IN KITCHEN ── */}
      {activeOrder ? (
        <View style={styles.activeOrderCard}>
          <View style={styles.activeOrderHeader}>
            <View>
              <Text style={styles.activeOrderTitle}>Comanda #{activeOrder.orderNumber}</Text>
              <Text style={styles.activeOrderSub}>Mesa #{connectedTable?.number} • En Proceso</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{activeOrder.status}</Text>
            </View>
          </View>

          {/* Timeline Status */}
          <View style={styles.timelineRow}>
            {['PENDING', 'IN_PREPARATION', 'READY_FOR_DELIVERY', 'SERVED'].map((st, idx) => {
              const currentIdx = ['PENDING', 'IN_PREPARATION', 'READY_FOR_DELIVERY', 'SERVED'].indexOf(
                activeOrder.status
              );
              const isActive = idx <= currentIdx;

              return (
                <View key={st} style={styles.timelineStep}>
                  <View style={[styles.timelineDot, isActive && styles.timelineDotActive]} />
                  <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>
                    {st === 'PENDING'
                      ? '📝 Marchado'
                      : st === 'IN_PREPARATION'
                      ? '👨‍🍳 Cocina'
                      : st === 'READY_FOR_DELIVERY'
                      ? '✅ ¡Listo!'
                      : '🍽️ En Mesa'}
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
                <Text style={styles.activeItemPrice}>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Comanda:</Text>
            <Text style={styles.totalValue}>${activeOrder.total.toFixed(2)}</Text>
          </View>

          {/* Request Bill Action */}
          <TouchableOpacity
            style={[
              styles.billButton,
              connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonDone,
            ]}
            onPress={requestBill}
            disabled={connectedTable?.status === 'BILL_REQUESTED'}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.billButtonText,
                connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonTextDone,
              ]}
            >
              {connectedTable?.status === 'BILL_REQUESTED'
                ? '✓ CUENTA SOLICITADA A CAJA'
                : '💳 SOLICITAR LA CUENTA'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── SECTION 2: NO ACTIVE ORDER / TABLE STATUS ── */
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusEmoji}>📋</Text>
            <Text style={styles.statusTitle}>Mesa #{connectedTable?.number} Conectada</Text>
            <Text style={styles.statusSub}>
              Consulta nuestro menú digital en la pestaña anterior. Las comandas son tomadas directamente por el mesero en tu mesa.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.billButton,
              connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonDone,
            ]}
            onPress={requestBill}
            disabled={connectedTable?.status === 'BILL_REQUESTED'}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.billButtonText,
                connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonTextDone,
              ]}
            >
              {connectedTable?.status === 'BILL_REQUESTED'
                ? '✓ CUENTA SOLICITADA A CAJA'
                : '💳 SOLICITAR LA CUENTA'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    padding: 20,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
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
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 12,
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
    borderRadius: 18,
    padding: 14,
    gap: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
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
    borderRadius: 16,
    paddingVertical: 14,
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
    fontSize: 13,
    fontWeight: '900',
  },
  billButtonTextDone: {
    color: '#10b981',
  },
  statusCard: {
    backgroundColor: '#0f172a',
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    padding: 24,
    gap: 16,
  },
  statusCardHeader: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 40,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 10,
  },
  statusSub: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

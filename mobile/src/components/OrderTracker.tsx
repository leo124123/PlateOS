import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { PremiumIcon } from './common/PremiumIcon';

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

              let iconName: 'clock' | 'chef' | 'check' | 'utensils' = 'clock';
              let label = 'Marchado';
              if (st === 'IN_PREPARATION') {
                iconName = 'chef';
                label = 'Cocina';
              } else if (st === 'READY_FOR_DELIVERY') {
                iconName = 'check';
                label = '¡Listo!';
              } else if (st === 'SERVED') {
                iconName = 'utensils' as any;
                label = 'En Mesa';
              }

              return (
                <View key={st} style={styles.timelineStep}>
                  <View style={[styles.timelineDot, isActive && styles.timelineDotActive]}>
                    <PremiumIcon
                      name={isActive ? 'check' : 'clock'}
                      size={10}
                      color={isActive ? '#090a0f' : '#64748b'}
                    />
                  </View>
                  <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>
                    {label}
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
            <PremiumIcon
              name={connectedTable?.status === 'BILL_REQUESTED' ? 'check' : 'credit-card'}
              size={16}
              color={connectedTable?.status === 'BILL_REQUESTED' ? '#10b981' : '#090a0f'}
            />
            <Text
              style={[
                styles.billButtonText,
                connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonTextDone,
              ]}
            >
              {connectedTable?.status === 'BILL_REQUESTED'
                ? 'CUENTA SOLICITADA A CAJA'
                : 'SOLICITAR LA CUENTA'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── SECTION 2: NO ACTIVE ORDER / TABLE STATUS ── */
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <View style={styles.statusIconCircle}>
              <PremiumIcon name="user" size={32} color="#d4af37" />
            </View>
            <Text style={styles.statusTitle}>Mesa #{connectedTable?.number} Conectada</Text>
            <Text style={styles.statusSub}>
              Consulta nuestra Carta Digital en la pestaña Menú. Las comandas activas y el avance de cocina aparecerán automáticamente en esta sección.
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
            <PremiumIcon
              name={connectedTable?.status === 'BILL_REQUESTED' ? 'check' : 'credit-card'}
              size={16}
              color={connectedTable?.status === 'BILL_REQUESTED' ? '#10b981' : '#090a0f'}
            />
            <Text
              style={[
                styles.billButtonText,
                connectedTable?.status === 'BILL_REQUESTED' && styles.billButtonTextDone,
              ]}
            >
              {connectedTable?.status === 'BILL_REQUESTED'
                ? 'CUENTA SOLICITADA A CAJA'
                : 'SOLICITAR LA CUENTA'}
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
    paddingTop: 14,
    paddingBottom: 130,
    gap: 16,
  },
  activeOrderCard: {
    backgroundColor: '#0f111a',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#d4af37',
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
    color: '#d4af37',
    fontWeight: '800',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statusPillText: {
    color: '#d4af37',
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineDotActive: {
    backgroundColor: '#d4af37',
  },
  timelineText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
  },
  timelineTextActive: {
    color: '#d4af37',
    fontWeight: '900',
  },
  itemsList: {
    backgroundColor: '#090a0f',
    borderRadius: 18,
    padding: 14,
    gap: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeItemQty: {
    color: '#d4af37',
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
    backgroundColor: '#d4af37',
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
    color: '#090a0f',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  billButtonTextDone: {
    color: '#10b981',
  },
  statusCard: {
    backgroundColor: '#0f111a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    padding: 24,
    gap: 16,
  },
  statusCardHeader: {
    alignItems: 'center',
  },
  statusIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 6,
  },
  statusSub: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

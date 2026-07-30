import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useClientStore } from '../store/useClientStore';

export const CallWaiterButton: React.FC = () => {
  const {
    isCallWaiterActive,
    isWaiterOnTheWay,
    showArrivalCheck,
    callWaiter,
    confirmWaiterArrived,
    connectedTable,
  } = useClientStore();

  if (!connectedTable) return null;

  return (
    <View style={styles.container}>
      {showArrivalCheck ? (
        <View style={styles.arrivalCard}>
          <View style={styles.arrivalHeader}>
            <Text style={styles.arrivalIcon}>❓</Text>
            <View style={styles.textColumn}>
              <Text style={styles.arrivalTitle}>¿EL MESERO YA LLEGÓ A TU MESA?</Text>
              <Text style={styles.arrivalSub}>
                Han pasado 25s desde que el mesero confirmó que venía de camino.
              </Text>
            </View>
          </View>
          <View style={styles.arrivalActionsRow}>
            <TouchableOpacity
              style={styles.arrivalBtnYes}
              onPress={confirmWaiterArrived}
              activeOpacity={0.8}
            >
              <Text style={styles.arrivalBtnYesText}>✅ Sí, ya llegó</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.arrivalBtnReCall}
              onPress={callWaiter}
              activeOpacity={0.8}
            >
              <Text style={styles.arrivalBtnReCallText}>🛎️ Volver a llamar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            isWaiterOnTheWay && styles.buttonOnTheWay,
            isCallWaiterActive && !isWaiterOnTheWay && styles.buttonActive,
          ]}
          onPress={callWaiter}
          activeOpacity={0.8}
        >
          {isWaiterOnTheWay ? (
            <>
              <View style={styles.iconCircleOnTheWay}>
                <Text style={styles.iconEmoji}>🏃</Text>
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.buttonTitleOnTheWay}>🏃 EL MESERO VA DE CAMINO</Text>
                <Text style={styles.buttonSubOnTheWay}>
                  El mesero va de camino a tu mesa, espera unos minutos por favor.
                </Text>
              </View>
            </>
          ) : isCallWaiterActive ? (
            <>
              <Text style={styles.iconEmoji}>✅</Text>
              <View style={styles.textColumn}>
                <Text style={styles.buttonTitleActive}>¡Solicitud Enviada!</Text>
                <Text style={styles.buttonSubActive}>
                  Notificando al mesero de la Mesa #{connectedTable.number}...
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>🛎️</Text>
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.buttonTitle}>🛎️ LLAMAR AL MESERO</Text>
                <Text style={styles.buttonSub}>
                  Solicita atención inmediata en la Mesa #{connectedTable.number}
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonActive: {
    backgroundColor: '#e11d48',
    borderColor: '#f43f5e',
    shadowColor: '#f43f5e',
  },
  buttonOnTheWay: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
    shadowColor: '#10b981',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleOnTheWay: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  textColumn: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#f59e0b',
    letterSpacing: 0.5,
  },
  buttonSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  buttonTitleActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  buttonSubActive: {
    fontSize: 10,
    color: '#ffe4e6',
    marginTop: 2,
  },
  buttonTitleOnTheWay: {
    fontSize: 13,
    fontWeight: '900',
    color: '#34d399',
    letterSpacing: 0.5,
  },
  buttonSubOnTheWay: {
    fontSize: 10,
    color: '#a7f3d0',
    marginTop: 2,
  },
  arrivalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    padding: 14,
    gap: 12,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  arrivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrivalIcon: {
    fontSize: 24,
  },
  arrivalTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f59e0b',
    letterSpacing: 0.5,
  },
  arrivalSub: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 2,
  },
  arrivalActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  arrivalBtnYes: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalBtnYesText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 11,
  },
  arrivalBtnReCall: {
    flex: 1,
    backgroundColor: '#e11d48',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalBtnReCallText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11,
  },
});

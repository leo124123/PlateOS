import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useClientStore } from '../store/useClientStore';
import { PremiumIcon } from './common/PremiumIcon';

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
            <View style={styles.arrivalIconBox}>
              <PremiumIcon name="chef" size={20} color="#d4af37" />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.arrivalTitle}>¿EL MESERO YA LLEGÓ A TU MESA?</Text>
              <Text style={styles.arrivalSub}>
                El mesero ha notificado que se dirige a la Mesa #{connectedTable.number}.
              </Text>
            </View>
          </View>
          <View style={styles.arrivalActionsRow}>
            <TouchableOpacity
              style={styles.arrivalBtnYes}
              onPress={confirmWaiterArrived}
              activeOpacity={0.8}
            >
              <PremiumIcon name="check" size={14} color="#090a0f" />
              <Text style={styles.arrivalBtnYesText}>Sí, ya llegó</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.arrivalBtnReCall}
              onPress={callWaiter}
              activeOpacity={0.8}
            >
              <PremiumIcon name="bell" size={14} color="#ffffff" />
              <Text style={styles.arrivalBtnReCallText}>Volver a llamar</Text>
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
                <PremiumIcon name="zap" size={20} color="#10b981" />
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.buttonTitleOnTheWay}>EL MESERO VA DE CAMINO</Text>
                <Text style={styles.buttonSubOnTheWay}>
                  El mesero se dirige a tu mesa.
                </Text>
              </View>
            </>
          ) : isCallWaiterActive ? (
            <>
              <View style={styles.iconCircleActive}>
                <PremiumIcon name="check" size={20} color="#ffffff" />
              </View>
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
                <PremiumIcon name="bell" size={20} color="#d4af37" />
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.buttonTitle}>LLAMAR AL MESERO</Text>
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
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonActive: {
    backgroundColor: '#991b1b',
    borderColor: '#ef4444',
  },
  buttonOnTheWay: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  iconCircleActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleOnTheWay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#d4af37',
    letterSpacing: 1,
  },
  buttonSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  buttonTitleActive: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  buttonSubActive: {
    fontSize: 10,
    color: '#fca5a5',
    marginTop: 2,
  },
  buttonTitleOnTheWay: {
    fontSize: 12,
    fontWeight: '900',
    color: '#34d399',
    letterSpacing: 1,
  },
  buttonSubOnTheWay: {
    fontSize: 10,
    color: '#a7f3d0',
    marginTop: 2,
  },
  arrivalCard: {
    backgroundColor: '#0f111a',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    padding: 14,
    gap: 12,
  },
  arrivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrivalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrivalTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#d4af37',
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
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalBtnYesText: {
    color: '#090a0f',
    fontWeight: '900',
    fontSize: 11,
  },
  arrivalBtnReCall: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
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

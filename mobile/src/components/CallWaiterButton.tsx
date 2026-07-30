import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useClientStore } from '../store/useClientStore';

export const CallWaiterButton: React.FC = () => {
  const { isCallWaiterActive, callWaiter, connectedTable } = useClientStore();

  if (!connectedTable) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isCallWaiterActive && styles.buttonActive]}
        onPress={callWaiter}
        activeOpacity={0.8}
      >
        {isCallWaiterActive ? (
          <>
            <Text style={styles.iconEmoji}>✅</Text>
            <View style={styles.textColumn}>
              <Text style={styles.buttonTitleActive}>¡Mozo Notificado!</Text>
              <Text style={styles.buttonSubActive}>
                Un mesero viene en camino a la Mesa #{connectedTable.number}
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
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
});

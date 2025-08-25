import React from 'react';
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function MetalTile({ title, subtitle, price, unit, time, loading, error, onPress, onRetry }) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={({pressed})=>[styles.card, pressed && {opacity:0.85}]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <View style={{gap:6}}>
            <Text style={[styles.subtitle,{color:colors.danger}]}>Failed to load</Text>
            <Pressable onPress={onRetry} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{gap:4}}>
            <Text style={styles.price}>{price} <Text style={styles.unit}>{unit}</Text></Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, minHeight: 130, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.subtext, fontSize: 12 },
  body: { alignItems: 'flex-start', justifyContent: 'center' },
  price: { color: colors.text, fontSize: 22, fontWeight: '800' },
  unit: { color: colors.subtext, fontSize: 14, fontWeight: '600' },
  time: { color: colors.subtext, fontSize: 12 },
  retryBtn: { backgroundColor: colors.border, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  retryText: { color: colors.text, fontSize: 12, fontWeight: '700' }
});

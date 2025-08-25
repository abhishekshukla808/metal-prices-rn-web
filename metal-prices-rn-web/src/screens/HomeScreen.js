import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { METALS, fetchMetalPrice } from '../api/prices';
import MetalTile from '../components/MetalTile';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const [state, setState] = useState(() => {
    const s = {};
    METALS.forEach(m => s[m.key] = { loading: true, error: null, data: null });
    return s;
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadOne = async (metalKey) => {
    setState(prev => ({...prev, [metalKey]: {...prev[metalKey], loading: true, error: null }}));
    try {
      const data = await fetchMetalPrice(metalKey);
      setState(prev => ({...prev, [metalKey]: { loading:false, error:null, data }}));
    } catch (e) {
      setState(prev => ({...prev, [metalKey]: { loading:false, error: e.message, data: null }}));
    }
  };

  const initialLoad = useCallback(() => { METALS.forEach(m => loadOne(m.key)); }, []);
  useEffect(() => { initialLoad(); }, [initialLoad]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(METALS.map(m => loadOne(m.key)));
    setRefreshing(false);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding:16}} refreshControl={<RefreshControl tintColor={colors.text} refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.heading}>Live Precious Metals</Text>
      <Text style={styles.caption}>Prices shown are {METALS.map(m=>m.name).join(', ')} — tap a tile for details.</Text>
      <View style={styles.grid}>
        {METALS.map((m) => {
          const s = state[m.key];
          return (
            <View key={m.key} style={styles.gridItem}>
              <MetalTile
                title={m.name}
                subtitle={`${m.carat} (${m.symbol})`}
                price={s?.data?.price}
                unit={s?.data?.unit}
                time={s?.data?.time}
                loading={s.loading}
                error={s.error}
                onRetry={() => loadOne(m.key)}
                onPress={() => { if (!s.loading && !s.error && s.data) navigation.navigate('Details', { payload: s.data }); }}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.bg },
  heading: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  caption: { color: colors.subtext, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '48%' }
});

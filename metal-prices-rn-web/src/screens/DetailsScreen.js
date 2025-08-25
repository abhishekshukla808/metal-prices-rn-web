import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import { fetchMetalPrice } from '../api/prices';

export default function DetailsScreen({ route }) {
  const [data, setData] = useState(route.params?.payload);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = async () => {
    if (!data?.metal) return;
    setLoading(true); setError(null);
    try {
      const fresh = await fetchMetalPrice(data.metal);
      setData(fresh);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data?.metal?.toUpperCase()}</Text>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <View style={{gap:10}}>
            <Text style={[styles.label, {color:colors.danger}]}>Failed to refresh: {error}</Text>
            <Pressable onPress={reload} style={styles.btn}><Text style={styles.btnText}>Retry</Text></Pressable>
          </View>
        ) : (
          <View style={{gap:8}}>
            <Row label="Symbol" value={data?.symbol} />
            <Row label="Unit" value={data?.unit} />
            <Row label="Current Price" value={fmt(data?.price)} />
            <Row label="Previous Open" value={fmt(data?.previous_open)} />
            <Row label="Previous Close" value={fmt(data?.previous_close)} />
            <Row label="Today's Date" value={data?.date} />
            <Row label="Current Time" value={data?.time} />
          </View>
        )}
      </View>
      <Pressable onPress={reload} style={[styles.btn,{marginTop:12}]}><Text style={styles.btnText}>Refresh</Text></Pressable>
    </View>
  );
}

function fmt(n){ if (n == null || Number.isNaN(n)) return '—';
  return Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(+n);
}
function Row({label, value}){
  return (<View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>);
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.bg, padding:16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginBottom: 12 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth:1, borderRadius:16, padding:16 },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:8, borderBottomColor: colors.border, borderBottomWidth:1 },
  label: { color: colors.subtext, fontSize: 14 },
  value: { color: colors.text, fontSize: 16, fontWeight: '700' },
  btn: { backgroundColor: colors.accent, paddingHorizontal:16, paddingVertical:12, borderRadius:14, alignSelf:'flex-start' },
  btnText: { color:'#001428', fontWeight:'900' }
});

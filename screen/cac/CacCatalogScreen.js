import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fmt } from '../../cac/data';
import { useCac } from '../../cac/CacContext';
import { Btn, C, Screen } from '../../cac/ui';

export default function CacCatalogScreen({ navigation }) {
  const { products, cart, setQty, subtotal, count } = useCac();

  return (
    <Screen title="Catalogue" subtitle="Choisissez vos produits pour ce cycle" onBack={() => navigation.goBack()}>
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        renderItem={({ item: p }) => {
          const qty = cart[p.id] || 0;
          return (
            <View style={st.row}>
              <View style={st.ic}><Text style={{ fontSize: 22 }}>{p.emoji || '📦'}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={st.name}>{p.name}</Text>
                <Text style={st.sub}>{p.unit} · {fmt(p.price)}</Text>
              </View>
              <View style={st.stepper}>
                <TouchableOpacity style={st.stepBtn} onPress={() => setQty(p.id, qty - 1)} disabled={qty === 0}>
                  <Text style={[st.stepTxt, qty === 0 && { opacity: 0.3 }]}>−</Text>
                </TouchableOpacity>
                <Text style={st.qty}>{qty}</Text>
                <TouchableOpacity style={st.stepBtn} onPress={() => setQty(p.id, qty + 1)}>
                  <Text style={st.stepTxt}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <View style={st.footer}>
        <View style={{ flex: 1 }}>
          <Text style={st.sub}>{count} article{count > 1 ? 's' : ''}</Text>
          <Text style={st.total}>{fmt(subtotal)}</Text>
        </View>
        <Btn label="Continuer →" disabled={count === 0} onPress={() => navigation.navigate('CacCheckout')} style={{ paddingHorizontal: 24 }} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 12, marginBottom: 10 },
  ic: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: C.text },
  sub: { fontSize: 12, color: C.mute, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { color: C.green, fontSize: 18, fontWeight: '800' },
  qty: { minWidth: 24, textAlign: 'center', color: C.text, fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.bg },
  total: { fontSize: 20, fontWeight: '800', color: C.text },
});

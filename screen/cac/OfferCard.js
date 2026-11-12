import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { daysLeft, fmt, offerConfirmed, offerMissing, offerPct } from '../../cac/data';
import { C, Progress } from '../../cac/ui';

export default function OfferCard({ offer: o, onPress }) {
  const left = daysLeft(o);
  const ok = offerConfirmed(o);
  return (
    <TouchableOpacity onPress={onPress} style={st.card}>
      <View style={st.top}>
        <View style={st.ic}><Text style={{ fontSize: 24 }}>{o.emoji}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={st.name}>{o.name} · {o.unit}</Text>
          <Text style={st.sub}>{o.zone} · retrait {o.pickupPoint.replace('Point relais ', '')}</Text>
        </View>
        <View style={st.off}><Text style={st.offTxt}>-{offerPct(o)} %</Text></View>
      </View>
      <View style={st.priceRow}>
        <Text style={st.price}>{fmt(o.groupPrice)}</Text>
        <Text style={st.old}>{fmt(o.price)}</Text>
      </View>
      <Progress value={o.parts} max={o.minParts} />
      <View style={st.foot}>
        <Text style={[st.sub, ok && { color: C.green }]}>
          {ok ? `Lot confirmé · ${o.parts} parts` : `${o.parts} / ${o.minParts} parts · encore ${offerMissing(o)}`}
        </Text>
        <Text style={st.sub}>{left === null ? '' : left === 0 ? 'Dernier jour' : `J-${left}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ic: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: C.text },
  sub: { fontSize: 12, color: C.mute, marginTop: 2 },
  off: { backgroundColor: 'rgba(0,229,160,0.1)', borderWidth: 1, borderColor: 'rgba(0,229,160,0.25)', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  offTxt: { color: C.green, fontSize: 12, fontWeight: '800' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 12 },
  price: { fontSize: 18, fontWeight: '800', color: C.text },
  old: { fontSize: 12, color: C.dim, textDecorationLine: 'line-through' },
  foot: { flexDirection: 'row', justifyContent: 'space-between' },
});

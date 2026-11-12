import { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  MAX_PARTS_PER_HOUSEHOLD, daysLeft, fmt, offerConfirmed, offerMissing, offerPct, offerSaving,
} from '../../cac/data';
import { useCac } from '../../cac/CacContext';
import { Btn, C, Card, Progress, Screen } from '../../cac/ui';

export default function CacOfferScreen({ navigation, route }) {
  const { offers, setOfferParts } = useCac();
  const o = offers.find((x) => x.id === route.params?.offerId);
  const [parts, setParts] = useState(1);

  if (!o) {
    return (
      <Screen title="Offre introuvable" onBack={() => navigation.goBack()}>
        <Text style={{ color: C.mute, padding: 20 }}>Cette offre n'est plus disponible.</Text>
      </Screen>
    );
  }

  const left = daysLeft(o);
  const ok = offerConfirmed(o);
  const join = () => { setOfferParts(o.id, parts); navigation.navigate('CacCheckout'); };
  const share = async () => {
    const msg = `Sur ZuluConnect CAC : ${o.name} (${o.unit}) à ${fmt(o.groupPrice)} au lieu de ${fmt(o.price)}. `
      + (ok ? 'Le lot est confirmé, il est encore temps de rejoindre !' : `Il manque ${offerMissing(o)} parts pour lancer l'achat. Rejoins-moi !`);
    try { await Share.share({ message: msg }); } catch (e) { /* partage indisponible */ }
  };

  return (
    <Screen title={`${o.emoji} ${o.name}`} subtitle={`${o.unit} · ${o.supplier}`} onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card>
          <View style={st.priceRow}>
            <Text style={st.price}>{fmt(o.groupPrice)}</Text>
            <Text style={st.old}>{fmt(o.price)}</Text>
            <View style={st.off}><Text style={st.offTxt}>-{offerPct(o)} %</Text></View>
          </View>
          <Progress value={o.parts} max={o.minParts} />
          <Text style={[st.mute, ok && { color: C.green }]}>
            {ok
              ? `Lot confirmé : ${o.parts} parts réservées, l'achat est lancé. Vous pouvez encore rejoindre.`
              : `${o.parts} / ${o.minParts} parts réservées. Encore ${offerMissing(o)} pour lancer l'achat.`}
          </Text>
          <Text style={[st.mute, { marginTop: 6 }]}>
            {left === 0 ? 'Dernier jour pour rejoindre' : `Clôture dans ${left} jour${left > 1 ? 's' : ''}`} · retrait : {o.pickupPoint}
          </Text>
        </Card>

        <Card>
          <Text style={st.h}>Combien de parts ?</Text>
          <View style={st.stepper}>
            <TouchableOpacity style={st.stepBtn} onPress={() => setParts(Math.max(1, parts - 1))}><Text style={st.stepTxt}>−</Text></TouchableOpacity>
            <Text style={st.qty}>{parts}</Text>
            <TouchableOpacity style={st.stepBtn} onPress={() => setParts(Math.min(MAX_PARTS_PER_HOUSEHOLD, parts + 1))}><Text style={st.stepTxt}>+</Text></TouchableOpacity>
          </View>
          <Text style={st.save}>Vous économisez {fmt(offerSaving(o, parts))}</Text>
          <Text style={[st.mute, { marginTop: 4 }]}>Total : {fmt(o.groupPrice * parts)} · maximum {MAX_PARTS_PER_HOUSEHOLD} parts par ménage</Text>
        </Card>

        <Card>
          <Text style={st.h}>Comment ça marche</Text>
          <Text style={st.mute}>
            Vous payez d'avance votre part. Si le seuil de {o.minParts} parts est atteint avant la clôture, CAC achète le lot et vous le retirez au point relais.
            Sinon, vous êtes remboursé en totalité.
          </Text>
        </Card>

        <Btn label="Rejoindre ce lot" onPress={join} />
        <Btn label="📣 Inviter mes voisins" kind="ghost" onPress={share} style={{ marginTop: 10 }} />
        {o.demo ? <Text style={st.demo}>Offre de démonstration</Text> : null}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  price: { fontSize: 26, fontWeight: '800', color: C.text },
  old: { fontSize: 13, color: C.dim, textDecorationLine: 'line-through' },
  off: { backgroundColor: 'rgba(0,229,160,0.1)', borderWidth: 1, borderColor: 'rgba(0,229,160,0.25)', borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10 },
  offTxt: { color: C.green, fontSize: 12, fontWeight: '800' },
  mute: { fontSize: 12, color: C.mute, lineHeight: 18 },
  h: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { color: C.green, fontSize: 22, fontWeight: '800' },
  qty: { minWidth: 30, textAlign: 'center', color: C.text, fontSize: 20, fontWeight: '800' },
  save: { marginTop: 12, color: C.green, fontWeight: '700', fontSize: 14 },
  demo: { marginTop: 14, textAlign: 'center', fontSize: 10, color: C.gold },
});

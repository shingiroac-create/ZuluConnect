import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASKETS, currentTier, daysLeft, fmt } from '../../cac/data';
import { basketTotal, useCac } from '../../cac/CacContext';
import { Btn, C, Card, Label, Progress, Screen, Segment } from '../../cac/ui';

const TABS = ['Ménages', 'Entreprises & ONG'];

export default function CacHomeScreen({ navigation }) {
  const { cycle, products, loadBasket } = useCac();
  const [tab, setTab] = useState(TABS[0]);
  const { reached, next, max } = currentTier(cycle);
  const left = daysLeft(cycle);

  const pickBasket = (b) => {
    loadBasket(b.items);
    navigation.navigate('CacCatalog');
  };

  return (
    <Screen title="Achats groupés" subtitle="CAC Burundi · on achète ensemble, on paie moins" onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Segment options={TABS} value={tab} onChange={setTab} />

        {tab === TABS[0] ? (
          <View style={{ marginTop: 16 }}>
            <Card>
              <View style={st.row}>
                <Text style={st.cycleTitle}>{cycle.title}</Text>
                <View style={st.pill}><Text style={st.pillTxt}>{left === null ? 'Ouvert' : left === 0 ? 'Dernier jour' : `J-${left}`}</Text></View>
              </View>
              <Text style={st.mute}>{cycle.zone} · {cycle.participants} ménages inscrits</Text>
              <Progress value={cycle.participants} max={max} marks={(cycle.tiers || []).map((t) => t.households)} />
              <Text style={st.mute}>
                {reached ? `Palier atteint : -${reached.discountPct} % remboursé sur votre commande. ` : ''}
                {next
                  ? `Encore ${next.households - cycle.participants} ménages pour atteindre -${next.discountPct} %.`
                  : 'Tous les paliers sont atteints.'}
              </Text>
              {cycle.demo ? <Text style={st.demo}>Données de démonstration</Text> : null}
            </Card>

            <Label>Paniers familiaux</Label>
            {BASKETS.map((b) => (
              <TouchableOpacity key={b.id} onPress={() => pickBasket(b)}>
                <Card style={st.basket}>
                  <Text style={st.basketIc}>{b.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={st.basketName}>{b.name}</Text>
                    <Text style={st.mute}>{b.people}</Text>
                  </View>
                  <Text style={st.basketPrice}>{fmt(basketTotal(b, products))}</Text>
                </Card>
              </TouchableOpacity>
            ))}

            <Btn label="🛒 Composer ma commande" onPress={() => navigation.navigate('CacCatalog')} style={{ marginTop: 4 }} />
            <Btn label="📦 Mes commandes" kind="ghost" onPress={() => navigation.navigate('CacOrders')} style={{ marginTop: 10 }} />
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Card>
              <Text style={st.cycleTitle}>Approvisionnement pour les organisations</Text>
              <Text style={[st.mute, { marginTop: 8, lineHeight: 20 }]}>
                Bureaux, associations, ONG, projets et coopératives : une seule demande pour des produits
                alimentaires et d'entretien en volume, avec devis, facture et livraison planifiée.
              </Text>
            </Card>
            <Card>
              {['Devis sur mesure selon vos volumes', 'Livraison ponctuelle ou récurrente', 'Facture et conditions de paiement fixées par contrat'].map((t) => (
                <Text key={t} style={st.bullet}>✓  {t}</Text>
              ))}
            </Card>
            <Btn label="📝 Demander un devis" onPress={() => navigation.navigate('CacB2B')} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cycleTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  mute: { fontSize: 12, color: C.mute, lineHeight: 18 },
  pill: { backgroundColor: 'rgba(0,229,160,0.1)', borderWidth: 1, borderColor: 'rgba(0,229,160,0.25)', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  pillTxt: { color: C.green, fontSize: 11, fontWeight: '700' },
  demo: { marginTop: 8, fontSize: 10, color: C.gold },
  basket: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  basketIc: { fontSize: 28 },
  basketName: { fontSize: 15, fontWeight: '700', color: C.text },
  basketPrice: { fontSize: 13, fontWeight: '700', color: C.green },
  bullet: { color: C.text, fontSize: 13, marginBottom: 8 },
});

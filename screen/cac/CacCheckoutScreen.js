import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { DELIVERY_FEE, PAYMENT_METHODS, PICKUP_POINTS, fmt } from '../../cac/data';
import { useCac } from '../../cac/CacContext';
import { placeOrder } from '../../cac/services';
import { Btn, C, Card, Choice, Field, Label, Screen } from '../../cac/ui';

export default function CacCheckoutScreen({ navigation }) {
  const { cycle, lines, subtotal, clearCart } = useCac();
  const [mode, setMode] = useState('Retrait');
  const [pickupPoint, setPickupPoint] = useState(PICKUP_POINTS[0]);
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [phone, setPhone] = useState('');
  const [referral, setReferral] = useState('');
  const [busy, setBusy] = useState(false);

  const delivery = mode === 'Livraison';
  const fee = delivery ? DELIVERY_FEE : 0;

  const submit = async () => {
    if (!phone.trim()) return Alert.alert('Numéro requis', `Indiquez votre numéro ${method}.`);
    if (delivery && !address.trim()) return Alert.alert('Adresse requise', 'Indiquez quartier, avenue et repère.');
    setBusy(true);
    try {
      const res = await placeOrder({
        cycle,
        lines,
        delivery: { mode: delivery ? 'delivery' : 'pickup', fee, pickupPoint, address: address.trim() },
        payment: { method, phone: phone.trim() },
        referralCode: referral,
      });
      clearCart();
      Alert.alert(
        'Commande enregistrée ✅',
        res.demo
          ? 'Mode démo : la commande est visible dans « Mes commandes » mais n’est pas envoyée.'
          : 'Elle sera confirmée dès réception du paiement. L’équipe CAC vous contacte au numéro indiqué.'
      );
      navigation.navigate('CacOrders');
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Impossible d’enregistrer la commande.');
    }
    setBusy(false);
  };

  return (
    <Screen title="Finaliser" subtitle={`${cycle.title} · ${cycle.zone}`} onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Card>
          {lines.map((l) => (
            <View key={l.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: C.text, fontSize: 13 }}>{l.qty} × {l.name} ({l.unit})</Text>
              <Text style={{ color: C.mute, fontSize: 13 }}>{fmt(l.price * l.qty)}</Text>
            </View>
          ))}
        </Card>

        <Label>Récupération</Label>
        <Choice options={['Retrait', 'Livraison']} value={mode} onChange={setMode} />
        {delivery ? (
          <Field label="Adresse de livraison" value={address} onChangeText={setAddress} placeholder="Quartier, avenue, repère" />
        ) : (
          <Choice options={PICKUP_POINTS} value={pickupPoint} onChange={setPickupPoint} />
        )}

        <Label>Paiement (commande prépayée)</Label>
        <Choice options={PAYMENT_METHODS} value={method} onChange={setMethod} />
        <Field label={`Numéro ${method}`} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+257 ..." />
        <Field label="Code promoteur (facultatif)" value={referral} onChangeText={setReferral} autoCapitalize="characters" placeholder="Code de la personne qui vous a invité" />

        <Card>
          <Row l="Sous-total" r={fmt(subtotal)} />
          <Row l={delivery ? 'Livraison' : 'Retrait'} r={fee ? fmt(fee) : 'Gratuit'} />
          <Row l="Total à payer" r={fmt(subtotal + fee)} bold />
          <Text style={{ color: C.mute, fontSize: 11, marginTop: 8, lineHeight: 16 }}>
            Si un palier de remise est atteint à la clôture du cycle, la différence vous est remboursée.
            En cas d’indisponibilité d’un produit, il est remboursé.
          </Text>
        </Card>

        <Btn label={busy ? '' : 'Confirmer la commande'} onPress={submit} disabled={busy || lines.length === 0} />
        {busy ? <ActivityIndicator color={C.green} style={{ marginTop: -34 }} /> : null}
      </ScrollView>
    </Screen>
  );
}

const Row = ({ l, r, bold }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
    <Text style={{ color: bold ? C.text : C.mute, fontWeight: bold ? '800' : '400', fontSize: bold ? 15 : 13 }}>{l}</Text>
    <Text style={{ color: bold ? C.green : C.text, fontWeight: bold ? '800' : '600', fontSize: bold ? 15 : 13 }}>{r}</Text>
  </View>
);

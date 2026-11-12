import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { auth } from '../../firebase';
import { B2B_FREQUENCIES, B2B_STATUS_LABEL, B2B_TYPES, fmt } from '../../cac/data';
import { submitB2BRequest, subscribeMyB2B } from '../../cac/services';
import { Btn, C, Card, Choice, Field, Label, Screen } from '../../cac/ui';

export default function CacB2BScreen({ navigation }) {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState(B2B_TYPES[0]);
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [needs, setNeeds] = useState('');
  const [budget, setBudget] = useState('');
  const [frequency, setFrequency] = useState(B2B_FREQUENCIES[1]);
  const [zone, setZone] = useState('Bujumbura');
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState([]);

  useEffect(() => subscribeMyB2B(setMine), []);

  const submit = async () => {
    if (!orgName.trim() || !contactName.trim() || !phone.trim() || !needs.trim()) {
      return Alert.alert('Champs requis', 'Organisation, contact, téléphone et besoins sont nécessaires.');
    }
    setBusy(true);
    try {
      const res = await submitB2BRequest({
        orgName: orgName.trim(), orgType, contactName: contactName.trim(), phone: phone.trim(),
        email: email.trim(), needs: needs.trim(), monthlyBudgetBIF: Number(budget.replace(/\D/g, '')) || null,
        frequency, zone: zone.trim(),
      });
      setNeeds(''); setBudget('');
      Alert.alert('Demande envoyée ✅', res.demo ? 'Mode démo : la demande n’est pas transmise.' : 'L’équipe CAC vous répond avec un devis.');
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Envoi impossible.');
    }
    setBusy(false);
  };

  return (
    <Screen title="Demande de devis" subtitle="Entreprises, associations, ONG, institutions" onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Field label="Nom de l'organisation" value={orgName} onChangeText={setOrgName} />
        <Text style={{ fontSize: 12, color: C.mute, marginBottom: 6 }}>Type</Text>
        <Choice options={B2B_TYPES} value={orgType} onChange={setOrgType} />
        <Field label="Personne de contact" value={contactName} onChangeText={setContactName} />
        <Field label="Téléphone / WhatsApp" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Produits et quantités souhaités" value={needs} onChangeText={setNeeds} multiline placeholder="Ex. 50 sacs de riz de 25 kg, 20 cartons d'huile..." />
        <Field label="Budget mensuel estimé (BIF, facultatif)" value={budget} onChangeText={setBudget} keyboardType="number-pad" />
        <Text style={{ fontSize: 12, color: C.mute, marginBottom: 6 }}>Fréquence</Text>
        <Choice options={B2B_FREQUENCIES} value={frequency} onChange={setFrequency} />
        <Field label="Zone de livraison" value={zone} onChangeText={setZone} />
        <Btn label={busy ? '' : 'Envoyer la demande'} onPress={submit} disabled={busy} />
        {busy ? <ActivityIndicator color={C.green} style={{ marginTop: -34 }} /> : null}

        {mine.length ? <Label>Mes demandes</Label> : null}
        {mine.map((r) => (
          <Card key={r.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: C.text, fontWeight: '700' }}>{r.orgName}</Text>
              <Text style={{ color: C.gold, fontSize: 12 }}>{B2B_STATUS_LABEL[r.status] || r.status}</Text>
            </View>
            <Text style={{ color: C.mute, fontSize: 12, marginTop: 4 }}>
              {r.orgType} · {r.frequency}{r.monthlyBudgetBIF ? ` · ${fmt(r.monthlyBudgetBIF)}/mois` : ''}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

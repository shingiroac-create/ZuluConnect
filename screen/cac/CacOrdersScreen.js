import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ORDER_STEPS, fmt, savingsFromOrders } from '../../cac/data';
import { subscribeMyOrders } from '../../cac/services';
import { C, Card, Screen } from '../../cac/ui';

const dateStr = (v) => {
  const d = v?.toDate ? v.toDate() : v ? new Date(v) : null;
  return d ? d.toLocaleDateString('fr-FR') : '';
};

export default function CacOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => subscribeMyOrders(setOrders), []);

  return (
    <Screen title="Mes commandes" onBack={() => navigation.navigate('CacHome')}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={savingsFromOrders(orders) > 0 ? (
          <Card style={{ borderColor: 'rgba(0,229,160,0.25)' }}>
            <Text style={{ color: C.mute, fontSize: 12 }}>Vos économies avec CAC</Text>
            <Text style={{ color: C.green, fontSize: 22, fontWeight: '800' }}>{fmt(savingsFromOrders(orders))}</Text>
          </Card>
        ) : null}
        ListEmptyComponent={<Text style={{ color: C.mute, textAlign: 'center', marginTop: 40 }}>Aucune commande pour le moment.</Text>}
        renderItem={({ item: o }) => {
          const idx = Math.max(0, ORDER_STEPS.findIndex((s) => s.key === o.status));
          return (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: C.text, fontWeight: '700' }}>{fmt(o.total)}</Text>
                <Text style={{ color: C.mute, fontSize: 12 }}>{dateStr(o.createdAt)}{o.demo ? ' · démo' : ''}</Text>
              </View>
              <Text style={{ color: C.mute, fontSize: 12, marginTop: 4 }}>
                {o.items.length} produit{o.items.length > 1 ? 's' : ''} · {o.deliveryMode === 'delivery' ? 'Livraison' : o.pickupPoint}
              </Text>
              <View style={{ marginTop: 12 }}>
                {ORDER_STEPS.map((s, i) => (
                  <View key={s.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ color: i <= idx ? C.green : C.dim, width: 18 }}>{i <= idx ? '●' : '○'}</Text>
                    <Text style={{ color: i === idx ? C.text : C.dim, fontSize: 12, fontWeight: i === idx ? '700' : '400' }}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}

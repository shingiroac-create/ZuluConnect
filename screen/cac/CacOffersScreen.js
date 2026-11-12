import { useState } from 'react';
import { FlatList, Text } from 'react-native';
import { OFFER_FILTERS, filterOffers } from '../../cac/data';
import { useCac } from '../../cac/CacContext';
import { Choice, Screen, C } from '../../cac/ui';
import OfferCard from './OfferCard';

export default function CacOffersScreen({ navigation }) {
  const { offers } = useCac();
  const [filter, setFilter] = useState(OFFER_FILTERS[0]);
  const list = filterOffers(offers, filter);

  return (
    <Screen title="Offres du moment" subtitle="Rejoignez un lot : plus on est nombreux, moins c'est cher" onBack={() => navigation.goBack()}>
      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={<Choice options={OFFER_FILTERS} value={filter} onChange={setFilter} />}
        ListEmptyComponent={<Text style={{ color: C.mute, textAlign: 'center', marginTop: 30 }}>Aucune offre dans cette catégorie.</Text>}
        renderItem={({ item }) => (
          <OfferCard offer={item} onPress={() => navigation.navigate('CacOffer', { offerId: item.id })} />
        )}
      />
    </Screen>
  );
}

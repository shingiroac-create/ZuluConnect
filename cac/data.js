// Module CAC (achats groupés) — constantes et données de démonstration.
// IMPORTANT : tous les prix, paliers et points de retrait ci-dessous sont des valeurs
// de démonstration. Ils doivent être remplacés par des devis fournisseurs datés
// (collections Firestore cac_products / cac_cycles) avant le pilote.

export const fmt = (n) =>
  String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' BIF';

export const DELIVERY_FEE = 3000; // à affiner selon la zone et la taille de commande

export const PICKUP_POINTS = [
  'Point relais Rohero',
  'Point relais Ngagara',
  'Point relais Kamenge',
  'Point relais Musaga',
  'Point relais Kinindo',
];

export const PAYMENT_METHODS = ['Lumicash', 'Ecocash'];

export const DEMO_PRODUCTS = [
  { id: 'riz', emoji: '🍚', name: 'Riz', unit: '5 kg', price: 14000, category: 'Aliments de base' },
  { id: 'haricots', emoji: '🫘', name: 'Haricots', unit: '5 kg', price: 12500, category: 'Aliments de base' },
  { id: 'farine', emoji: '🌽', name: 'Farine de maïs', unit: '5 kg', price: 9000, category: 'Aliments de base' },
  { id: 'sucre', emoji: '🍬', name: 'Sucre', unit: '5 kg', price: 17500, category: 'Aliments de base' },
  { id: 'sel', emoji: '🧂', name: 'Sel', unit: '1 kg', price: 1500, category: 'Aliments de base' },
  { id: 'huile', emoji: '🛢️', name: 'Huile végétale', unit: '3 L', price: 21000, category: 'Produits courants' },
  { id: 'savon', emoji: '🧼', name: 'Savon', unit: 'pack de 3', price: 4500, category: 'Produits courants' },
  { id: 'detergent', emoji: '🧴', name: 'Détergent', unit: '1 kg', price: 8000, category: 'Produits courants' },
  { id: 'papier', emoji: '🧻', name: 'Papier hygiénique', unit: 'pack de 4', price: 5000, category: 'Produits courants' },
];

// Paniers de travail du plan CAC. Le contenu est à valider avec l'enquête ménages.
export const BASKETS = [
  {
    id: 'essentiel', name: 'Essentiel', people: '1 à 2 personnes', emoji: '🧺',
    items: { riz: 1, haricots: 1, farine: 1, sucre: 1, huile: 1, sel: 1, savon: 1 },
  },
  {
    id: 'famille', name: 'Famille', people: '3 à 5 personnes', emoji: '🧑‍🧑‍🧒',
    items: { riz: 2, haricots: 2, farine: 2, sucre: 1, huile: 2, sel: 1, savon: 2, detergent: 1 },
  },
  {
    id: 'famille-plus', name: 'Famille Plus', people: '6 personnes et plus', emoji: '👨‍👩‍👧‍👦',
    items: { riz: 3, haricots: 3, farine: 3, sucre: 2, huile: 3, sel: 2, savon: 3, detergent: 2, papier: 2 },
  },
];

const inDays = (d) => new Date(Date.now() + d * 24 * 3600 * 1000);

export const DEMO_CYCLE = {
  id: 'demo-cycle',
  title: 'Cycle de novembre',
  zone: 'Bujumbura',
  status: 'open',
  participants: 112,
  closesAt: inDays(6),
  // Paliers de démonstration : la remise réelle vient de la négociation fournisseurs.
  tiers: [
    { households: 100, discountPct: 2 },
    { households: 300, discountPct: 4 },
    { households: 500, discountPct: 6 },
  ],
  demo: true,
};

export const ORDER_STEPS = [
  { key: 'awaiting_payment', label: 'Paiement en attente' },
  { key: 'confirmed', label: 'Confirmée' },
  { key: 'consolidated', label: 'Consolidée' },
  { key: 'ordered', label: 'Commandée aux fournisseurs' },
  { key: 'received', label: 'Reçue et contrôlée' },
  { key: 'ready', label: 'Prête' },
  { key: 'delivered', label: 'Livrée / retirée' },
];

export const B2B_TYPES = ['Entreprise', 'Association', 'ONG / projet', 'Institution', 'Coopérative'];
export const B2B_FREQUENCIES = ['Ponctuel', 'Mensuel', 'Trimestriel'];
export const B2B_STATUS_LABEL = {
  nouvelle: 'Nouvelle',
  en_cours: 'En cours de chiffrage',
  devis_envoye: 'Devis envoyé',
  acceptee: 'Acceptée',
  refusee: 'Clôturée',
};

export function currentTier(cycle) {
  const tiers = [...(cycle?.tiers || [])].sort((a, b) => a.households - b.households);
  const reached = tiers.filter((t) => (cycle?.participants || 0) >= t.households);
  return {
    reached: reached[reached.length - 1] || null,
    next: tiers.find((t) => (cycle?.participants || 0) < t.households) || null,
    max: tiers.length ? tiers[tiers.length - 1].households : 0,
  };
}

export function daysLeft(cycle) {
  if (!cycle?.closesAt) return null;
  const ms = new Date(cycle.closesAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 3600 * 1000)));
}

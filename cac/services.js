// Accès Firestore du module CAC, avec repli sur des données de démo.
// - Pas de cycle / produit en base, ou erreur réseau : données de démo.
// - Pas d'utilisateur connecté (accès démo investisseurs) : commandes et demandes
//   B2B gardées en mémoire, jamais écrites dans Firestore.
import {
  addDoc, collection, onSnapshot, query, serverTimestamp, where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { DEMO_CYCLE, DEMO_PRODUCTS } from './data';

const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);
const byDateDesc = (a, b) =>
  (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0);

// ---- Cycle et catalogue -----------------------------------------------------

export function subscribeCycle(cb) {
  const q = query(collection(db, 'cac_cycles'), where('status', '==', 'open'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) return cb(DEMO_CYCLE);
      const d = snap.docs[0];
      cb({ id: d.id, ...d.data(), closesAt: toDate(d.data().closesAt) });
    },
    () => cb(DEMO_CYCLE)
  );
}

export function subscribeProducts(cb) {
  return onSnapshot(
    collection(db, 'cac_products'),
    (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.available !== false);
      cb(list.length ? list : DEMO_PRODUCTS);
    },
    () => cb(DEMO_PRODUCTS)
  );
}

// ---- Stockage local pour le mode démo --------------------------------------

function makeLocalStore() {
  let rows = [];
  const subs = new Set();
  return {
    add(row) {
      rows = [{ id: 'demo-' + Date.now(), createdAt: new Date(), ...row }, ...rows];
      subs.forEach((f) => f(rows));
    },
    subscribe(cb) {
      subs.add(cb);
      cb(rows);
      return () => subs.delete(cb);
    },
  };
}
const demoOrders = makeLocalStore();
const demoB2B = makeLocalStore();

function subscribeMine(collectionName, local, cb) {
  const user = auth.currentUser;
  if (!user) return local.subscribe(cb);
  const q = query(collection(db, collectionName), where('uid', '==', user.uid));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byDateDesc)),
    () => cb([])
  );
}

// ---- Commandes des ménages -------------------------------------------------

export const subscribeMyOrders = (cb) => subscribeMine('cac_orders', demoOrders, cb);

// Le total est recalculé côté serveur avant paiement (voir docs/CAC_MODULE.md).
export async function placeOrder({ cycle, lines, delivery, payment, referralCode }) {
  const base = {
    cycleId: cycle.id,
    items: lines.map((l) => ({
      productId: l.id, name: l.name, unit: l.unit, qty: l.qty, unitPrice: l.price,
    })),
    subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
    deliveryFee: delivery.fee,
    total: lines.reduce((s, l) => s + l.price * l.qty, 0) + delivery.fee,
    deliveryMode: delivery.mode, // 'pickup' | 'delivery'
    pickupPoint: delivery.mode === 'pickup' ? delivery.pickupPoint : null,
    address: delivery.mode === 'delivery' ? delivery.address : null,
    phone: payment.phone,
    paymentMethod: payment.method,
    paymentStatus: 'pending',
    status: 'awaiting_payment',
    referralCode: referralCode ? referralCode.trim().toUpperCase() : null,
  };
  const user = auth.currentUser;
  if (!user) {
    demoOrders.add({ ...base, uid: 'demo', demo: true });
    return { demo: true };
  }
  const ref = await addDoc(collection(db, 'cac_orders'), {
    ...base, uid: user.uid, createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

// ---- Demandes B2B ----------------------------------------------------------

export const subscribeMyB2B = (cb) => subscribeMine('cac_b2b_requests', demoB2B, cb);

export async function submitB2BRequest(form) {
  const base = { ...form, status: 'nouvelle' };
  const user = auth.currentUser;
  if (!user) {
    demoB2B.add({ ...base, uid: 'demo', demo: true });
    return { demo: true };
  }
  const ref = await addDoc(collection(db, 'cac_b2b_requests'), {
    ...base, uid: user.uid, createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

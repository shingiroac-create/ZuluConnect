import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_CYCLE, DEMO_OFFERS, DEMO_PRODUCTS } from './data';
import { subscribeCycle, subscribeOffers, subscribeProducts } from './services';

const CacContext = createContext(null);

export function CacProvider({ children }) {
  const [cycle, setCycle] = useState(DEMO_CYCLE);
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [offers, setOffers] = useState(DEMO_OFFERS);
  const [cart, setCart] = useState({}); // { productId: qty }
  const [offerCart, setOfferCart] = useState({}); // { offerId: parts }

  useEffect(() => {
    const u1 = subscribeCycle(setCycle);
    const u2 = subscribeProducts(setProducts);
    const u3 = subscribeOffers(setOffers);
    return () => { u1(); u2(); u3(); };
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return next;
    });
  }, []);

  const setOfferParts = useCallback((id, parts) => {
    setOfferCart((c) => {
      const next = { ...c };
      if (parts <= 0) delete next[id]; else next[id] = parts;
      return next;
    });
  }, []);

  const loadBasket = useCallback((items) => { setOfferCart({}); setCart({ ...items }); }, []);
  const clearCart = useCallback(() => { setCart({}); setOfferCart({}); }, []);

  const lines = useMemo(() => {
    const prod = products.filter((p) => cart[p.id] > 0).map((p) => ({ ...p, qty: cart[p.id] }));
    const offs = offers.filter((o) => offerCart[o.id] > 0).map((o) => ({
      id: 'offer:' + o.id, offerId: o.id, emoji: o.emoji, name: o.name, unit: o.unit,
      price: o.groupPrice, refPrice: o.price, qty: offerCart[o.id],
    }));
    return [...offs, ...prod];
  }, [products, offers, cart, offerCart]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const value = useMemo(
    () => ({
      cycle, products, offers, cart, offerCart, lines, subtotal, count,
      setQty, setOfferParts, loadBasket, clearCart,
    }),
    [cycle, products, offers, cart, offerCart, lines, subtotal, count, setQty, setOfferParts, loadBasket, clearCart]
  );
  return <CacContext.Provider value={value}>{children}</CacContext.Provider>;
}

export const useCac = () => useContext(CacContext);

export function basketTotal(basket, products) {
  return Object.entries(basket.items).reduce((s, [id, qty]) => {
    const p = products.find((x) => x.id === id);
    return s + (p ? p.price * qty : 0);
  }, 0);
}

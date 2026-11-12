import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_CYCLE, DEMO_PRODUCTS } from './data';
import { subscribeCycle, subscribeProducts } from './services';

const CacContext = createContext(null);

export function CacProvider({ children }) {
  const [cycle, setCycle] = useState(DEMO_CYCLE);
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [cart, setCart] = useState({}); // { productId: qty }

  useEffect(() => {
    const u1 = subscribeCycle(setCycle);
    const u2 = subscribeProducts(setProducts);
    return () => { u1(); u2(); };
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return next;
    });
  }, []);

  const loadBasket = useCallback((items) => setCart({ ...items }), []);
  const clearCart = useCallback(() => setCart({}), []);

  const lines = useMemo(
    () => products.filter((p) => cart[p.id] > 0).map((p) => ({ ...p, qty: cart[p.id] })),
    [products, cart]
  );
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const value = useMemo(
    () => ({ cycle, products, cart, lines, subtotal, count, setQty, loadBasket, clearCart }),
    [cycle, products, cart, lines, subtotal, count, setQty, loadBasket, clearCart]
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

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { INITIAL_STORE } from "@/data/mock-data.js";

const RudraContext = createContext(null);
const STORAGE_KEY = "rudra-arts-demo-v1";

export function RudraProvider({ children }) {
  const [path, setPath] = useState("/");
  const [urlSearch, setUrlSearch] = useState({});
  const [store, setStore] = useState(INITIAL_STORE);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [quickProduct, setQuickProduct] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const syncLocation = useCallback(() => {
    setPath(window.location.pathname || "/");
    setUrlSearch(Object.fromEntries(new URLSearchParams(window.location.search)));
  }, []);

  useEffect(() => {
    syncLocation();
    const handlePopState = () => syncLocation();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("rudra:navigate", handlePopState);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.store) setStore({ ...INITIAL_STORE, ...parsed.store });
        if (Array.isArray(parsed.cart)) setCart(parsed.cart);
        if (Array.isArray(parsed.wishlist)) setWishlist(parsed.wishlist);
        if (parsed.customer) setCustomer(parsed.customer);
        if (parsed.adminAuthenticated) setAdminAuthenticated(true);
        if (parsed.lastOrder) setLastOrder(parsed.lastOrder);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("rudra:navigate", handlePopState);
    };
  }, [syncLocation]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ store, cart, wishlist, customer, adminAuthenticated, lastOrder }),
      );
    } catch {
      // The demo remains usable if browser storage is unavailable or full.
    }
  }, [store, cart, wishlist, customer, adminAuthenticated, lastOrder, ready]);

  useEffect(() => {
    const titleByPath = {
      "/": "Rudra Arts And Handicrafts | Maratha Heritage Art",
      "/shop": "Shop Heritage Art | Rudra Arts And Handicrafts",
      "/collections": "Heritage Collections | Rudra Arts And Handicrafts",
      "/gallery": "Heritage Gallery | Rudra Arts And Handicrafts",
      "/about": "Our Story | Rudra Arts And Handicrafts",
      "/contact": "Contact Rudra Arts And Handicrafts",
      "/wishlist": "Your Wishlist | Rudra Arts And Handicrafts",
      "/cart": "Your Cart | Rudra Arts And Handicrafts",
      "/checkout": "Checkout | Rudra Arts And Handicrafts",
      "/account": "Your Account | Rudra Arts And Handicrafts",
      "/account/login": "Customer Login | Rudra Arts And Handicrafts",
      "/account/register": "Create Account | Rudra Arts And Handicrafts",
      "/admin/login": "Admin Login | Rudra Arts And Handicrafts",
    };
    const title = titleByPath[path] || (path.startsWith("/admin") ? "Store Administration | Rudra Arts And Handicrafts" : "Heritage Collection | Rudra Arts And Handicrafts");
    document.title = title;
    const description = "Discover handcrafted Maratha heritage art, sculptures, historical replicas, and custom decor from Rudra Arts And Handicrafts in Kolhapur.";
    for (const [selector, value] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
    ]) {
      const node = document.querySelector(selector);
      if (node) node.setAttribute("content", value);
    }
  }, [path]);

  const navigate = useCallback((to) => {
    if (typeof window === "undefined") return;
    window.history.pushState({}, "", to);
    syncLocation();
    setMobileMenuOpen(false);
    setSearchOpen(false);
    window.dispatchEvent(new Event("rudra:navigate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [syncLocation]);

  const updateStore = useCallback((updater) => {
    setStore((current) => (typeof updater === "function" ? updater(current) : { ...current, ...updater }));
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || product.price <= 0) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { productId: product.id, quantity }];
    });
  }, []);

  const setCartQuantity = useCallback((productId, quantity) => {
    setCart((current) => quantity <= 0 ? current.filter((item) => item.productId !== productId) : current.map((item) => item.productId === productId ? { ...item, quantity } : item));
  }, []);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }, []);

  const addInquiry = useCallback((fields) => {
    const inquiry = {
      id: `inq-${Date.now()}`,
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      subject: fields.subject || "General enquiry",
      message: fields.message,
      date: new Date().toISOString().slice(0, 10),
      status: "New",
    };
    updateStore((current) => ({ ...current, inquiries: [inquiry, ...current.inquiries] }));
    return inquiry;
  }, [updateStore]);

  const value = useMemo(() => ({
    path,
    urlSearch,
    store,
    updateStore,
    cart,
    setCart,
    addToCart,
    setCartQuantity,
    wishlist,
    toggleWishlist,
    customer,
    setCustomer,
    adminAuthenticated,
    setAdminAuthenticated,
    lastOrder,
    setLastOrder,
    quickProduct,
    setQuickProduct,
    inquiryOpen,
    setInquiryOpen,
    searchOpen,
    setSearchOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    navigate,
    addInquiry,
  }), [path, urlSearch, store, updateStore, cart, addToCart, setCartQuantity, wishlist, toggleWishlist, customer, adminAuthenticated, lastOrder, quickProduct, inquiryOpen, searchOpen, mobileMenuOpen, navigate, addInquiry]);

  return <RudraContext.Provider value={value}>{children}</RudraContext.Provider>;
}

export function useRudra() {
  const context = useContext(RudraContext);
  if (!context) throw new Error("useRudra must be used inside RudraProvider");
  return context;
}
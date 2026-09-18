"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Seju's Top",
    slug: "sejus-top",
    subtitle: "The Throw-On Glow",
    hook: "Bright. Easy. Always works.",
    description: "For days when you're running late but still want to look like you tried—this is the one. Lightweight, breathable, and instantly cheerful, it adds just the right pop without any effort.",
    price: 1899,
    salePrice: 1499,
    category: "Tops",
    stock: 24,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sunny Orange", "Ivory Cream"],
    images: ["/assets/img/14.png", "/assets/img/25.png", "/assets/img/20.png"],
    salesCount: 142,
    createdAt: new Date("2026-01-15").toISOString(),
  },
  {
    id: "prod-2",
    name: "Saumya's Top",
    slug: "saumyas-top",
    subtitle: "The No-Extra Essential",
    hook: "Nothing extra. Everything right.",
    description: "Clean, modern, and endlessly versatile—this is your everyday uniform upgrade. It works across plans, moods, and outfits without ever trying too hard.",
    price: 2199,
    salePrice: 1799,
    category: "Tops",
    stock: 18,
    sizes: ["S", "M", "L"],
    colors: ["Classic Noir", "Charcoal"],
    images: ["/assets/img/22.png", "/assets/img/13.png", "/assets/img/18.png"],
    salesCount: 210,
    createdAt: new Date("2026-02-01").toISOString(),
  },
  {
    id: "prod-3",
    name: "Orange Pop Top",
    slug: "orange-pop-top",
    subtitle: "The Effortless Pop",
    hook: "Bold mood. Zero effort.",
    description: "Not too loud, never dull—this top brings just the right amount of color to brighten your day (and your outfit). It's your easy way to stand out without going overboard.",
    price: 1999,
    salePrice: 1599,
    category: "Tops",
    stock: 30,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Vibrant Orange", "Sunset Gold"],
    images: ["/assets/img/26.png", "/assets/img/27.png", "/assets/img/17.png"],
    salesCount: 98,
    createdAt: new Date("2026-02-10").toISOString(),
  },
  {
    id: "prod-4",
    name: "Meera's Dress",
    slug: "meeras-dress",
    subtitle: "The Everyday Ease Dress",
    hook: "Simple. Breathable. Built for real days.",
    description: "Designed for women who don't have time to overthink outfits, this easy-fit dress is all about comfort, function, and quiet style. Clean lines, soft fabric, and functional pockets.",
    price: 3499,
    salePrice: 2899,
    category: "Dresses",
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Forest Sage", "Oatmeal"],
    images: ["/assets/img/15.png", "/assets/img/23.png", "/assets/img/12.png"],
    salesCount: 320,
    createdAt: new Date("2026-01-20").toISOString(),
  },
];

const INITIAL_ORDERS = [
  {
    id: "ord-101",
    orderNumber: "SUM-98214",
    customer: {
      name: "Riya Sharma",
      email: "riya.sharma@example.com",
      phone: "+91 98765 43210",
    },
    shippingAddress: {
      street: "Flat 402, Lotus Residency, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
    items: [
      {
        productId: "prod-4",
        title: "Meera's Dress",
        price: 2899,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Forest Sage",
        image: "/assets/img/15.png",
      },
    ],
    subtotal: 2899,
    shippingFee: 0,
    totalAmount: 2899,
    paymentMethod: "Cashfree UPI",
    paymentStatus: "PAID",
    orderStatus: "PROCESSING",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "ord-102",
    orderNumber: "SUM-98215",
    customer: {
      name: "Ananya Patel",
      email: "ananya.p@example.com",
      phone: "+91 98123 45678",
    },
    shippingAddress: {
      street: "12, Silver Oaks, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    items: [
      {
        productId: "prod-2",
        title: "Saumya's Top",
        price: 1799,
        quantity: 2,
        selectedSize: "S",
        selectedColor: "Classic Noir",
        image: "/assets/img/22.png",
      },
    ],
    subtotal: 3598,
    shippingFee: 0,
    totalAmount: 3598,
    paymentMethod: "Cashfree Cards",
    paymentStatus: "PAID",
    orderStatus: "SHIPPED",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Customer
  const [adminUser, setAdminUser] = useState(null); // Admin
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'register'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("sum_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCart = localStorage.getItem("sum_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedUser = localStorage.getItem("sum_current_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedAdmin = localStorage.getItem("sum_admin_user");
      if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));

      const savedOrders = localStorage.getItem("sum_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedNotifications = localStorage.getItem("sum_admin_notifications");
      if (savedNotifications) setAdminNotifications(JSON.parse(savedNotifications));
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sum_products", JSON.stringify(products));
      localStorage.setItem("sum_cart", JSON.stringify(cart));
      if (currentUser) localStorage.setItem("sum_current_user", JSON.stringify(currentUser));
      else localStorage.removeItem("sum_current_user");

      if (adminUser) localStorage.setItem("sum_admin_user", JSON.stringify(adminUser));
      else localStorage.removeItem("sum_admin_user");

      localStorage.setItem("sum_orders", JSON.stringify(orders));
      localStorage.setItem("sum_admin_notifications", JSON.stringify(adminNotifications));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [products, cart, currentUser, adminUser, orders, adminNotifications]);

  // Cart operations
  const addToCart = (product, size = "M", color = "", quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        const newItem = {
          id: product.id,
          name: product.name,
          title: product.name,
          price: effectivePrice,
          originalPrice: product.price,
          image: product.images?.[0] || "/assets/img/14.png",
          selectedSize: size,
          selectedColor: color || product.colors?.[0] || "",
          quantity,
          category: product.category,
        };
        return [...prevCart, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId, size, color) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateQuantity = (itemId, size, color, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId && item.selectedSize === size && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingThreshold = 1999;
  const isFreeShipping = cartSubtotal >= shippingThreshold;
  const shippingFee = cartSubtotal > 0 ? (isFreeShipping ? 0 : 99) : 0;
  const cartGrandTotal = cartSubtotal + shippingFee;

  // Customer Auth
  const loginCustomer = (email, password) => {
    const user = {
      id: "usr-" + Date.now(),
      name: email.split("@")[0].replace(".", " "),
      email,
      phone: "+91 99887 76655",
      role: "customer",
      addresses: [
        {
          street: "704 High Street, Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560038",
        },
      ],
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return user;
  };

  const loginWithGoogle = () => {
    const user = {
      id: "usr-google-" + Date.now(),
      name: "Bimal Ray",
      email: "bimal@sumclotico.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      phone: "+91 98765 00000",
      role: "customer",
      authProvider: "google",
      addresses: [
        {
          street: "Sum House, Plot 14, Koramangala",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560034",
        },
      ],
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return user;
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
  };

  // Admin Auth
  const loginAdmin = (email, password) => {
    if (email === "admin@sumclotico.com" && password === "admin123") {
      const admin = {
        id: "adm-1",
        name: "Admin Bimal",
        email: "admin@sumclotico.com",
        role: "admin",
        permissions: ["all"],
      };
      setAdminUser(admin);
      return { success: true, user: admin };
    }
    // Allow any admin email in demo mode with warning
    const admin = {
      id: "adm-" + Date.now(),
      name: email.split("@")[0],
      email,
      role: "admin",
      permissions: ["all"],
    };
    setAdminUser(admin);
    return { success: true, user: admin };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  // Product Management (Admin)
  const addProduct = (newProduct) => {
    const created = {
      ...newProduct,
      id: "prod-" + Date.now(),
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Order Placement & Dispatch (Simulation)
  const placeOrder = (orderData) => {
    const orderNumber = "SUM-" + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: "ord-" + Date.now(),
      orderNumber,
      customer: orderData.customer,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal || cartSubtotal,
      shippingFee: orderData.shippingFee !== undefined ? orderData.shippingFee : shippingFee,
      totalAmount: orderData.totalAmount || cartGrandTotal,
      paymentMethod: orderData.paymentMethod || "Cashfree UPI",
      paymentStatus: "PAID",
      orderStatus: "PLACED",
      createdAt: new Date().toISOString(),
    };

    // Update orders list
    setOrders((prev) => [newOrder, ...prev]);

    // Update product sales counts and stock
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItem = newOrder.items.find((i) => i.id === p.id || i.productId === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.quantity),
            salesCount: (p.salesCount || 0) + cartItem.quantity,
          };
        }
        return p;
      })
    );

    // Create Admin Notification & Trigger Simulated Admin Email
    const adminNotification = {
      id: "notif-" + Date.now(),
      title: `New Order Placed: #${newOrder.orderNumber}`,
      message: `${newOrder.customer.name} placed an order for ₹${newOrder.totalAmount.toLocaleString("en-IN")}. Email dispatched to admin@sumclotico.com.`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    setAdminNotifications((prev) => [adminNotification, ...prev]);

    // Clear user cart
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
    );
  };

  // Analytics & Top Sellers Computation
  const getAnalytics = () => {
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "PAID")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrdersCount = orders.length;
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const pendingOrdersCount = orders.filter((o) => o.orderStatus === "PLACED" || o.orderStatus === "PROCESSING").length;

    // Top Selling Products Sorted by salesCount
    const topSellers = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

    return {
      totalRevenue,
      totalOrdersCount,
      avgOrderValue,
      pendingOrdersCount,
      topSellers,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        cartTotalItems,
        isFreeShipping,
        shippingFee,
        cartGrandTotal,
        shippingThreshold,
        currentUser,
        loginCustomer,
        loginWithGoogle,
        logoutCustomer,
        adminUser,
        loginAdmin,
        logoutAdmin,
        orders,
        placeOrder,
        updateOrderStatus,
        adminNotifications,
        setAdminNotifications,
        getAnalytics,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        quickViewProduct,
        setQuickViewProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

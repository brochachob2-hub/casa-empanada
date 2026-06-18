const DB = {
  _prefix: 'casa_',

  _get(key) {
    try {
      return JSON.parse(localStorage.getItem(this._prefix + key)) ?? null;
    } catch { return null; }
  },

  _set(key, val) {
    localStorage.setItem(this._prefix + key, JSON.stringify(val));
  },

  get dishes() {
    let d = this._get('dishes');
    if (!d) {
      d = this._seedDishes();
      this._set('dishes', d);
    }
    return d;
  },

  set dishes(v) { this._set('dishes', v); },

  get inventory() {
    let i = this._get('inventory');
    if (!i) {
      i = this._seedInventory();
      this._set('inventory', i);
    }
    return i;
  },

  set inventory(v) { this._set('inventory', v); },

  get expenses() {
    let e = this._get('expenses');
    if (!e) {
      e = this._seedExpenses();
      this._set('expenses', e);
    }
    return e;
  },

  set expenses(v) { this._set('expenses', v); },

  get cart() { return this._get('cart') ?? []; },
  set cart(v) { this._set('cart', v); },

  get serviceType() { return this._get('serviceType') ?? 'pickup'; },
  set serviceType(v) { this._set('serviceType', v); },

  get orders() {
    let o = this._get('orders');
    if (!o) { o = []; this._set('orders', o); }
    return o;
  },
  set orders(v) { this._set('orders', v); },

  placeOrder(items, serviceType, name, phone, address) {
    const orders = this.orders;
    const order = {
      id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      items: items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, emoji: i.emoji })),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      serviceType,
      customerName: name || '',
      customerPhone: phone || '',
      address: serviceType === 'delivery' ? (address || '') : '',
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    orders.push(order);
    this.orders = orders;
    this.cart = [];
    return order;
  },

  nextId(collection) {
    const items = this[collection];
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  },

  toast(msg) {
    const container = document.querySelector('.toast-container') || (() => {
      const el = document.createElement('div');
      el.className = 'toast-container';
      document.body.appendChild(el);
      return el;
    })();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  _seedDishes() {
    return [
      { id: 1, name: 'Traditional Ilocos Empanada', description: 'Crispy orange rice-flour shell filled with green papaya, monggo sprouts, longganisa, and egg. Served with spicy sukang iloko.', price: 120, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
      { id: 2, name: 'Special Bagnet Empanada', description: 'Our signature empanada with crispy bagnet, fresh tomato, and house-made vinegar dip.', price: 180, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
      { id: 3, name: 'Pinakbet Empanada', description: 'A vegetarian twist with ampalaya, eggplant, okra, and squash in our signature shell.', price: 140, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
      { id: 4, name: 'Chori-Burger Empanada', description: 'Filipino-style chorizo patty with cheese, pickled carrots, and special sauce.', price: 160, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
      { id: 5, name: 'Dessert Empanada (Tablea)', description: 'Sweet empanada filled with tablea chocolate and ripe mango, dusted with sugar.', price: 110, category: 'Desserts', available: true, emoji: '\u{1F95F}', image: '' },
      { id: 6, name: 'Dessert Empanada (Ube)', description: 'Purple yam and macapuno filled empanada with a coconut glaze.', price: 130, category: 'Desserts', available: true, emoji: '\u{1F95F}', image: '' },
      { id: 7, name: 'Lumpiang Shanghai', description: 'Crispy spring rolls with sweet chili dipping sauce. 8 pieces.', price: 150, category: 'Appetizers', available: true, emoji: '\u{1F32F}', image: '' },
      { id: 8, name: 'Dinakdakan', description: 'Grilled pork head parts in a creamy calamansi-mayo dressing with onions and chili.', price: 220, category: 'Appetizers', available: true, emoji: '\u{1F957}', image: '' },
      { id: 9, name: 'Pancit Canton', description: 'Stir-fried egg noodles with pork, shrimp, and vegetables. Family size.', price: 280, category: 'Noodles', available: true, emoji: '\u{1F35C}', image: '' },
      { id: 10, name: 'Garlic Longganisa', description: 'House-made garlic longganisa served with sinangag and itlog. A classic breakfast plate.', price: 220, category: 'Rice Meals', available: true, emoji: '\u{1F373}', image: '' },
      { id: 11, name: 'Bagnet Kare-Kare', description: 'Crispy bagnet in rich peanut sauce with bagoong on the side.', price: 350, category: 'Rice Meals', available: true, emoji: '\u{1F35B}', image: '' },
      { id: 12, name: 'Sizzling Sisig', description: 'Chopped pork face and ears on a sizzling plate with egg and calamansi.', price: 290, category: 'Rice Meals', available: true, emoji: '\u{1F373}', image: '' },
      { id: 13, name: 'Halo-Halo', description: 'Shaved ice with ube ice cream, leche flan, macapuno, saba, and pinipig.', price: 160, category: 'Desserts', available: true, emoji: '\u{1F368}', image: '' },
      { id: 14, name: 'Sago\'t Gulaman', description: 'Refreshing caramelized tapioca and jelly drink with ice.', price: 65, category: 'Beverages', available: true, emoji: '\u{1F964}', image: '' },
      { id: 15, name: 'Calamansi Juice', description: 'Freshly squeezed calamansi juice sweetened with honey.', price: 55, category: 'Beverages', available: true, emoji: '\u{1F34A}', image: '' },
      { id: 16, name: 'Buko Pandan', description: 'Young coconut strips with pandan jelly in creamy milk.', price: 110, category: 'Desserts', available: true, emoji: '\u{1F965}', image: '' },
    ];
  },

  _seedInventory() {
    return [
      { id: 1, name: 'Rice Flour', qty: 25, unit: 'kg', cost: 50 },
      { id: 2, name: 'Green Papaya', qty: 15, unit: 'kg', cost: 60 },
      { id: 3, name: 'Monggo Sprouts', qty: 10, unit: 'kg', cost: 80 },
      { id: 4, name: 'Longganisa (bulk)', qty: 8, unit: 'kg', cost: 240 },
      { id: 5, name: 'Eggs', qty: 120, unit: 'pcs', cost: 5 },
      { id: 6, name: 'Cooking Oil', qty: 20, unit: 'L', cost: 70 },
      { id: 7, name: 'Bagnet', qty: 5, unit: 'kg', cost: 360 },
      { id: 8, name: 'Chorizo', qty: 6, unit: 'kg', cost: 300 },
      { id: 9, name: 'Tablea Chocolate', qty: 3, unit: 'kg', cost: 440 },
      { id: 10, name: 'Ube Powder', qty: 4, unit: 'kg', cost: 320 },
      { id: 11, name: 'Lumpia Wrappers', qty: 30, unit: 'packs', cost: 60 },
      { id: 12, name: 'Pancit Noodles', qty: 12, unit: 'kg', cost: 100 },
      { id: 13, name: 'Peanut Butter', qty: 5, unit: 'kg', cost: 160 },
      { id: 14, name: 'Calamansi', qty: 8, unit: 'kg', cost: 120 },
      { id: 15, name: 'Garlic', qty: 4, unit: 'kg', cost: 140 },
    ];
  },

  _seedExpenses() {
    return {
      overhead: { rent: 25000, utilities: 8000, labor: 45000, marketing: 5000, misc: 3000 },
      dishCosts: {}
    };
      },
      sync: {
    init() {
      Promise.all([
        API.get('/dishes').then(r => { if (r) DB._merge('dishes', r); }).catch(() => {}),
        API.get('/inventory').then(r => { if (r) DB._merge('inventory', r); }).catch(() => {}),
        API.get('/orders').then(r => { if (r) DB._merge('orders', r); }).catch(() => {}),
        API.get('/expenses').then(r => { if (r) DB._merge('expenses', r); }).catch(() => {}),
      ]);
    },

    // ── Dishes ──
    addDish(data) {
      const d = { id: DB._nextLocalId('dishes'), ...data, available: true };
      DB._set('dishes', [...(DB._get('dishes') || []), d]);
      API.post('/dishes', data).catch(() => {});
      return d;
    },
    updateDish(id, data) {
      DB._set('dishes', (DB._get('dishes') || []).map(i => i.id === id ? { ...i, ...data } : i));
      API.put('/dishes/' + id, data).catch(() => {});
    },
    deleteDish(id) {
      DB._set('dishes', (DB._get('dishes') || []).filter(i => i.id !== id));
      API.del('/dishes/' + id).catch(() => {});
    },

    // ── Orders ──
    addOrder(data) {
      const orders = DB._get('orders') || [];
      const order = { id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1, ...data, status: 'pending', timestamp: new Date().toISOString() };
      DB._set('orders', [...orders, order]);
      API.post('/orders', data).catch(() => {});
      return order;
    },
    updateOrder(id, data) {
      DB._set('orders', (DB._get('orders') || []).map(o => o.id === id ? { ...o, ...data } : o));
      API.put('/orders/' + id, data).catch(() => {});
    },

    // ── Inventory ──
    addInventoryItem(data) {
      const item = { id: DB._nextLocalId('inventory'), ...data };
      DB._set('inventory', [...(DB._get('inventory') || []), item]);
      API.post('/inventory', data).catch(() => {});
      return item;
    },
    updateInventoryItem(id, data) {
      DB._set('inventory', (DB._get('inventory') || []).map(i => i.id === id ? { ...i, ...data } : i));
      API.put('/inventory/' + id, data).catch(() => {});
    },
    deleteInventoryItem(id) {
      DB._set('inventory', (DB._get('inventory') || []).filter(i => i.id !== id));
      API.del('/inventory/' + id).catch(() => {});
    },

    // ── Expenses ──
    updateExpenses(data) {
      DB._set('expenses', { ...(DB._get('expenses') || {}), ...data });
      API.put('/expenses', data).catch(() => {});
    },
  },

  _merge(collection, remote) {
    const local = this._get(collection);
    if (!local) { this._set(collection, remote); return; }
    if (Array.isArray(local)) {
      if (local.length >= remote.length) {
        const localIds = new Set(local.map(i => i.id));
        const newItems = remote.filter(i => !localIds.has(i.id));
        if (newItems.length) this._set(collection, [...local, ...newItems]);
      } else {
        this._set(collection, remote);
      }
    } else {
      this._set(collection, remote);
    }
  },

  _nextLocalId(collection) {
    const items = DB._get(collection) || [];
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  },
};

window.DB = DB;

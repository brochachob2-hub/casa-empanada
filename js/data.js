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
    _online: false,

    async init() {
      try {
        const [dishes, inventory, orders, expenses] = await Promise.all([
          API.get('/dishes'),
          API.get('/inventory'),
          API.get('/orders'),
          API.get('/expenses'),
        ]);
        this._online = true;
        DB._set('dishes', dishes);
        DB._set('inventory', inventory);
        DB._set('orders', orders);
        DB._set('expenses', expenses);
      } catch (e) {
        this._online = false;
      }
    },

    isOnline() { return this._online; },

    // ── Dishes ──
    async addDish(data) {
      data.available = data.available !== undefined ? data.available : true;
      if (!this._online) { const d = { id: DB._nextLocalId('dishes'), ...data }; DB._set('dishes', [...DB._get('dishes'), d]); return d; }
      try {
        const dish = await API.post('/dishes', data);
        DB._set('dishes', [...DB._get('dishes'), dish]);
        return dish;
      } catch { this._online = false; return this.addDish(data); }
    },

    async updateDish(id, data) {
      if (!this._online) { const dishes = DB._get('dishes'); DB._set('dishes', dishes.map(d => d.id === id ? { ...d, ...data } : d)); return DB._get('dishes').find(d => d.id === id); }
      try {
        const dish = await API.put('/dishes/' + id, data);
        DB._set('dishes', DB._get('dishes').map(d => d.id === id ? dish : d));
        return dish;
      } catch { this._online = false; return this.updateDish(id, data); }
    },

    async deleteDish(id) {
      if (!this._online) { DB._set('dishes', DB._get('dishes').filter(d => d.id !== id)); return; }
      try {
        await API.del('/dishes/' + id);
        DB._set('dishes', DB._get('dishes').filter(d => d.id !== id));
      } catch { this._online = false; await this.deleteDish(id); }
    },

    async toggleDish(id) {
      const dish = (DB._get('dishes') || []).find(d => d.id === id);
      if (!dish) return;
      return this.updateDish(id, { available: !dish.available });
    },

    // ── Orders ──
    async addOrder(data) {
      if (!this._online) {
        const orders = DB._get('orders') || [];
        const order = { id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1, ...data, status: 'pending', timestamp: new Date().toISOString() };
        DB._set('orders', [...orders, order]);
        DB._set('cart', []);
        return order;
      }
      try {
        const order = await API.post('/orders', data);
        DB._set('orders', [...(DB._get('orders') || []), order]);
        DB._set('cart', []);
        return order;
      } catch { this._online = false; return this.addOrder(data); }
    },

    async updateOrder(id, data) {
      if (!this._online) { const orders = DB._get('orders') || []; DB._set('orders', orders.map(o => o.id === id ? { ...o, ...data } : o)); return DB._get('orders').find(o => o.id === id); }
      try {
        const order = await API.put('/orders/' + id, data);
        DB._set('orders', (DB._get('orders') || []).map(o => o.id === id ? order : o));
        return order;
      } catch { this._online = false; return this.updateOrder(id, data); }
    },

    // ── Inventory ──
    async addInventoryItem(data) {
      if (!this._online) { const i = { id: DB._nextLocalId('inventory'), ...data }; DB._set('inventory', [...(DB._get('inventory') || []), i]); return i; }
      try {
        const item = await API.post('/inventory', data);
        DB._set('inventory', [...(DB._get('inventory') || []), item]);
        return item;
      } catch { this._online = false; return this.addInventoryItem(data); }
    },

    async updateInventoryItem(id, data) {
      if (!this._online) { const inv = DB._get('inventory') || []; DB._set('inventory', inv.map(i => i.id === id ? { ...i, ...data } : i)); return DB._get('inventory').find(i => i.id === id); }
      try {
        const item = await API.put('/inventory/' + id, data);
        DB._set('inventory', (DB._get('inventory') || []).map(i => i.id === id ? item : i));
        return item;
      } catch { this._online = false; return this.updateInventoryItem(id, data); }
    },

    async deleteInventoryItem(id) {
      if (!this._online) { DB._set('inventory', (DB._get('inventory') || []).filter(i => i.id !== id)); return; }
      try {
        await API.del('/inventory/' + id);
        DB._set('inventory', (DB._get('inventory') || []).filter(i => i.id !== id));
      } catch { this._online = false; await this.deleteInventoryItem(id); }
    },

    // ── Expenses ──
    async updateExpenses(data) {
      if (!this._online) { const e = { ...(DB._get('expenses') || {}), ...data }; DB._set('expenses', e); return e; }
      try {
        const exp = await API.put('/expenses', data);
        DB._set('expenses', exp);
        return exp;
      } catch { this._online = false; return this.updateExpenses(data); }
    },
  },

  _nextLocalId(collection) {
    const items = DB._get(collection) || [];
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  },
};

window.DB = DB;

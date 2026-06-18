// Cloudflare Pages _worker.js — catch-all API router
// KV namespace must be bound as "KV" in Cloudflare dashboard

var DEFAULT_DATA = {
  dishes: [
    { id: 1, name: 'Traditional Ilocos Empanada', description: 'Crispy orange rice-flour shell filled with green papaya, monggo sprouts, longganisa, and egg. Served with spicy sukang iloko.', price: 120, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
    { id: 2, name: 'Special Bagnet Empanada', description: 'Our signature empanada with crispy bagnet, fresh tomato, and house-made vinegar dip.', price: 180, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
    { id: 3, name: 'Pinakbet Empanada', description: 'A vegetarian twist with ampalaya, eggplant, okra, and squash in our signature shell.', price: 140, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
    { id: 4, name: 'Chori-Burger Empanada', description: 'Filipino-style chorizo patty with cheese, pickled carrots, and special sauce.', price: 160, category: 'Empanadas', available: true, emoji: '\u{1F95F}', image: '' },
    { id: 5, name: 'Dessert Empanada (Tablea)', description: 'Sweet empanada filled with tablea chocolate and ripe mango, dusted with sugar.', price: 110, category: 'Desserts', available: true, emoji: '\u{1F95F}', image: '' },
    { id: 6, name: 'Dessert Empanada (Ube)', description: 'Purple yam and macapuno filled empanada with a coconut glaze.', price: 130, category: 'Desserts', available: true, emoji: '\u{1F95F}', image: '' },
    { id: 7, name: 'Lumpiang Shanghai', description: 'Crispy spring rolls with sweet chili dipping sauce. 8 pieces.', price: 150, category: 'Appetizers', available: true, emoji: '\u{1F32F}', image: '' },
    { id: 8, name: 'Dinakdakan', description: 'Grilled pork head parts in a creamy calamansi-mayo dressing with onions and chili.', price: 220, category: 'Appetizers', available: true, emoji: '\u{1F957}', image: '' },
    { id: 9, name: 'Pancit Canton', description: 'Stir-fried egg noodles with pork, shrimp, and vegetables. Family size.', price: 280, category: 'Noodles', available: true, emoji: '\u{1F35C}', image: '' },
    { id: 10, name: 'Garlic Longganisa', description: 'House-made garlic longganisa served with sinangag and itlog.', price: 220, category: 'Rice Meals', available: true, emoji: '\u{1F373}', image: '' },
    { id: 11, name: 'Bagnet Kare-Kare', description: 'Crispy bagnet in rich peanut sauce with bagoong on the side.', price: 350, category: 'Rice Meals', available: true, emoji: '\u{1F35B}', image: '' },
    { id: 12, name: 'Sizzling Sisig', description: 'Chopped pork face and ears on a sizzling plate with egg and calamansi.', price: 290, category: 'Rice Meals', available: true, emoji: '\u{1F373}', image: '' },
    { id: 13, name: 'Halo-Halo', description: 'Shaved ice with ube ice cream, leche flan, macapuno, saba, and pinipig.', price: 160, category: 'Desserts', available: true, emoji: '\u{1F368}', image: '' },
    { id: 14, name: 'Sago\'t Gulaman', description: 'Refreshing caramelized tapioca and jelly drink with ice.', price: 65, category: 'Beverages', available: true, emoji: '\u{1F964}', image: '' },
    { id: 15, name: 'Calamansi Juice', description: 'Freshly squeezed calamansi juice sweetened with honey.', price: 55, category: 'Beverages', available: true, emoji: '\u{1F34A}', image: '' },
    { id: 16, name: 'Buko Pandan', description: 'Young coconut strips with pandan jelly in creamy milk.', price: 110, category: 'Desserts', available: true, emoji: '\u{1F965}', image: '' },
  ],
  orders: [],
  inventory: [
    { id: 1, name: 'Rice Flour', qty: 25, unit: 'kg', cost: 50 },
    { id: 2, name: 'Green Papaya', qty: 15, unit: 'kg', cost: 60 },
    { id: 3, name: 'Monggo Sprouts', qty: 10, unit: 'kg', cost: 80 },
    { id: 4, name: 'Longganisa (bulk)', qty: 8, unit: 'kg', cost: 240 },
    { id: 5, name: 'Cooking Oil', qty: 20, unit: 'L', cost: 70 },
    { id: 6, name: 'Eggs', qty: 120, unit: 'pcs', cost: 5 },
    { id: 7, name: 'Bagnet', qty: 5, unit: 'kg', cost: 360 },
    { id: 8, name: 'Chorizo', qty: 6, unit: 'kg', cost: 300 },
    { id: 9, name: 'Tablea Chocolate', qty: 3, unit: 'kg', cost: 440 },
    { id: 10, name: 'Ube Powder', qty: 4, unit: 'kg', cost: 320 },
    { id: 11, name: 'Lumpia Wrappers', qty: 30, unit: 'packs', cost: 60 },
    { id: 12, name: 'Pancit Noodles', qty: 12, unit: 'kg', cost: 100 },
    { id: 13, name: 'Peanut Butter', qty: 5, unit: 'kg', cost: 160 },
    { id: 14, name: 'Calamansi', qty: 8, unit: 'kg', cost: 120 },
    { id: 15, name: 'Garlic', qty: 4, unit: 'kg', cost: 140 },
  ],
  expenses: { overhead: { rent: 25000, utilities: 8000, labor: 45000, marketing: 5000, misc: 3000 }, dishCosts: {} },
};

async function getJSON(kv, key) {
  var val = await kv.get(key, 'text');
  return val ? JSON.parse(val) : null;
}

function putJSON(kv, key, val) {
  return kv.put(key, JSON.stringify(val));
}

async function getColl(kv, name) {
  var data = await getJSON(kv, name);
  if (!data) {
    data = DEFAULT_DATA[name] || [];
    await putJSON(kv, name, data);
  }
  return data;
}

function nextId(items) {
  return items.length ? Math.max.apply(null, items.map(function(i) { return i.id; })) + 1 : 1;
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

function err(msg, status) {
  return json({ error: msg }, status || 400);
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var path = url.pathname;
    var method = request.method;

    if (!path.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
      });
    }

    try {
      return await handleAPI(env.KV, method, path, request);
    } catch (e) {
      return err(e.message, 500);
    }
  },
};

async function handleAPI(kv, method, path, req) {
  var parts = path.replace('/api/', '').split('/');
  var resource = parts[0];
  var id = parts[1] ? parseInt(parts[1]) : null;

  switch (resource) {
    case 'dishes': return handleCRUD(kv, 'dishes', method, id, req, formatDish);
    case 'orders': return handleOrders(kv, method, id, req);
    case 'inventory': return handleCRUD(kv, 'inventory', method, id, req, null);
    case 'expenses': return handleExpenses(kv, method, req);
    default: return err('Not found', 404);
  }
}

function formatDish(body) {
  return { available: body.available !== undefined ? body.available : true };
}

async function handleCRUD(kv, name, method, id, req, extra) {
  var items = await getColl(kv, name);

  if (method === 'GET') return json(items);

  if (method === 'POST') {
    var body = await req.json();
    var item = { id: nextId(items) };
    Object.keys(body).forEach(function(k) { item[k] = body[k]; });
    if (extra) Object.assign(item, extra(body));
    items.push(item);
    await putJSON(kv, name, items);
    return json(item, 201);
  }

  if (id === null) return err('ID required');

  var idx = items.findIndex(function(i) { return i.id === id; });
  if (idx === -1) return err('Not found', 404);

  if (method === 'PUT' || method === 'PATCH') {
    var body = await req.json();
    Object.keys(body).forEach(function(k) { items[idx][k] = body[k]; });
    await putJSON(kv, name, items);
    return json(items[idx]);
  }

  if (method === 'DELETE') {
    items.splice(idx, 1);
    await putJSON(kv, name, items);
    return json({ ok: true });
  }

  return err('Method not allowed', 405);
}

async function handleOrders(kv, method, id, req) {
  var items = await getColl(kv, 'orders');

  if (method === 'GET') return json(items);

  if (method === 'POST') {
    var body = await req.json();
    var order = {
      id: nextId(items),
      items: body.items || [],
      total: body.total || 0,
      serviceType: body.serviceType || 'pickup',
      customerName: body.customerName || '',
      customerPhone: body.customerPhone || '',
      address: body.address || '',
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    items.push(order);
    await putJSON(kv, 'orders', items);
    return json(order, 201);
  }

  if (id === null) return err('ID required');

  var idx = items.findIndex(function(o) { return o.id === id; });
  if (idx === -1) return err('Not found', 404);

  if (method === 'PUT') {
    var body = await req.json();
    Object.keys(body).forEach(function(k) { items[idx][k] = body[k]; });
    await putJSON(kv, 'orders', items);
    return json(items[idx]);
  }

  return err('Method not allowed', 405);
}

async function handleExpenses(kv, method, req) {
  var data = await getColl(kv, 'expenses');

  if (method === 'GET') return json(data);

  if (method === 'PUT') {
    var body = await req.json();
    Object.keys(body).forEach(function(k) { data[k] = body[k]; });
    await putJSON(kv, 'expenses', data);
    return json(data);
  }

  return err('Method not allowed', 405);
}

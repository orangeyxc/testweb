// 數據庫初始化 (Database Initialization)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 建立數據庫連接 (Create database connection)
const db = new sqlite3.Database(path.join(__dirname, 'shopping.db'), (err) => {
  if (err) {
    console.error('數據庫連接失敗:', err.message);
  } else {
    console.log('數據庫連接成功');
  }
});

// 初始化數據庫表 (Initialize database tables)
function initializeDatabase() {
  // 用戶表 (Users table)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 產品表 (Products table)
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 購物車表 (Shopping cart table)
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // 訂單表 (Orders table)
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // 訂單項目表 (Order items table)
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // 支付資訊表 (Payment information table)
  db.run(`CREATE TABLE IF NOT EXISTS payment_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    card_number TEXT NOT NULL,
    card_holder TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('建立表失敗:', err.message);
    } else {
      console.log('數據庫表初始化完成');
      insertSampleProducts();
    }
  });
}

// 插入示例產品 (Insert sample products)
function insertSampleProducts() {
  const sampleProducts = [
    { name: '資源包 A', description: '優質學習資源包，包含多個教程', price: 99.99, stock: 100, image_url: '/images/product1.jpg' },
    { name: '資源包 B', description: '進階開發資源，適合專業人士', price: 149.99, stock: 50, image_url: '/images/product2.jpg' },
    { name: '資源包 C', description: '完整項目模板和源代碼', price: 199.99, stock: 75, image_url: '/images/product3.jpg' },
    { name: '電子書合集', description: '精選電子書籍合集', price: 79.99, stock: 200, image_url: '/images/product4.jpg' },
    { name: '視頻教程', description: '高清視頻教程系列', price: 129.99, stock: 150, image_url: '/images/product5.jpg' }
  ];

  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('查詢產品數量失敗:', err);
      return;
    }
    
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)');
      sampleProducts.forEach(product => {
        stmt.run(product.name, product.description, product.price, product.stock, product.image_url);
      });
      stmt.finalize();
      console.log('示例產品插入完成');
    }
  });
}

module.exports = { db, initializeDatabase };

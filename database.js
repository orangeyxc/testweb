// 數據庫初始化 (Database Initialization)
const mysql = require('mysql2');

// 建立數據庫連接 (Create database connection)
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopping',
  port: Number(process.env.DB_PORT) || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('數據庫連接失敗:', err.message);
  } else {
    console.log('數據庫連接成功');
  }
});

function resolveParams(params, callback) {
  if (typeof params === 'function') {
    return { params: [], callback: params };
  }
  return { params: params || [], callback };
}

const db = {
  run(sql, params, callback) {
    const resolved = resolveParams(params, callback);
    connection.query(sql, resolved.params, (err, results) => {
      if (resolved.callback) {
        const context = { lastID: results && results.insertId };
        resolved.callback.call(context, err, results);
      }
    });
  },
  prepare(sql) {
    return {
      run(...params) {
        connection.query(sql, params, (err) => {
          if (err) {
            console.error('資料庫操作失敗:', err.message);
          }
        });
      },
      finalize() {}
    };
  },
  get(sql, params, callback) {
    const resolved = resolveParams(params, callback);
    connection.query(sql, resolved.params, (err, results) => {
      if (resolved.callback) {
        resolved.callback(err, results && results[0]);
      }
    });
  },
  all(sql, params, callback) {
    const resolved = resolveParams(params, callback);
    connection.query(sql, resolved.params, (err, results) => {
      if (resolved.callback) {
        resolved.callback(err, results);
      }
    });
  }
};

// 初始化數據庫表 (Initialize database tables)
function initializeDatabase() {
  // 用戶表 (Users table)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);

  // 產品表 (Products table)
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);

  // 購物車表 (Shopping cart table)
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  ) ENGINE=InnoDB`);

  // 訂單表 (Orders table)
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  ) ENGINE=InnoDB`);

  // 訂單項目表 (Order items table)
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  ) ENGINE=InnoDB`);

  // 支付資訊表 (Payment information table)
  db.run(`CREATE TABLE IF NOT EXISTS payment_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    card_holder VARCHAR(255) NOT NULL,
    expiry_date VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  ) ENGINE=InnoDB`, (err) => {
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
      sampleProducts.forEach(product => {
        db.run(
          'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.stock, product.image_url]
        );
      });
      console.log('示例產品插入完成');
    }
  });
}

module.exports = { db, initializeDatabase };

// 主服務器檔案 (Main server file)
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { db, initializeDatabase } = require('./database');
const { getAllStocks, predictStock, globalEvents } = require('./stocks');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// 中間件設定 (Middleware setup)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 初始化數據庫 (Initialize database)
initializeDatabase();

// 速率限制 (Rate limiting)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// 身份驗證中間件 (Authentication middleware)
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
}

// ========== 路由 (Routes) ==========

// 首頁 (Home page)
app.get('/', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
    }
    
    const token = req.cookies.token;
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (e) {}
    }
    
    res.render('index', { products, user });
  });
});

// 註冊頁面 (Registration page)
app.get('/register', (req, res) => {
  res.render('register');
});

// 註冊處理 (Registration handler)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: '請填寫所有欄位' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: '用戶名或郵箱已存在' });
          }
          return res.status(500).json({ error: '註冊失敗' });
        }
        res.json({ success: true, message: '註冊成功！' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 登入頁面 (Login page)
app.get('/login', (req, res) => {
  res.render('login');
});

// 登入處理 (Login handler)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '請填寫所有欄位' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: '伺服器錯誤' });
    }
    
    if (!user) {
      return res.status(401).json({ error: '用戶名或密碼錯誤' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: '用戶名或密碼錯誤' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.json({ success: true, message: '登入成功！' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '伺服器錯誤' });
    }
  });
});

// 登出 (Logout)
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// 產品詳情頁 (Product detail page)
app.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).send('產品不存在');
    }
    
    const token = req.cookies.token;
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (e) {}
    }
    
    res.render('product', { product, user });
  });
});

// 購物車頁面 (Cart page)
app.get('/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all(`
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `, [userId], (err, items) => {
    if (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
    }
    
    res.render('cart', { items, user: req.user });
  });
});

// 添加到購物車 (Add to cart)
app.post('/cart/add', authenticateToken, (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.id;
  
  // 檢查購物車中是否已有此產品
  db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, product_id], (err, item) => {
    if (err) {
      return res.status(500).json({ error: '伺服器錯誤' });
    }
    
    if (item) {
      // 更新數量
      db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity || 1, item.id], (err) => {
        if (err) {
          return res.status(500).json({ error: '更新失敗' });
        }
        res.json({ success: true, message: '已更新購物車' });
      });
    } else {
      // 添加新項目
      db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', 
        [userId, product_id, quantity || 1], (err) => {
          if (err) {
            return res.status(500).json({ error: '添加失敗' });
          }
          res.json({ success: true, message: '已添加到購物車' });
        });
    }
  });
});

// 更新購物車數量 (Update cart quantity)
app.post('/cart/update', authenticateToken, (req, res) => {
  const { cart_id, quantity } = req.body;
  
  if (quantity <= 0) {
    db.run('DELETE FROM cart WHERE id = ?', [cart_id], (err) => {
      if (err) {
        return res.status(500).json({ error: '刪除失敗' });
      }
      res.json({ success: true });
    });
  } else {
    db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cart_id], (err) => {
      if (err) {
        return res.status(500).json({ error: '更新失敗' });
      }
      res.json({ success: true });
    });
  }
});

// 移除購物車項目 (Remove cart item)
app.post('/cart/remove', authenticateToken, (req, res) => {
  const { cart_id } = req.body;
  
  db.run('DELETE FROM cart WHERE id = ?', [cart_id], (err) => {
    if (err) {
      return res.status(500).json({ error: '刪除失敗' });
    }
    res.json({ success: true });
  });
});

// 支付資訊頁面 (Payment info page)
app.get('/payment', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all('SELECT * FROM payment_info WHERE user_id = ?', [userId], (err, paymentMethods) => {
    if (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
    }
    
    res.render('payment', { paymentMethods, user: req.user });
  });
});

// 添加支付資訊 (Add payment info)
app.post('/payment/add', authenticateToken, (req, res) => {
  const { card_number, card_holder, expiry_date } = req.body;
  const userId = req.user.id;
  
  if (!card_number || !card_holder || !expiry_date) {
    return res.status(400).json({ error: '請填寫所有欄位' });
  }
  
  // 加密卡號（僅顯示最後4位）
  const maskedCardNumber = '****-****-****-' + card_number.slice(-4);
  
  db.run(
    'INSERT INTO payment_info (user_id, card_number, card_holder, expiry_date) VALUES (?, ?, ?, ?)',
    [userId, maskedCardNumber, card_holder, expiry_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '添加失敗' });
      }
      res.json({ success: true, message: '支付方式添加成功' });
    }
  );
});

// 結賬頁面 (Checkout page)
app.get('/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all(`
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `, [userId], (err, items) => {
    if (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
    }
    
    db.all('SELECT * FROM payment_info WHERE user_id = ?', [userId], (err, paymentMethods) => {
      if (err) {
        console.error(err);
        return res.status(500).send('伺服器錯誤');
      }
      
      res.render('checkout', { items, paymentMethods, user: req.user });
    });
  });
});

// 處理訂單 (Process order)
app.post('/order/create', authenticateToken, (req, res) => {
  const { payment_method_id } = req.body;
  const userId = req.user.id;
  
  // 獲取購物車項目
  db.all(`
    SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `, [userId], (err, items) => {
    if (err || items.length === 0) {
      return res.status(400).json({ error: '購物車為空' });
    }
    
    // 計算總金額
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 創建訂單
    db.run(
      'INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)',
      [userId, totalAmount, payment_method_id || 'default'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: '訂單創建失敗' });
        }
        
        const orderId = this.lastID;
        
        // 添加訂單項目
        const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        items.forEach(item => {
          stmt.run(orderId, item.product_id, item.quantity, item.price);
        });
        stmt.finalize();
        
        // 清空購物車
        db.run('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
          if (err) {
            console.error('清空購物車失敗:', err);
          }
          res.json({ success: true, message: '訂單創建成功！', orderId });
        });
      }
    );
  });
});

// 訂單歷史 (Order history)
app.get('/orders', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all(`
    SELECT o.id, o.total_amount, o.status, o.created_at,
           GROUP_CONCAT(p.name) as products
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [userId], (err, orders) => {
    if (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
    }
    
    res.render('orders', { orders, user: req.user });
  });
});

// ========== 股票預測路由 (Stock Prediction Routes) ==========

// 股票預測首頁 (Stock prediction home)
app.get('/stocks', (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try { user = jwt.verify(token, JWT_SECRET); } catch (e) {}
  }
  const stocks = getAllStocks();
  const market = req.query.market || 'all';
  const search = req.query.search || '';
  res.render('stocks', { stocks, user, market, search, globalEvents });
});

// 股票預測詳情 (Stock prediction detail)
app.get('/stocks/:symbol', (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try { user = jwt.verify(token, JWT_SECRET); } catch (e) {}
  }
  const prediction = predictStock(req.params.symbol);
  if (!prediction) {
    return res.status(404).render('stocks', {
      stocks: getAllStocks(), user, market: 'all', search: '', globalEvents,
      error: '找不到該股票'
    });
  }
  res.render('stock-detail', { prediction, user });
});

// 股票預測API (Stock prediction API)
app.get('/api/stocks', (req, res) => {
  const stocks = getAllStocks();
  res.json({ success: true, stocks });
});

app.get('/api/stocks/:symbol', (req, res) => {
  const prediction = predictStock(req.params.symbol);
  if (!prediction) {
    return res.status(404).json({ error: '找不到該股票' });
  }
  res.json({ success: true, prediction });
});

// 啟動伺服器 (Start server)
app.listen(PORT, () => {
  console.log(`購物網站運行中，訪問地址: http://localhost:${PORT}`);
});

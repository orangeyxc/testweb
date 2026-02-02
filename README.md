# 購物網站 - 資源商店 🛒

一個功能完整嘅購物網站，用於展示同銷售各種資源產品。

## 功能特點

### ✅ 帳戶管理系統
- 用戶註冊同登入
- 密碼加密保護 (bcrypt)
- JWT Token 身份驗證
- 會話管理

### 🛒 購物車功能
- 添加產品到購物車
- 更新購物車數量
- 移除購物車項目
- 實時計算總價

### 💳 支付綁定功能
- 保存支付方式
- 信用卡資訊管理
- 安全嘅卡號顯示 (只顯示最後4位)
- 訂單處理系統

### 📦 產品展示
- 產品列表展示
- 產品詳情頁面
- 庫存管理
- 響應式設計

### 📋 訂單管理
- 訂單歷史記錄
- 訂單狀態追蹤
- 訂單明細查看

## 技術棧

- **後端**: Node.js + Express
- **數據庫**: SQLite3
- **模板引擎**: EJS
- **身份驗證**: JWT + bcryptjs
- **前端**: HTML5 + CSS3 + JavaScript

## 安裝同運行

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動服務器
```bash
npm start
```

### 3. 訪問網站
打開瀏覽器訪問: `http://localhost:3000`

## 使用說明

### 註冊新帳戶
1. 點擊導航欄嘅「註冊」按鈕
2. 填寫用戶名、電郵地址同密碼
3. 提交註冊表單

### 登入帳戶
1. 點擊導航欄嘅「登入」按鈕
2. 輸入用戶名同密碼
3. 成功登入後會返回首頁

### 購物流程
1. 瀏覽產品列表
2. 點擊「查看詳情」查看產品詳細資訊
3. 點擊「加入購物車」添加產品
4. 訪問購物車頁面查看已選產品
5. 點擊「前往結賬」進行結賬
6. 選擇支付方式並確認購買

### 支付方式管理
1. 進入「支付設定」頁面
2. 填寫信用卡資訊
3. 點擊「添加支付方式」保存

### 查看訂單
1. 訪問「訂單記錄」頁面
2. 查看所有歷史訂單
3. 查看訂單詳情同狀態

## 數據庫結構

### users (用戶表)
- id: 主鍵
- username: 用戶名
- email: 電郵地址
- password: 加密密碼
- created_at: 創建時間

### products (產品表)
- id: 主鍵
- name: 產品名稱
- description: 產品描述
- price: 價格
- stock: 庫存
- image_url: 圖片URL
- created_at: 創建時間

### cart (購物車表)
- id: 主鍵
- user_id: 用戶ID
- product_id: 產品ID
- quantity: 數量

### orders (訂單表)
- id: 主鍵
- user_id: 用戶ID
- total_amount: 總金額
- status: 訂單狀態
- payment_method: 支付方式
- created_at: 創建時間

### order_items (訂單項目表)
- id: 主鍵
- order_id: 訂單ID
- product_id: 產品ID
- quantity: 數量
- price: 價格

### payment_info (支付資訊表)
- id: 主鍵
- user_id: 用戶ID
- card_number: 卡號 (加密)
- card_holder: 持卡人
- expiry_date: 到期日
- created_at: 創建時間

## 安全特性

- 密碼使用 bcrypt 加密
- JWT Token 身份驗證
- HTTP-only Cookie 保護
- SQL 注入防護
- XSS 防護

## 示例產品

系統預設包含5個示例產品：
1. 資源包 A - HK$99.99
2. 資源包 B - HK$149.99
3. 資源包 C - HK$199.99
4. 電子書合集 - HK$79.99
5. 視頻教程 - HK$129.99

## 注意事項

- 首次運行會自動創建數據庫同插入示例產品
- JWT Secret 建議喺生產環境中使用環境變量
- 信用卡資訊僅用於演示，實際應用需要整合真實支付網關
- 建議喺生產環境中使用 HTTPS

## 授權

ISC License

## 作者

orangeyxc

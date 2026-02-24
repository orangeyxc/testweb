# 资源商店 + 股票预测中心 🛒📊

一个功能完整的购物网站，同时内置**沪深港股票预测分析中心**，支持资源商品购买与智能投资决策建议。

---

## 🚀 如何启动网站

### 第一步：安装 Node.js

如果你还没有安装 Node.js，请先前往官网下载并安装：

👉 https://nodejs.org/zh-cn/download （建议选择 **LTS 长期支持版**，v18 或以上）

安装完成后，打开终端（命令提示符 / Terminal），输入以下命令验证安装：

```bash
node -v
npm -v
```

如果显示版本号（例如 `v20.x.x`），说明安装成功。

---

### 第二步：安装 MySQL 数据库

本项目需要 MySQL 8.0 或以上版本（也兼容 5.7）。请根据你的操作系统选择对应的安装方式：

---

#### 🪟 Windows 安装 MySQL

**1. 下载安装程序**

前往官网下载 MySQL Installer（推荐选"mysql-installer-community"，约 450 MB）：

👉 https://dev.mysql.com/downloads/installer/

> 点击页面底部的 **"No thanks, just start my download."** 可跳过登录直接下载。

**2. 运行安装向导**

双击下载的 `.msi` 文件，按以下步骤操作：

| 步骤 | 选择 |
|------|------|
| Setup Type（安装类型） | 选 **"Server only"**（仅安装服务器） |
| Check Requirements | 点 **"Execute"** 安装缺失组件，再点 **"Next"** |
| Installation | 点 **"Execute"** 开始安装，完成后点 **"Next"** |
| Product Configuration | 点 **"Next"** 进入配置 |
| Type and Networking | 保持默认（Standalone MySQL Server，Port: 3306），点 **"Next"** |
| Authentication Method | 选第一项 **"Use Strong Password..."**，点 **"Next"** |
| Accounts and Roles | 在 **"MySQL Root Password"** 和 **"Repeat Password"** 填入你要设的密码（请务必记住！），点 **"Next"** |
| Windows Service | 保持默认（Start the MySQL Server at System Startup），点 **"Next"** |
| Apply Configuration | 点 **"Execute"** 应用配置，全部打勾后点 **"Finish"** |

**3. 验证安装**

打开"开始菜单"，搜索并打开 **MySQL 8.0 Command Line Client**，输入你设置的 root 密码，出现 `mysql>` 提示符说明安装成功。

---

#### 🍎 macOS 安装 MySQL

**方式一：使用 Homebrew（推荐，命令行操作）**

如果还没有安装 Homebrew，先在终端执行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

然后安装并启动 MySQL：

```bash
brew install mysql
brew services start mysql
```

安装后首次设置 root 密码：

```bash
mysql_secure_installation
```

按照提示：
- 是否设置密码验证插件 → 输入 `y`（回车，推荐启用）
- 密码强度级别 → 输入 `0`（低，适合本地开发）或 `2`（强，推荐生产环境）
- 设置 root 新密码 → 输入你的密码（两次）
- 其余选项全部输入 `y` 回车

**方式二：下载官方 DMG 安装包**

👉 https://dev.mysql.com/downloads/mysql/

下载 macOS 对应的 `.dmg` 文件，双击安装，安装完成后：
1. 打开"系统设置" → 搜索 **MySQL** → 点击 **"Start MySQL Server"**
2. 在弹出框中设置并记下 root 密码

**验证安装（在终端执行）：**

```bash
mysql -u root -p
```

输入密码后出现 `mysql>` 说明成功。

---

#### 🐧 Linux（Ubuntu / Debian）安装 MySQL

```bash
# 更新包列表
sudo apt-get update

# 安装 MySQL
sudo apt-get install -y mysql-server

# 启动 MySQL 服务
sudo systemctl start mysql
sudo systemctl enable mysql   # 设置开机自启

# 设置 root 密码（运行安全配置向导）
sudo mysql_secure_installation
```

安全配置向导步骤：
- 是否启用密码验证 → 输入 `2`（强密码，推荐）或 `0`（低强度，仅限本地开发）
- 设置 root 密码（输入两次）
- 删除匿名用户 → `y`
- 禁止 root 远程登录 → `y`
- 删除测试数据库 → `y`
- 重新加载权限表 → `y`

**验证安装：**

```bash
sudo mysql -u root -p
```

---

#### 🗄️ 创建项目所需的数据库

安装好 MySQL 并进入 `mysql>` 命令行后（Windows 用 MySQL Command Line Client，macOS/Linux 用终端登录），依次执行以下命令：

```sql
-- 创建数据库（使用 UTF-8 编码，支持中文）
CREATE DATABASE shopping CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 确认创建成功（应在列表中看到 shopping）
SHOW DATABASES;

-- 退出 MySQL 命令行
EXIT;
```

> ✅ 看到 `Query OK, 1 row affected` 说明数据库创建成功。之后启动项目时，表结构和示例数据会**自动创建**，无需手动操作。

---

### 第三步：下载项目代码

如果你已经有代码文件夹，直接进入该目录即可。  
如果需要从 GitHub 克隆：

```bash
git clone https://github.com/orangeyxc/testweb.git
cd testweb
```

---

### 第四步：安装项目依赖

在项目根目录下运行：

```bash
npm install
```

这会自动安装所有必要的依赖包（Express、EJS、MySQL2 等）。

---

### 第五步：配置数据库连接

在启动前，需要告诉项目你的 MySQL 连接信息。

**Windows（命令提示符）：**

```cmd
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=你的MySQL密码
set DB_NAME=shopping
set DB_PORT=3306
```

**macOS / Linux（终端）：**

```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=你的MySQL密码
export DB_NAME=shopping
export DB_PORT=3306
```

> 💡 **提示**：如果你的 MySQL root 没有密码，`DB_PASSWORD` 留空即可（`set DB_PASSWORD=`）

---

### 第六步：启动网站

```bash
npm start
```

看到以下输出说明启动成功：

```
数据库连接成功
数据库表初始化完成
示例产品插入完成
购物网站运行中，访问地址: http://localhost:3000
```

---

### 第七步：打开浏览器访问

- 🛒 **资源商店首页**：http://localhost:3000
- 📊 **股票预测中心**：http://localhost:3000/stocks

---

## 📖 网站功能使用指南

### 🛒 资源商店

#### 注册账户
1. 点击导航栏右上角的 **「注册」** 按钮
2. 填写用户名、电子邮箱、密码
3. 点击提交，注册成功后可直接登录

#### 登录账户
1. 点击导航栏的 **「登入」** 按钮
2. 输入用户名和密码
3. 登录成功后自动跳转首页

#### 购物流程
1. 在首页浏览产品列表（系统预置了 5 款示例产品）
2. 点击 **「查看详情」** 了解产品详细信息
3. 点击 **「加入购物车」** 将产品加入购物车（需要先登录）
4. 点击导航栏 **「购物车」** 查看已选产品，可修改数量
5. 点击 **「前往结账」** 进入结账页面
6. 选择支付方式，点击 **「确认购买」** 完成下单

#### 添加支付方式
1. 登录后点击导航栏 **「支付设定」**
2. 填写信用卡号、持卡人姓名、有效期
3. 点击 **「添加支付方式」** 保存（卡号仅显示末四位）

#### 查看订单记录
1. 点击导航栏 **「订单记录」**
2. 查看所有历史订单及状态（待处理 / 已完成）

---

### 📊 股票预测中心

访问 http://localhost:3000/stocks 进入股票预测中心。

#### 功能特色
- 涵盖 **28 只** 沪深 A 股 + 香港股票
- 结合 4 大维度智能评分：技术分析（RSI/MACD/MA20）、行业趋势、全球宏观事件、市场情绪
- 给出 **买入 / 卖出 / 观望** 建议，附预测成功率
- 提供目标价位、止损价位及预计盈亏金额

#### 查看股票列表
- 默认显示全部股票，可点击标签筛选：**上海A股 / 深圳A股 / 香港股市**
- 在搜索框输入股票名称或代码（如「茅台」或「600519」）可快速定位

#### 查看单只股票详细分析
1. 在列表页点击任意股票卡片
2. 详情页包含：
   - 📍 **建议入场价**：当前价格附近分批买入
   - 🎯 **目标价位**：预期上涨目标，附涨幅百分比
   - 🛡️ **止损价位**：亏损控制线，附最大亏损比例
   - 💰 **预计盈亏试算**：按样本持股数计算乐观/悲观情景下的盈亏金额
   - 📈 **技术指标**：RSI 超买超卖信号、MACD 金叉/死叉、均线趋势
   - 🔬 **多维度因素评分**：四大因素逐一打分并说明原因
   - 🌍 **相关全球事件**：影响该板块的宏观事件列表

#### 已收录股票（部分）

| 市场 | 代码 | 名称 |
|------|------|------|
| 上海A股 | 600519 | 贵州茅台 |
| 上海A股 | 601318 | 中国平安 |
| 深圳A股 | 300750 | 宁德时代 |
| 深圳A股 | 002594 | 比亚迪 |
| 港股 | 00700 | 腾讯控股 |
| 港股 | 09988 | 阿里巴巴 |
| 港股 | 03690 | 美团 |
| 港股 | 00005 | 汇丰控股 |

> ⚠️ **免责声明**：股票预测结果仅供参考，不构成投资建议。股市有风险，投资需谨慎。

---

## 🛠️ 常见问题

**Q：启动时报错 `数据库连接失败`**  
A：请检查 MySQL 是否正在运行，以及 `DB_PASSWORD`、`DB_NAME` 等环境变量是否配置正确。确认数据库 `shopping` 已创建。

**Q：报错 `Cannot find module`**  
A：请先运行 `npm install` 安装依赖。

**Q：端口 3000 被占用**  
A：可设置环境变量更改端口：`set PORT=3001`（Windows）或 `export PORT=3001`（Mac/Linux），再重新启动。

**Q：打开股票预测时无需登录吗？**  
A：是的，股票预测中心无需登录，直接访问 http://localhost:3000/stocks 即可使用。购物功能（加入购物车、下单）需要先注册并登录。

---

## 技术栈

- **后端**：Node.js + Express
- **数据库**：MySQL
- **模板引擎**：EJS
- **身份验证**：JWT + bcryptjs
- **安全**：express-rate-limit 速率限制
- **前端**：HTML5 + CSS3 + JavaScript

## 安全特性

- 密码使用 bcrypt 加密存储
- JWT Token 身份验证 + HTTP-only Cookie
- SQL 注入防护（参数化查询）
- 速率限制（15 分钟内最多 200 次请求）
- 信用卡号脱敏处理（仅保留末四位）

## 授权

ISC License

## 作者

orangeyxc

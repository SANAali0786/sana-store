if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. MIDDLEWARES ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Trust Proxy (Render ke sessions ke liye zaroori hai)
app.set('trust proxy', 1);

app.use(cors({
    origin: ["http://localhost:5173", "https://sana-store.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// --- 2. SESSION CONFIGURATION ---
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session' 
    }),
    secret: process.env.SESSION_SECRET || 'fallback_secret', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        secure: process.env.NODE_ENV === "production", 
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    }
}));

// --- 3. AUTH ROUTES ---
app.get("/", (req, res) => {
    res.send("<h1>Sana Store Backend is Running!</h1>");
});

app.post("/auth/register", async (req, res) => {
    const { name, email, mobile_number, password } = req.body;
    try {
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR mobile_number = $2", 
            [email, mobile_number]
        );
        if(userExists.rows.length > 0) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const newUser = await pool.query(
            "INSERT INTO users (name, email, mobile_number, password, role) VALUES ($1, $2, $3, $4, 'user') RETURNING *",
            [name, email, mobile_number, password]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(401).json({ msg: "Email not found!" });
        const user = result.rows[0];
        if (password === user.password) {
            req.session.user = { id: user.id, name: user.name, role: user.role };
            return res.json({ loggedIn: true, user: req.session.user });
        } else {
            return res.status(401).json({ msg: "Incorrect password!" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

app.get('/auth/user', (req, res) => {
    if (req.session.user) res.json({ loggedIn: true, user: req.session.user });
    else res.json({ loggedIn: false });
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Could not log out");
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
    });
});

// --- 4. PRODUCT ROUTES ---
app.get('/products', async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM products ORDER BY id ASC");
        res.json(allProducts.rows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 5. CART ROUTES ---
app.get("/cart/count", async (req, res) => {
    try {
        if (!req.session || !req.session.user) return res.json({ count: 0 });
        const result = await pool.query("SELECT SUM(quantity) as total FROM cart WHERE user_id = $1", [req.session.user.id]);
        res.json({ count: parseInt(result.rows[0].total) || 0 });
    } catch (err) {
        res.status(500).json({ count: 0 });
    }
});

app.get('/cart', async (req, res) => {
    try {
        if (!req.session.user) return res.status(401).json("Not logged in");
        const cartItems = await pool.query(
            `SELECT cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) as total_price 
             FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1`, [req.session.user.id]
        );
        res.json(cartItems.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.post('/cart/add', async (req, res) => {
    try {
        if (!req.session.user) return res.status(401).json("Please login");
        const { productId } = req.body;
        const existingItem = await pool.query("SELECT * FROM cart WHERE user_id = $1 AND product_id = $2", [req.session.user.id, productId]);
        if (existingItem.rows.length > 0) {
            await pool.query("UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2", [req.session.user.id, productId]);
        } else {
            await pool.query("INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, 1)", [req.session.user.id, productId]);
        }
        res.json("Item added to cart!");
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// --- 6. ADMIN ROUTES (Fixed for Admin Panel) ---
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') next();
    else res.status(403).json({ msg: "Access Denied" });
};

// Add Product
app.post("/admin/add-product", isAdmin, async (req, res) => {
    const { name, price, category, image_url, description } = req.body;
    try {
        const newProduct = await pool.query(
            "INSERT INTO products (name, price, category, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, price, category, image_url, description]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        res.status(500).send("Add failed");
    }
});

// Edit Product
app.post("/admin/edit-product/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, price, category, image_url, description } = req.body;
    try {
        await pool.query(
            "UPDATE products SET name=$1, price=$2, category=$3, image_url=$4, description=$5 WHERE id=$6",
            [name, price, category, image_url, description, id]
        );
        res.json({ msg: "Updated successfully" });
    } catch (err) {
        res.status(500).send("Update failed");
    }
});

// Delete Product
app.delete("/admin/delete-product/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ msg: "Deleted successfully" });
    } catch (err) {
        res.status(500).send("Delete failed");
    }
});

// Fetch Orders (Mock route for now)
app.get("/admin/orders", isAdmin, async (req, res) => {
    try {
        // Agar aapne orders table banaya hai toh wahan se fetch karein
        // Abhi ke liye empty array bhej raha hoon
        res.json([]);
    } catch (err) {
        res.status(500).send("Error fetching orders");
    }
});

// --- 7. SERVER START ---
pool.query('SELECT NOW()', (err, res) => {
    if (err) console.error('DB Connection Error ❌:', err.stack);
    else console.log('Database connected successfully ✅');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT} 🚀`);
});
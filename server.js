const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price REAL,
    stock INTEGER
)`);

app.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({  error: err.message  });
        res.json({  message: "Sukses", data: rows   });
    });
});

app.post('/products', (req, res) => {
    const { name, category, price, stock } = req.body;
    const query = `INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)`;

    db.run(query, [name, category, price, stock], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            productId:this.lastID
        });
    });
});

app.put('/products/:id', (req, res) => {
    const { name, category, price, stock } = req.body;
    const { id } = req.params;
    const query = `UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?`;

    db.run(query, [name, category, price, stock, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Produk berhasil diupdate", changes: this.changes });
    });
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM products WHERE id = ?`, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Produk berhasil dihapus", deleteID: id });
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
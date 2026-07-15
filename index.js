const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',
    database: 'mahasiswa',     
    password: '123',   
    port: 5432,                
});

app.use(express.json());

app.get('/biodata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata');
        
        res.status(200).json({
            message: "Berhasil mengambil data mahasiswa",
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Terjadi kesalahan pada server atau database");
    }
});

// Jalankan server Express
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
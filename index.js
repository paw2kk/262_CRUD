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

//post
app.post('/biodata', async (req, res) => {
    try {
        const { id, nama, nim, kelas } = req.body;
 
        if (!id || !nama || !nim || !kelas) {
            return res.status(400).json({
                message: "Semua field (id, nama, nim, kelas) wajib diisi"
            });
        }
 
        const result = await pool.query(
            'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, nama, nim, kelas]
        );
 
        res.status(201).json({
            message: "Berhasil menambahkan data mahasiswa",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
 
        if (err.code === '23505') {
            return res.status(409).json({
                message: "ID sudah digunakan, gunakan id lain"
            });
        }
 
        res.status(500).send("Terjadi kesalahan pada server atau database");
    }
});


// Jalankan server Express
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
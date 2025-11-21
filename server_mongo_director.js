require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
connectDB();
const director = require('./models/Director');

const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
    res.json({ ok: true, service: 'film-api' });
});

app.get('/directors', async (req, res, next) => {
    try {
        const directors = await director.find({});
        res.json(directors);
    } catch (err) {
        next(err);
    }
});

app.get('/directors/:id', async (req, res, next) => {
    try {
        const directors = await director.findById(req.params.id);
        if (!directors) {
            return res.status(404).json({ error: 'Director tidak ditemukan' });
        }
        res.json(directors);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});

app.post('/directors', async (req, res, next) => {
    try {
        const newDirector = new director({
            name: req.body.name,
            birthYear: req.body.birthYear
        });
        const savedDirector = await newDirector.save();
        res.status(201).json(savedDirector);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
});

app.put('/directors/:id', async (req, res, next) => {
    try {
        const { name, birthYear } = req.body;
        if (!name || !birthYear) {
            return res.status(400).json({ error: 'name, birthYear wajib diisi' });
        }

        const updatedDirector = await director.findByIdAndUpdate(
            req.params.id,
            { name, birthYear }, 
            { new: true, runValidators: true }
        );
        if (!updatedDirector) {
            return res.status(404).json({ error: 'Director tidak ditemukan' });
        }
        res.json(updatedDirector);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});

app.delete('/directors/:id', async (req, res, next) => {
    try {
        const deletedDirector = await director.findByIdAndDelete(req.params.id);
        if (!deletedDirector) {
            return res.status(404).json({ error: 'Film tidak ditemukan' });
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid' });
        }
        next(err);
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Rute tidak ditemukan' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
    console.log('Server aktif di //http:localhost:3300');
});
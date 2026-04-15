var express = require('express');
const Model_mahasiswa = require('../model/Model_mahasiswa');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
var router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        let rows = await Model_mahasiswa.getAll();
        res.render('mahasiswa/index', { data: rows });
    } catch (err) {
        next(err);
    }
});

router.get('/create', function (req, res, next) {
    res.render('mahasiswa/create');
});

router.get('/edit/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let rows = await Model_mahasiswa.getId(id);
        if (!rows || rows.length === 0) {
            req.flash('error', 'Data mahasiswa tidak ditemukan.');
            return res.redirect('/mahasiswa');
        }
        let mahasiswa = rows[0];
        res.render('mahasiswa/edit', {
            mahasiswa
        });
    } catch (err) {
        next(err);
    }
});

router.get('/delete/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let rows = await Model_mahasiswa.getId(id);
        if (!rows || rows.length === 0) {
            req.flash('error', 'Data mahasiswa tidak ditemukan.');
            return res.redirect('/mahasiswa');
        }

        let foto = rows[0].foto;
        let result = await Model_mahasiswa.delete(id);
        if (result && result.affectedRows > 0) {
            if (foto) {
                let pathFoto = path.join(__dirname, '../public/images', foto);
                fs.unlink(pathFoto, function (err) {
                    if (err && err.code !== 'ENOENT') {
                        console.error('Gagal menghapus file foto lama:', err);
                    }
                });
            }
            req.flash('success', 'Data mahasiswa berhasil dihapus!');
        } else {
            req.flash('error', 'Gagal menghapus data mahasiswa.');
        }
        res.redirect('/mahasiswa');
    } catch (err) {
        next(err);
    }
});

router.post('/simpan', upload.single('foto'), async function (req, res, next) {
    try {
        const { nrp, nama, jenis_kelamin, alamat } = req.body;
        const mahasiswa = {
            nrp,
            nama,
            jenis_kelamin,
            alamat
        };
        if (req.file) {
            mahasiswa.foto = req.file.filename;
        }

        await Model_mahasiswa.simpan(mahasiswa);
        req.flash('success', 'Data mahasiswa berhasil disimpan!');
        res.redirect('/mahasiswa');
    } catch (err) {
        console.error('Gagal menyimpan mahasiswa:', err);
        req.flash('error', 'Terjadi kesalahan saat menyimpan data.');
        res.redirect('/mahasiswa/create');
    }
});

router.post('/update/:id', upload.single('foto'), async function (req, res, next) {
    try {
        let id = req.params.id;
        let { nama, jenis_kelamin, alamat } = req.body;
        let Data = {
            nama,
            jenis_kelamin,
            alamat
        };

        let oldFoto = null;
        if (req.file) {
            let rows = await Model_mahasiswa.getId(id);
            if (rows && rows.length > 0) {
                oldFoto = rows[0].foto;
            }
            Data.foto = req.file.filename;
        }

        await Model_mahasiswa.update(id, Data);

        if (req.file && oldFoto && oldFoto !== Data.foto) {
            let oldPath = path.join(__dirname, '../public/images', oldFoto);
            fs.unlink(oldPath, function (err) {
                if (err && err.code !== 'ENOENT') {
                    console.error('Gagal menghapus foto lama:', err);
                }
            });
        }

        req.flash('success', 'Data mahasiswa berhasil diperbarui!');
        res.redirect('/mahasiswa');
    } catch (err) {
        console.error('Gagal memperbarui mahasiswa:', err);
        req.flash('error', 'Terjadi kesalahan saat memperbarui data.');
        res.redirect('/mahasiswa');
    }
});

module.exports = router;

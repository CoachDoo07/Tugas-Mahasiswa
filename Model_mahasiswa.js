const connection = require('../config/database');

class Model_mahasiswa {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM mahasiswa ORDER BY id_mahasiswa ASC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async simpan(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO mahasiswa (nrp, nama, jenis_kelamin, alamat, foto) VALUES (?, ?, ?, ?, ?)',
                [data.nrp, data.nama, data.jenis_kelamin, data.alamat, data.foto || null],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM mahasiswa WHERE id_mahasiswa = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE mahasiswa SET ? WHERE id_mahasiswa = ?', [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM mahasiswa WHERE id_mahasiswa = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_mahasiswa;

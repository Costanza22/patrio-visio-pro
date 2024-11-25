import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "joipatrio.mysql.database.azure.com",
  user: "costanza22",
  password: "Nikita22!",
  database: "joipatrio",
  ssl: { rejectUnauthorized: false },
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1); // Encerra a aplicação se houver erro
  }
  console.log('Conectado ao MySQL');
});

// Configuração do multer
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Cria a pasta 'uploads' caso não exista
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Funções reutilizáveis
const handleDatabaseError = (err, res, message) => {
  console.error(message, err);
  res.status(500).json({ error: message });
};

const buildUpdateQuery = (fields) => {
  const keys = Object.keys(fields).filter((key) => fields[key] !== undefined);
  const placeholders = keys.map((key) => `${key} = ?`).join(', ');
  const values = keys.map((key) => fields[key]);
  return { placeholders, values };
};

// Função de configuração do Vercel
export default async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/casaroes/upload') {
    return upload.single('image')(req, res, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const { name, description, location, cep, date } = req.body;
      const image_path = req.file?.path || null;

      const sql = 'INSERT INTO casaroes (name, description, location, cep, image_path, date) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [name, description, location, cep, image_path, date || null], (err, results) => {
        if (err) return handleDatabaseError(err, res, 'Erro ao cadastrar o casarão');
        res.status(201).json({ id: results.insertId, name, description, location, cep, image_path, date });
      });
    });
  }

  if (req.method === 'GET' && req.url === '/api/casaroes') {
    const sql = 'SELECT id, name, description, location, image_path, date FROM casaroes';
    db.query(sql, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'Erro ao consultar casarões');
      res.json(results);
    });
  }

  if (req.method === 'PUT' && req.url.startsWith('/api/casaroes/')) {
    const id = req.url.split('/')[3];  // Captura o ID da URL
    return upload.single('image')(req, res, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const { name, description, location, cep, date } = req.body;
      const image_path = req.file?.path;
      const { placeholders, values } = buildUpdateQuery({ name, description, location, cep, date, image_path });

      if (!placeholders) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      const sql = `UPDATE casaroes SET ${placeholders} WHERE id = ?`;
      db.query(sql, [...values, id], (err, results) => {
        if (err) return handleDatabaseError(err, res, 'Erro ao atualizar o casarão');
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Casarão não encontrado' });
        res.json({ message: 'Casarão atualizado com sucesso' });
      });
    });
  }

  if (req.method === 'DELETE' && req.url.startsWith('/api/casaroes/')) {
    const id = req.url.split('/')[3];  // Captura o ID da URL
    const sql = 'DELETE FROM casaroes WHERE id = ?';

    db.query(sql, [id], (err, results) => {
      if (err) return handleDatabaseError(err, res, 'Erro ao excluir o casarão');
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Casarão não encontrado' });
      res.json({ message: 'Casarão excluído com sucesso' });
    });
  }

  // Rota para verificar o status do servidor
  if (req.method === 'GET' && req.url === '/') {
    res.send('Backend está rodando no Vercel!');
  }
};

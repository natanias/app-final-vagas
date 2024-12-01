const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { authenticateToken } = require('../middlewares/authenticateToken');
const SECRET_KEY = process.env.SECRET_KEY || 'seu_segredo_super_secreto';

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await Usuario.create({
      nome,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter todos os usuários
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter usuário por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo usuário
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await Usuario.create({
      nome,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um usuário
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const user = await Usuario.findByPk(req.params.id);

    if (user) {
      user.nome = nome;
      user.email = email;
      user.senha = senha ? await bcrypt.hash(senha, 10) : user.senha;
      await user.save();
      res.json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar um usuário
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

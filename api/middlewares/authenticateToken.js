const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'seu_segredo_super_secreto';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };

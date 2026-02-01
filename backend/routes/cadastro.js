const express = require('express');
const router = express.Router();

const { criarPreCadastro } = require('../controllers/preCadastro.controller');

router.post('/pre-cadastro', criarPreCadastro);

module.exports = router;

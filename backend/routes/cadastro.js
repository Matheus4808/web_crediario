import mysql from '../database/db.js';
import express from 'express';

const router = express.Router();

router.post('/pre-cadastro', async (req, res) => {
    try {
        const {
            nomeCompleto,
            nomeMae,
            nomePai,
            estadoCivil,
            sexo,
            cep,
            cidade,
            cpf,
            telefone,
            email,
            dataNascimento,
            endereco,
            salario
        } = req.body;

        const cepLimpo = cep.replace(/\D/g, '');
        const cpfLimpo = cpf.replace(/\D/g, '');

        const [result] = await mysql.execute(
            `INSERT INTO pre_cadastros (
        nome_completo,
        nome_mae,
        nome_pai,
        estado_civil,
        sexo,
        cpf,
        telefone,
        email,
        cep,
        cidade,
        endereco,
        data_nascimento,
        salario,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'em_analise')`,
            [
                nomeCompleto,
                nomeMae,
                nomePai,
                estadoCivil,
                sexo,
                cpfLimpo,
                telefone,
                email,
                cepLimpo,
                cidade,
                endereco,
                dataNascimento,
                salario
            ]
        );

        return res.status(201).json({ message: 'Pré-cadastro criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar pré-cadastro:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/cadastros', async (req, res) => {
    try {
        const [rows] = await mysql.execute('SELECT * FROM pre_cadastros');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar pré-cadastros:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.put('/cadastros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, limite_credito } = req.body;

        const [result] = await mysql.execute(
            `UPDATE pre_cadastros
SET status = ?, limite_credito = ?
WHERE id = ?
`,
            [status, limite_credito, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pré-cadastro não encontrado' });
        }
        res.json({ message: 'Pré-cadastro atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar pré-cadastro:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;
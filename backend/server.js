import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cadastro from './routes/cadastro.js';
import auth from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
// const corsOptions = {
//   origin: "http://localhost:3000", // frontend permitido
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

app.use('/', cadastro);
app.use('/auth', auth);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
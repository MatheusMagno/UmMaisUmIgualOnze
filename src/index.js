require('dotenv').config();
const express = require('express');
const app = express();
const rotas = require('./rotas');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(process.env.PORT);

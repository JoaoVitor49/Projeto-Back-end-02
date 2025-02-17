require('dotenv').config()
const express = require('express')
const mustacheExpress = require('mustache-express');
const cookieParser = require("cookie-parser")
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes');

const { User, Ticket, Schedule, Purchase, sequelize } = require('./models/indexModel')

const app = express()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', './views')

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes)
app.use('/purchases', purchaseRoutes )

sequelize.sync()
    .then(() => {
        console.log('Tabelas criadas com sucesso!');
        app.listen(3000, () => {
            console.log('Servidor ouvindo na porta 3000');
        });
    })
    .catch((error) => {
        console.error('Erro ao criar tabelas:', error);
    });


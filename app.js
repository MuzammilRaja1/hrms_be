const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/employee', employeeRoutes);
app.use('/api/leave', leaveRoutes);


app.use(errorHandler);

module.exports = app;

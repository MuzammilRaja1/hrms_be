const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const designationRoutes = require('./routes/designationRoutes');
const projectRoutes = require('./routes/projectRoutes');

const errorHandler = require('./middlewares/errorHandler');
require('./cronJobs'); 

const app = express();

const corsOptions = {
  origin: ['https://hrm-fe.dboss.pk', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/employee', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api', designationRoutes);
app.use('/api', projectRoutes);


app.use(errorHandler);

module.exports = app;

const app = require('./app');

const sequelize = require('./config/database');
const { createDefaultAdmin } = require('./controllers/employeeController');

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    // createDefaultAdmin();
    app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));

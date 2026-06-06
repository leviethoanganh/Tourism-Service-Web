const express = require('express')
const path = require('path');
const { pathAdmin } = require("./configs/variable.config");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./configs/database.config');
connectDB();

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// CORS - cho phép React app (port 5173) gọi API
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// API routes cho React app
const apiRoutes = require("./routers/api/index.router");
app.use("/api/v1", apiRoutes);

const clientRoutes = require("./routers/client/index.route");
app.use('/', clientRoutes);

global.pathAdmin = pathAdmin;
app.locals.pathAdmin = pathAdmin;

const adminRoutes = require("./routers/admin/index.router");
app.use(`/${pathAdmin}`, adminRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// kozRqcrBCFOD9YDn

// user_123

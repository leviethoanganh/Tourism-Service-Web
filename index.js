const express = require('express')
const path = require('path');
const  { pathAdmin } = require ( "./configs/variable.config" );
const  cookieParser  =  require ( 'cookie-parser' );

const connectDB = require('./configs/database.config');
connectDB();

const app = express()
const port = 3000

// contain files PUG for giao dien chinh
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

// contain static files like css, js, images, ...
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

const  clientRoutes  =  require ( "./routers/client/index.route" );
app . use ( '/' ,  clientRoutes );

global.pathAdmin = pathAdmin;

// This is a big file PUG
app.locals.pathAdmin = pathAdmin;


const  adminRoutes  =  require ( "./routers/admin/index.router" );
app . use ( `/${ pathAdmin }` ,  adminRoutes );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// kozRqcrBCFOD9YDn

// user_123

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const Passport = require('passport');
const cors = require('cors');
const passport = require('./user_routes--/user_route--/crtl_models-/googleOath.js')
const { mongo_Connection } = require('./user_routes--/user_route--/DB/connection.js');
const github = require('./user_routes--/user_route--/crtl_models-/githubOauht.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const verifyToken = require('./user_routes--/user_route--/Autherization/verifyToken.js');
const new_Cart = require('./user_routes--/user_route--/cart_session/cart_control.js');
const port = 4000;
require('dotenv').config();

mongo_Connection();
const user_Routes = require('./user_routes--/user_route--/user_route.js');
const admin_Routes = require('./user_routes--/admin_route/admin-routes.js');
app.use((req, res, next) => {
console.log(req.headers.get('cookies')
            req.headers['access'];
console.log('All Headers:', Object.fromEntries(req.headers));
    next();
});

// ✅ FIXED CORS - Add ALL your domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000', 
  'https://saastoola-b3f60.web.app',        // ADD YOUR FIREBASE DOMAIN
  //'https://your-firebase-app.firebaseapp.com', // ADD YOUR FIREBASE DOMAIN
  'https://grahql-apollo-server.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// ✅ FIXED Session Configuration
app.use(session({
  secret: process.env.session_secret || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.db_storage,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,        // ✅ FIXED: 'httpOnly' not 'httpsOnly'
    secure: true,          // ✅ FIXED: true for production (HTTPS)
    sameSite: 'none',      // ✅ FIXED: 'none' for cross-domain
    maxAge: 24 * 60 * 60 * 1000
  }
}));

  app.use(Passport.initialize());
app.use(Passport.session());

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/user_side', user_Routes);
app.use('/admin_side', admin_Routes);

app.listen(port, '0.0.0.0', () => {
  console.log("Server 1 is running on port 4000");
});

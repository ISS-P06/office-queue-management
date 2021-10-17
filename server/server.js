'use strict';

import express from 'express';
import morgan from 'morgan';
import cron from 'node-cron';
import { check, validationResult, checkSchema } from 'express-validator';

import * as DAO from './dao';

/* passport setup */
import passport from 'passport';
import session from 'express-session';
import { Strategy } from 'passport-local';

passport.use(
  new Strategy((username, password, done) => {
    // todo: userDao.getUser
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // todo: userDao.getUserById
});

/* express setup */
const port = 3001;
const app = new express();

app.use(morgan('dev'));
app.use(express.json());

// session middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ err: 'not authenticated' });
};

app.use(
  session({
    secret: 'secret sentence not to be shared',
    resave: false,
    saveUninitialized: false,
    // NOTE this fix a firefox warning for cookies
    cookie: { sameSite: 'strict' },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* Node-cron setup
   Reset the ticket at midnight, every day
*/
cron.schedule(
  '0 0 * * *',
  async () => {
    await DAO.reset();
  },
  {
    scheduled: true,
    timezone: 'Europe/Rome',
  }
);

/*** APIs ***/

app.get('/api/hello/:num', [check('num').isInt()], (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json({ err: err.array() });
  }

  const num = req.params.num;

  res.status(200).json({ msg: 'hello world', num: num });
});

/*** Officers APIs ***/
/* Used to call the next client */
app.post('/api/officer/callNextClient', function (req, res, next) {
  console.log('backend');
});

/*** Users APIs ***/
/* login */
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

/* logout */
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

/* check whether the user is logged in or not */
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: 'Unauthenticated user!' });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

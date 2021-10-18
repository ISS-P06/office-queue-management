'use strict';

import express from 'express';
import morgan from 'morgan';
import cron from 'node-cron';

import { check, validationResult, checkSchema } from 'express-validator';

import { getServices, insertNewTicket } from './dao';
import * as DAO from './dao';

/* passport setup */
import passport from 'passport';
import session from 'express-session';
import { Strategy } from 'passport-local';
import { getQueueStatus } from './queue-dao';

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
app.post(
  '/api/officers/callNextClient',
  // TODO add isLoggedIn check
  [check('idCounter').isInt()],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(422).json({ err: err.array() });
    }

    const { idCounter, idTicketServed } = req.body;

    try {
      const id = await DAO.callNextClient(idCounter, idTicketServed);
      console.log(id);
      res.status(200).json(id);
    } catch (e) {
      // console.log(e);
      res.status(503).json({ error: 'Error in calling the next client' });
    }
  }
);

// Route used to get the current queue status
app.get('/api/getQueueData', (req, res) => {
  getQueueStatus()
    .then((queueStatus) => res.json(queueStatus))
    .catch(() => res.status(500).end());
});

// get the services and their types
app.get('/api/get_service_types', (req, res) => {
  getServices()
    .then((services) => {
      return res.json(services);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//insert the selected ticket
app.post('/api/insert-selected-ticket', async (req, res) => {
  let serviceID = req.body.serviceID;
  try {
    await insertNewTicket(serviceID);
    res.end();
  } catch (err) {
    res.status(500).json(err);
  }
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

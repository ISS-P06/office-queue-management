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

import { listServices, createService, deleteServices, deleteService } from './dao';
import {
  listCounters,
  listOfferedServices,
  createCounter,
  createOfferedService,
  deleteCounter,
} from './dao';
import { listOfficers, createOfficer, deleteOfficer } from './dao';

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

//
// Service APIs
//
// to do: authentication

// GET /api/services
app.get('/api/services', (req, res) => {
  listServices()
    .then((services) => res.json(services))
    .catch(() => res.status(500).end());
});

// POST /api/services
app.post(
  '/api/services',
  //isLoggedIn,
  [
    check('name').isLength({ min: 1, max: 100 }),
    check('service_time').isFloat({ min: 0.01, max: 1440.0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const service = {
      name: req.body.name,
      service_time: req.body.service_time,
    };
    try {
      await createService(service);
      res.status(201).json({});
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error during the creation of service ${service.name}.` });
    }
  }
);

// DELETE /api/services/<id>
app.delete(
  '/api/services/:id',
  //isLoggedIn,
  [check('id').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await deleteService(req.params.id);
      res.status(200).json({});
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error during the deletion of service ${req.params.id}.` });
    }
  }
);

// DELETE /api/services
app.delete(
  '/api/services',
  //isLoggedIn,
  async (req, res) => {
    try {
      await deleteServices();
      res.status(204).end();
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of services.` });
    }
  }
);

//
// Officer APIs
//
// to do: authentication

// GET /api/officers
app.get('/api/officers', (req, res) => {
  listOfficers()
    .then((officers) => res.json(officers))
    .catch(() => res.status(500).end());
});

// POST /api/officers
app.post(
  '/api/officers',
  //isLoggedIn,
  [
    check('username').isLength({ min: 1, max: 100 }),
    check('password').isLength({ min: 8, max: 20 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const officer = {
      username: req.body.username,
      password: req.body.password,
      role: 'officer',
    };
    try {
      await createOfficer(officer);
      res.status(201).json({});
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error during the creation of officer ${officer.username}.` });
    }
  }
);

// DELETE /api/officers/<id>
app.delete(
  '/api/officers/:id',
  //isLoggedIn,
  [check('id').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await deleteOfficer(req.params.id);
      res.status(200).json({});
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error during the deletion of officer ${req.params.id}.` });
    }
  }
);

//
// Counter APIs
//
// to do: authentication

// GET /api/counters
app.get('/api/counters', (req, res) => {
  listCounters()
    .then((counters) => res.json(counters))
    .catch(() => res.status(500).end());
});

// GET /api/offered-services
app.get('/api/offered-services', (req, res) => {
  listOfferedServices()
    .then((services) => res.json(services))
    .catch(() => res.status(500).end());
});

// POST /api/counters
app.post(
  '/api/counters',
  //isLoggedIn,
  [check('id').isInt(), check('officer').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const c = {
      id: req.body.id,
      officer: req.body.officer,
    };
    try {
      await createCounter(c);
      res.status(201).json({});
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of the counter` });
    }
  }
);

// POST /api/offered-services
app.post(
  '/api/offered-services',
  //isLoggedIn,
  [check('cid').isInt(), check('sid').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const os = {
      cid: req.body.cid,
      sid: req.body.sid,
    };
    try {
      await createOfferedService(os);
      res.status(201).json({});
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of the offered service` });
    }
  }
);

// DELETE /api/counters/<id>
app.delete(
  '/api/counters/:id',
  //isLoggedIn,
  [check('id').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await deleteCounter(req.params.id);
      res.status(200).json({});
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error during the deletion of counter ${req.params.id}.` });
    }
  }
);

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

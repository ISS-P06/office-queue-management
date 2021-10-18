const axios = require('axios');

export const api_login = async (credentials) => {
  try {
    let res = await axios.post('/api/sessions', {
      username: credentials.username,
      password: credentials.password,
    });
    if (res.data.username) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 401) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in logging in');
    }
  }
};

export const api_logout = () => {
  axios
    .delete('/api/sessions/current')
    .then((res) => {
      // ...
    })
    .catch((res) => {
      // ...
    });
};

export const api_getUserInfo = async () => {
  try {
    const res = await axios.get('/api/sessions/current');
    if (res.data.id) {
      return res.data;
    } else {
      throw res.data.message;
    }
  } catch (err) {
    if (err.response.data.message) {
      throw new Error(err.response.data.message);
    } else if (err.response.data.error) {
      throw new Error(err.response.data.error);
    } else {
      throw new Error('Sorry, there was an error in logging in');
    }
  }
};

//
// Service API HTTP requests
//

export const api_getServices = async () => {
  try {
    const res = await axios.get('/api/services');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the services');
    }
  }
};

export const api_addService = async (service) => {
  try {
    const res = await axios.post('/api/services', {
      name: service.name,
      service_time: service.service_time,
    });
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in adding the new service');
    }
  }
};

export const api_deleteService = async (service) => {
  try {
    const res = await axios.delete('/api/services/' + service.id);
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in deleting the service');
    }
  }
};

//
// Counter API HTTP requests
//

export const api_getCounters = async () => {
  try {
    const res = await axios.get('/api/counters');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the counters');
    }
  }
};

export const api_getOfferedServices = async () => {
  try {
    const res = await axios.get('/api/offered-services');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the offered services');
    }
  }
};

export const api_addCounter = async (counter) => {
  try {
    const res = await axios.post('/api/counters', {
      id: counter.id,
      officer: counter.officer,
    });
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in adding the new counter');
    }
  }
};

export const api_addOfferedService = async (os) => {
  try {
    const res = await axios.post('/api/offered-services', {
      cid: os.cid,
      sid: os.sid,
    });
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in adding the new offered service');
    }
  }
};

export const api_deleteCounter = async (counter) => {
  try {
    const res = await axios.delete('/api/counters/' + counter.id);
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in deleting the counter');
    }
  }
};

//
// Officer API HTTP requests
//

export const api_getOfficers = async () => {
  try {
    const res = await axios.get('/api/officers');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the officers');
    }
  }
};

export const api_addOfficer = async (officer) => {
  try {
    const res = await axios.post('/api/officers', {
      username: officer.username,
      password: officer.password,
    });
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in adding the new officer');
    }
  }
};

export const api_deleteOfficer = async (officer) => {
  try {
    const res = await axios.delete('/api/officers/' + officer.id);
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 422 || err.response.status == 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in deleting the officer');
    }
  }
};

export const api_callNextClient = async (idCounter, idTicketServed) => {
  try {
    let res = await axios.post('api/officers/callNextClient', {
      idCounter: idCounter,
      idTicketServed: idTicketServed,
    });
    if (res.data) {
      return res.data;
    } else {
      throw new Error('There is no ticket to serve currently');
    }
  } catch (err) {
    if (err) {
      throw new Error(err);
    } else {
      throw new Error('Sorry, there was an error in calling the next client');
    }
  }
};

export const apiInsertTicket = async (serviceID) => {
  await fetch('api/insert-selected-ticket', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ serviceID: serviceID }),
  });
};

export const api_getQueueData = async () => {
  try {
    const res = await axios.get('/api/getQueueData');
    if (res.data) {
      console.log(res.data);
      return res.data;
    } else {
      throw res.data.error;
    }
  } catch (err) {
    throw new Error('Error: could not get queue data');
  }
};

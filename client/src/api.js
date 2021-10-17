const axios = require('axios');

const api_login = async (credentials) => {
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

const api_logout = () => {
  axios
    .delete('/api/sessions/current')
    .then((res) => {
      // ...
    })
    .catch((res) => {
      // ...
    });
};

const api_getUserInfo = async () => {
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

const api_getServices = async () => {
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

const api_addService = async (service) => {
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

const api_deleteService = async (service) => {
  try {
    const res = await axios.delete('/api/services/'+service.id);
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

const api_getCounters = async () => {
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

const api_getOfferedServices = async () => {
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

const api_addCounter = async (counter) => {
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

const api_addOfferedService = async (os) => {
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

const api_deleteCounter = async (counter) => {
  try {
    const res = await axios.delete('/api/counters/'+counter.id);
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

const api_getOfficers = async () => {
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

const api_addOfficer = async (officer) => {
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

const api_deleteOfficer = async (officer) => {
  try {
    const res = await axios.delete('/api/officers/'+officer.id);
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

export { api_login, api_logout, api_getUserInfo, api_getServices, api_deleteService, api_addService, api_getCounters, api_getOfferedServices, api_getOfficers, api_addOfficer, api_addCounter, api_addOfferedService, api_deleteCounter, api_deleteOfficer };

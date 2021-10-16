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

export { api_login, api_logout, api_getUserInfo, api_getServices, api_deleteService, api_addService };

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

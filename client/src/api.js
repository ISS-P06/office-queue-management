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

const api_callNextClient = async (idCounter, idTicketServed) => {
  console.log(api_callNextClient);
  console.log(idCounter);
  console.log(idTicketServed);
  try {
    let res = await axios.post('/api/officer/callNextClient', {
      idCounter: idCounter,
      idTicketServed: idTicketServed,
    });
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status == 401) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in calling the next client');
    }
  }
};
export { api_login, api_logout, api_getUserInfo, api_callNextClient };

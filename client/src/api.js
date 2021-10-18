const axios = require('axios');

const api_login = async (credentials) => {
    try {
        let res = await axios.post("/api/sessions", {
                username: credentials.username,
                password: credentials.password
            }
        );
        if (res.data.username) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if (err.response.status == 401) {
            throw new Error(err.response.data);
        } else {
            throw new Error("Sorry, there was an error in logging in");
        }
    }
}

const api_logout = () => {
    axios.delete("/api/sessions/current")
        .then((res) => {
            // ...
        })
        .catch((res) => {
            // ...
        });
}

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
            throw new Error("Sorry, there was an error in logging in");
        }
    }
}

const apiGetServices = async () => fetch('/api/get_service_types')
    .then(response => response.json())
    .catch(err => {
        console.log("ERROR", err)
    });

const apiInsertTicket = async (serviceID)=>{
    await fetch('api/insert-selected-ticket', {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({serviceID : serviceID})
    })
}


export {api_login, api_logout, api_getUserInfo, apiGetServices, apiInsertTicket};

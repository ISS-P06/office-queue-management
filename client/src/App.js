import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { api_login, api_logout, api_getUserInfo, api_addCounter, api_addOfferedService } from './api';
import { Row, Col, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import AppNavbar from './components/AppNavbar';

import ServiceConfiguration from './components/ServiceConfiguration';
import CounterConfiguration from './components/CounterConfiguration';
import { api_getServices, api_addService, api_deleteService } from './api';
import { api_getCounters, api_getOfferedServices, api_deleteCounter } from './api';
import { api_getOfficers, api_addOfficer, api_deleteOfficer } from './api';

function App() {
  // loggedIn: whether the user is logged in or not
  const [loggedIn, setLoggedIn] = useState(true);
  // userRole: the logged-in user's role; default: empty string
  /* Possible values:
      - admin
      - manager
      - officer
      - (empty string)
  */
  const [userRole, setUserRole] = useState('admin');
  // configDone: whether the system has been configured for the first time
  const [configDone, setConfigDone] = useState(false);

  // useEffect used to check whether the user is logged in or not
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const info = await api_getUserInfo();
        setLoggedIn(true);
        setUserRole(info.role);
      } catch (err) {
        console.error(err);
      }
    };
    checkAuth();
  }, [loggedIn]);

  // method used to log in a user
  const doLogin = async (credentials) => {
    try {
      await api_login(credentials);
      setLoggedIn(true);
      return { done: true, msg: 'ok' };
    } catch (err) {
      return { done: false, msg: err.message };
    }
  };

  // method used to log out a user
  const doLogout = async () => {
    await api_logout();
    setLoggedIn(false);
  };


  //
  // Configuration code
  //

  const [serviceList, setServiceList] = useState([]);
  const [counterList, setCounterList] = useState([]);
  const [officerList, setOfficerList] = useState([]);
  const [offeredServiceList, setOfferedServiceList] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [confStep, setConfStep] = useState(1);

  useEffect(() => {
    if (dirty) {
      callGetServices();
    }
  }, [dirty]);

  const callGetServices = () => {
    api_getServices()
    .then(services => {
      setServiceList(services);
      callGetCounters();
    })
    .catch(e => handleErrors(e));
  }

  const callGetCounters = () => {
    api_getCounters()
    .then(counters => {
      setCounterList(counters);
      callGetOfferedServices();
    })
    .catch(e => handleErrors(e));
  }

  const callGetOfferedServices = () => {
    api_getOfferedServices()
      .then(os => {
        setOfferedServiceList(os);
        callGetOfficers();
      })
      .catch(e => handleErrors(e));
  }

  const callGetOfficers = () => {
    api_getOfficers()
      .then(o => {
        setOfficerList(o);
        setDirty(false);
      })
      .catch(e => handleErrors(e));
  }

  const handleErrors = (err) => {
    console.log(err.error);
  }

  const deleteService = (service) => {
    if(!service.status){
      service.status = "deleted"
      api_deleteService(service)
        .then(() => setDirty(true) )
        .catch(e => handleErrors(e))
    }
  }

  const addService = (service) => {
    service.status = "add";
    const id = Math.max(...serviceList.map( s => s.id )) + 1;
    setServiceList(oldList => [...oldList, { id: id, ...service }]);
    api_addService(service)
        .then(() => setDirty(true))
        .catch(e => handleErrors(e));
  }

  const addCounter = (officer, services) => {
    officer.status = "add";
    let oid = Math.max(...officerList.map( o => o.id )) + 1;
    if(officerList.length == 0){
      oid = 1;
    }
    setOfficerList(oldList => [...oldList, { id: oid, ...officer.username }]);
    api_addOfficer(officer)
        .then(() => {

          let cid = Math.max(...counterList.map( c => c.id )) + 1;
          if(counterList.length == 0){
            cid = 1;
          }
          setCounterList(oldList => [...oldList, { id: cid, officer: oid }]);
          api_addCounter({ id: cid, officer: oid })
          .then(() => {
            for(let i = 0; i < services.length; i++){
              let newService = Object.assign({}, { cid: cid, sid: services[i] });
              let serviceName = serviceList.filter(s => s.id == services[i]).map(s => s.name);
              setOfferedServiceList(oldList => [...oldList, { counter_id: cid, service_id: services[i], service_name: serviceName }]);
              api_addOfferedService(newService)
              .then(() => {
                setDirty(true);
              })
              .catch(e => handleErrors(e));
            }

          })
          .catch(e => handleErrors(e));

        })
        .catch(e => handleErrors(e));
  }

  const deleteCounter = (counter) => {
    if(!counter.status){
      counter.status = "deleted"
      api_deleteCounter(counter)
        .then(() => {

            api_deleteOfficer({id: counter.officer})
              .then(() => {
                setDirty(true);
              })
              .catch(e => handleErrors(e))
        
        })
        .catch(e => handleErrors(e))
    }
  }

  return (
    <Container className="App p-0 m-0" fluid>
      <Router>
        <AppNavbar loggedIn={loggedIn} doLogout={doLogout} />

        <Switch>
          {/* Admin-exclusive route for the configuration of services*/}
          <Route path="/setup/services">
            {loggedIn ? (
              userRole === 'admin' ? (
                <ServiceConfiguration serviceList={serviceList} onNext={()=>setConfStep(2)} onDelete={deleteService} onAdd={addService}></ServiceConfiguration>
              ) : (
                <DefaultUserRedirect
                  loggedIn={loggedIn}
                  userRole={userRole}
                  configDone={configDone}
                />
              )
            ) : (
              <Redirect to="/home" />
            )}
          </Route>

          {/* Admin-exclusive route for the configuration of counters*/}
          <Route path="/setup/counters">
            {loggedIn ? (
              userRole === 'admin' ? (
                <CounterConfiguration serviceList={serviceList} counterList={counterList} offeredServiceList={offeredServiceList} officerList={officerList} onAdd={addCounter} onDelete={deleteCounter} onBack={()=>setConfStep(1)}></CounterConfiguration>
              ) : (
                <DefaultUserRedirect
                  loggedIn={loggedIn}
                  userRole={userRole}
                  configDone={configDone}
                />
              )
            ) : (
              <Redirect to="/home" />
            )}
          </Route>

          {/* Admin-exclusive route for resetting the configuration*/}
          <Route path="/setup">
            {loggedIn ? (
              userRole === 'admin' ? (
                <div />
              ) : (
                <DefaultUserRedirect
                  loggedIn={loggedIn}
                  userRole={userRole}
                  configDone={configDone}
                />
              )
            ) : (
              <Redirect to="/home" />
            )}
          </Route>

          {/* Manager-exclusive route for viewing statistics*/}
          <Route path="/stats">
            {loggedIn ? (
              userRole === 'manager' ? (
                <div />
              ) : (
                <DefaultUserRedirect
                  loggedIn={loggedIn}
                  userRole={userRole}
                  configDone={configDone}
                />
              )
            ) : (
              <Redirect to="/home" />
            )}
          </Route>

          {/* Officer-exclusive route to call in the next customer */}
          <Route path="/counter">
            {loggedIn ? (
              userRole === 'officer' ? (
                <div />
              ) : (
                <DefaultUserRedirect
                  loggedIn={loggedIn}
                  userRole={userRole}
                  configDone={configDone}
                />
              )
            ) : (
              <Redirect to="/home" />
            )}
          </Route>

          {/* Login route */}
          <Route path="/login">
            {loggedIn ? (
              <DefaultUserRedirect
                loggedIn={loggedIn}
                userRole={userRole}
                configDone={configDone}
              />
            ) : (
              <div />
            )}
          </Route>

          {/* Home/customer route */}
          <Route path="/home">
            {loggedIn ? (
              <DefaultUserRedirect
                loggedIn={loggedIn}
                userRole={userRole}
                configDone={configDone}
              />
            ) : (
              <div />
            )}
          </Route>

          {/* Default route - redirects to /home */}
          <Route>
            <Redirect to="/home" />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

// Component used to redirect the user to their default page
function DefaultUserRedirect(props) {
  const loggedIn = props.loggedIn;
  const userRole = props.userRole;
  const configDone = props.configDone;

  const renderSwitch = (role) => {
    switch (role) {
      case 'admin':
        if (configDone) {
          return <Redirect to="/setup" />;
        } else {
          return <Redirect to="/setup/services" />;
        }
      case 'manager':
        return <Redirect to="/stats" />;
      case 'officer':
        return <Redirect to="/counter" />;
      default:
        return <Redirect to="/home" />;
    }
  };

  return (
    <div>
      loggedIn ?
      <Redirect to="/home" />
      :
      <Redirect to="/home" />
    </div>
  );
}

export default App;

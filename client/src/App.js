import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Play from './components/game/Play';
import Counting from './components/game/Counting';
import Learn from './components/game/Learn';
import LearnCounting from './components/game/LearnCounting';
import PrivateRoute from './components/routing/PrivateRoute';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
//redux
import { Provider } from 'react-redux';
import store from './store';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container-fluid hold-alert'>
          <Alert />
            <Switch>
              <Route exact path='/register' component={Register} /> */}
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/play-black-jack' component={Play} />
              <PrivateRoute exact path='/learn-black-jack' component={Learn} />
              <PrivateRoute exact path='/play-black-jack-counting' component={Counting} />
              <PrivateRoute exact path='/learn-to-play-black-jack-counting' component={LearnCounting} />
            </Switch>
          </section>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;

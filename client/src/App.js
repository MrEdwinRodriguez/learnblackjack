import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import './App.css';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <Route exact path='/register' component={Register} />
        <section className='container'>
          <Switch>
            {/* <Route exact path='/register' component={Register} /> */}
            <Route exact path='/login' component={Login} />
          </Switch>
        </section>
        <Footer />
      </Fragment>
    </Router>
  );
}

export default App;

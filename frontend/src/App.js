import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NavBar from './components/navBar';
import LandingPage from './containers/home/landingPage';
import Terms from './containers/home/terms';
import Login from './containers/users/login';
import Register from './containers/users/register';
import Dashboard from './containers/expenses/dashboard';

class App extends Component {
  render() {
    return (
      <Router>
        <div
          className='d-flex flex-column'
          style={{ height: '100vh', overflow: 'hidden' }}
        >
          <NavBar />
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/about/terms' component={Terms} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </div>
      </Router>
    );
  }
}

export default App;
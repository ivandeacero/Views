import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
// react library for routing
import { Router, Route, Switch } from 'react-router-dom';
import ErrorHandler from './utils/errorHandler';

// plugins styles from node_modules
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
// plugins styles downloaded
import 'assets/vendor/fullcalendar/dist/fullcalendar.min.css';
import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
import 'assets/vendor/select2/dist/css/select2.min.css';
import 'assets/vendor/quill/dist/quill.core.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
// core styles
import 'assets/scss/argon-dashboard-pro-react.scss?v1.1.0';
// DevExtreme
import 'devextreme/dist/css/dx.common.css';
import './assets/css/dx.material.identidad-deacero.css';
// Propias
import './assets/css/karma.css';

// Componentes
import Login from './views/Login/Login';

// Context
import AppContext from './context/AppContext';
import useInitialState from './hooks/useInitialState';

const hist = createBrowserHistory();

const App = () => {
  const initialState = useInitialState();
  return (
    <AppContext.Provider value={initialState}>
      <ErrorHandler>
        <Router history={hist}>
          <Switch>
            <Route path="/" render={(props) => <Login {...props} />} />
          </Switch>
        </Router>
      </ErrorHandler>
    </AppContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

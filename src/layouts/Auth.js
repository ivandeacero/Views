import React from 'react';
// react library for routing
import { Route, Switch, Redirect } from 'react-router-dom';

// core components
import AuthFooter from 'components/Footers/AuthFooter.js';

import routes from 'routes.js';

class Auth extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
    document.body.classList.add('bg-default');
  }

  componentWillUnmount() {
    document.body.classList.remove('bg-default');
  }

  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }

  getRoutes = (routes) =>
    routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === '/auth') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      }
      return null;
    });

  render() {
    return (
      <>
        <div className="main-content" ref="mainContent">
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/auth/Login" />
          </Switch>
        </div>
        <AuthFooter />
      </>
    );
  }
}

export default Auth;

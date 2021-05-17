import React from 'react';
// react library for routing
import { Route, Switch, Redirect } from 'react-router-dom';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import AdminFooter from 'components/Footers/AdminFooter.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import routes from 'routes.js';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenavOpen: false,
    };
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
      if (prop.layout === '/layout') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      }
      return null;
    });

  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };

  // toggles collapse between mini sidenav and normal
  toggleSidenav = (e) => {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
    }
    this.setState({
      sidenavOpen: !this.state.sidenavOpen,
    });
  };

  getNavbarTheme = () =>
    this.props.location.pathname.indexOf('admin/alternative-dashboard') === -1 ? 'dark' : 'light';

  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          toggleSidenav={this.toggleSidenav}
          sidenavOpen={this.state.sidenavOpen}
        />
        <div className="main-content" ref="mainContent" onClick={this.closeSidenav}>
          <AdminNavbar {...this.props} />
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/layout/Pedidos" />
          </Switch>
          <AdminFooter />
        </div>
        {this.state.sidenavOpen ? (
          <div className="backdrop d-xl-none" onClick={this.toggleSidenav} />
        ) : null}
      </>
    );
  }
}

export default Admin;

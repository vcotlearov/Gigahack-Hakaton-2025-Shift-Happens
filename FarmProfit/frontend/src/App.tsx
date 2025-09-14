import { Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './auth/PrivateRoute';
import WelcomeCard from './auth/WelcomeCard';
import Layout from './layout/Layout';

import { Register } from './register/Register';
import { RegisterProfile } from './register/RegisterProfile';

import CreateCropsAsset from './assets/CreateCropsAsset';
import BusinessDetails from './MyBusinesses/BusinessDetails';
import BusinessOverview from './MyBusinesses/BusinessOverview';
import { MyBusinesses } from './MyBusinesses/MyBusinesses';
import Settings from './settings/Settings';
import Partners from './partners/Partners';


function ProtectedApp() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/my-businesses" component={MyBusinesses} />
        <Route exact path="/register" component={Register} />

        <Route exact path="/business/:index" component={BusinessDetails} />
        <Route exact path="/business/:index/assets/new" component={BusinessOverview} />
        <Route exact path="/business/:index/assets/new/land" component={CreateCropsAsset} />
        <Route path="/settings" exact component={Settings} />
        <Route path="/partners" exact component={Partners} />

      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <Switch>
      <Route exact path="/register-profile" component={RegisterProfile} />
      <Route exact path="/" component={WelcomeCard} />
      <PrivateRoute path="/" component={ProtectedApp} />
    </Switch>
  );
}

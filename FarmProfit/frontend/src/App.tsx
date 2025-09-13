// src/App.tsx (v5)
import { Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './auth/PrivateRoute';
import WelcomeCard from './auth/WelcomeCard';
import Layout from './layout/Layout';
import { Register } from './register/Register';
import { MyBusinesses } from './MyBusinesses/MyBusinesses';
import { RegisterProfile } from './register/RegisterProfile';

function ProtectedApp() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/my-businesses" component={MyBusinesses} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/edit-business/:index" component={Register} /> {/* <-- ДOБАВИЛИ */}
        <Route exact path="/register-profile" component={RegisterProfile} />
        {/* (необязательно) запасной маршрут, чтобы не было белого экрана */}
        <Route component={MyBusinesses} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={WelcomeCard} />
      <PrivateRoute path="/" component={ProtectedApp} />
    </Switch>
  );
}

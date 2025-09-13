// src/App.tsx
import './App.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import WelcomeCard from './auth/WelcomeCard';
import { MyBusinesses } from './MyBusinesses/MyBusinesses';
import Layout from './layout/Layout';
import { Register } from './register/Register';
import { RegisterProfile } from './register/RegisterProfile';

function App() {
  const history = useHistory();

  return (
    <Switch>
      {/* Страница без общего лэйаута */}
      <Route exact path="/">
        <WelcomeCard
          createAccountAction={() => history.push('/register-profile')}
          loginAction={() => history.push('/my-businesses')}
        />
      </Route>
      <Route path="/register-profile" component={RegisterProfile} />

      {/* Всё остальное — внутри Header + Sidebar */}
      <Route
        render={() => (
          <Layout>
            <Switch>
              <Route path="/my-businesses" component={MyBusinesses} />
              <Route path="/register-business" component={Register} />
              <Route path="/edit-business/:index" component={Register} />
              {/* другие страницы */}
              <Route render={() => <div style={{ padding: 24 }}>Not found</div>} />
            </Switch>
          </Layout>
        )}
      />
    </Switch>
  );
}

export default App;

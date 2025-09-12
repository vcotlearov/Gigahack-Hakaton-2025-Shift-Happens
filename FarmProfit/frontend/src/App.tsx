
// ...existing code...
import './App.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import WelcomeCard from './auth/WelcomeCard';
import FarmFieldsMap from './maps/FarmFieldsMap';

function App() {
  const history = useHistory();

  return (
    <Switch>
      <Route exact path="/">
        <WelcomeCard createAccountAction={() => history.push('/create-account')} />
      </Route>
      <Route path="/create-account">``
        <FarmFieldsMap />
      </Route>
    </Switch>
  );
}

export default App;

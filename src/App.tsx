import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainPage from "./Main/main";

const Main = () => {
  return (
      <MainPage/>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main}></Route>
      </Switch>
    </Router>
  );
};

export default App;

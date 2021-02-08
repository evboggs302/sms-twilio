import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Container from "./comps/Container.js";
import axios from "axios";
import "./App.css";

function App(props) {
  useEffect(() => {
    axios
      .get("/api/getAllUsers")
      .then((res) => console.log("server response", res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <Switch>
          <Route exact path="/" component={Container} />
          <Route />
          <Route />
          <Route />
          <Route />
          <Route
            path="*"
            render={() => {
              return <div> 404 file not found</div>;
            }}
          />
        </Switch>
      </header>
    </div>
  );
}
const mapPropsToState = (reduxState) => {
  return reduxState;
};

const mappedDispatchToProps = {
  // enter functions needed to impact redux state
};

const myConnect = connect(mapPropsToState, mappedDispatchToProps);

export default myConnect(App);

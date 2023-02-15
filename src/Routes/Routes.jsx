import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "../App";

function Routes() {
    return (
        <Router>
            <Route
                exact
                path="/tagupwall"
                render={(props) => <App {...props} url="https://www.kickheadz.com/tagupwall" />}
            />
            <Route
                exact
                path="/merchandise"
                render={(props) => <App {...props} url="https://www.kickheadz.com/merchandise" />}
            />
        </Router>
    );
}

export default Routes;
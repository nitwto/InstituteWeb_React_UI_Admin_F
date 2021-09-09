import "../styles/App.css";
import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Editor from '../pages/editor'
import Forms from "../pages/forms";
import Login from "../pages/login";

export default function App() {
  return (
    <div className='App'>
      <Router>
        <Route exact path='/' component={Forms} />
        <Route exact path='/E1' component={Editor} />
        <Route exact path='/login' component={Login} />
      </Router>
    </div>
  );
}

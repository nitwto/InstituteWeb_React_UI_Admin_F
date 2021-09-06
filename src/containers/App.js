import "../styles/App.css";
import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Editor from '../pages/editor'
import Forms from "../pages/forms";

export default function App() {
  return (
    <div className='App'>
      <Router>
        <Route exact path='/' component={Forms} />
        <Route exact path='/E1' component={Editor} />
      </Router>
    </div>
  );
}

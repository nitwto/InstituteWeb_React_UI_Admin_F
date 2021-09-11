import "../styles/App.css";
import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Editor from '../pages/editor'
import Forms from "../pages/forms";
import About from "../pages/home/about";
import BoardOfGovernors from "../pages/home/boardOfGovernors";
import AcademicAdministration from "../pages/administration/academic";
import WebsiteAdministration from "../pages/administration/websiteAdministration";

export default function App() {
  return (
    <div className='App'>
      <Router>
        <Route exact path='/' component={Forms} />
        <Route exact path='/E1' component={Editor} />
        <Route exact path='/home/about' component={About} />
        <Route exact path ='/home/boardOfGovernors' component={BoardOfGovernors} />
        <Route exact path = '/administration/academic' component={AcademicAdministration} />
        <Route exact path = '/administration/websiteAdministration' component={WebsiteAdministration} />
      </Router>
    </div>
  );
}

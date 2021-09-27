import "../styles/App.css";
import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Editor from '../pages/editor'
import Forms from "../pages/forms";
import Uploads from "../pages/uploads";
import RecentFile from "../pages/recentFile";
import AllUploads from "../pages/allFiles";

export default function App() {
  return (
    <div className='App'>
      <Router>
        <Route exact path='/' component={Forms} />
        <Route exact path='/E1' component={Editor} />
        <Route exact path='/recent-upload' component={RecentFile} />
      </Router>
    </div>
  );
}

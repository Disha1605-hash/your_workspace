import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Mycomponents/Register';
import Login from './Mycomponents/Login';  
import Quote from './Mycomponents/Quote'; 
import Main from './Mycomponents/Main'; 
import About from './Mycomponents/About';
import Workspace from './Mycomponents/Workspace';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quote" element={<Quote />} /> 
          <Route path="/main" element={<Main />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/workspace" element={<Workspace />} />

        </Routes>
       <Analytics />
      </div>
    </Router>
  );
}

export default App;

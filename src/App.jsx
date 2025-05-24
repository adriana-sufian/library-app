import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LibrarianDashboard from "./directories/LibrarianDashboard";
import MemberDashboard from "./directories/MemberDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/librarian" element={<LibrarianDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;
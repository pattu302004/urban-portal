
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import FPDashboard from "../../FieldPerson/src/components/FPDashboard"
import FPLogin from "./components/FPLogin";
import FPRegister from "./components/FPRegister";
import Appbar from './components/Appbar';
export default function App() {
const theme = createTheme(); 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Appbar/>
        <Routes>
          <Route path="/Rgister" element={<FPRegister />} />
          <Route path="/Login" element={<FPLogin />} />
          <Route path="/field-person-dashboard" element={<FPDashboard />}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
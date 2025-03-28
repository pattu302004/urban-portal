
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MunicipalDashboard from "../../municipal/src/components/Municipal";
import Appbar from './components/Appbar';
export default function App() {
const theme = createTheme(); 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Appbar/>
        <Routes>
          <Route path="/" element={<MunicipalDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
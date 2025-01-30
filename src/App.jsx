import React, { useState, useEffect } from "react";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Spends from "./Pages/Spends";
import Savings from "./Pages/Savings";
import Home from "./Pages/Home";
import "./App.css";
import { Stack, Box, Typography, Tabs, Tab,IconButton } from "@mui/material";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";

const App = () => {
  const [value, setValue] = React.useState(0);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      {/* Bottom Nav */}
     <div style={{ position: 'relative', minHeight: '100vh' }}>

      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} >
      <Stack direction={'row'} alignItems={'center'} spacing={0.1}>
      <img src="./mandala.webp" width={50}  alt="" />
      <Typography sx={{ marginTop: 2 }}>
        Track Spend
      </Typography>
      </Stack>
      <IconButton>
      <PowerSettingsNewIcon/>
      </IconButton>
      </Stack>
      <Stack sx={{ p: 1,mb:10 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spends" element={<Spends />} />
          <Route path="/savings" element={<Savings />} />
        </Routes>
      </Stack>

      {/* Fixed bottom container for Tabs */}
      {/* Fixed bottom container for Tabs */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-around",
          padding: "1rem 0",
        }}
      >
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "#00712D" : "black",
            textDecoration: "none",
          })}
        >
         <Stack direction={'column'} alignItems={'center'} lineHeight={0.5}>
         <div style={{ fontSize: "24px" }}>
            <HomeIcon sx={{fontSize:28}}  />
          </div>
          <Typography sx={{fontSize:10}}>Home</Typography>
         </Stack>
        </NavLink>
        <NavLink
          to="/spends"
          style={({ isActive }) => ({
            color: isActive ? "#00712D" : "black",
            textDecoration: "none",
          })}
        >
           <Stack direction={'column'} alignItems={'center'} lineHeight={0.5}>
           <div style={{ fontSize: "24px" }}>
            <AttachMoneyIcon sx={{fontSize:28}} />
          </div>
           </Stack>
           <Typography sx={{fontSize:10}}>Spends</Typography>
        </NavLink>
        <NavLink
          to="/savings"
          style={({ isActive }) => ({
            color: isActive ? "#00712D" : "black",
            textDecoration: "none",
          })}
        >
           <Stack direction={'column'} alignItems={'center'} lineHeight={0.5}>
           <div style={{ fontSize: "24px" }}>
            <SavingsIcon sx={{fontSize:28}}  />
          </div>
          <Typography sx={{fontSize:10}}>Savings</Typography>
           </Stack>
         
        </NavLink>
      </div>
    </div>
    </div>
  );
};

export default App;

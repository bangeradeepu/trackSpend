import React, { useState, useEffect } from "react";
import { Route, Routes, Link,NavLink  } from "react-router-dom";
import Spends from "./Pages/Spends";
import Savings from "./Pages/Savings";
import Home from "./Pages/Home";
import {Stack,Box,Typography,Tabs, Tab} from '@mui/material';

const App = () => {
  const [value, setValue] = React.useState(0);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Typography>Track Spend</Typography>
       <Tabs
      value={value}
      onChange={handleChange}
      aria-label="navigation tabs"
      centered
    >
      {/* <Tab
        label="Home"
        component={NavLink}
        to="/"
        value={0}
        style={({ isActive }) => ({
          textDecoration: isActive ? '' : 'none',
          color: isActive ? 'blue' : 'black',
        })}
      /> */}
      <Tab
        label="Spends"
        component={NavLink}
        to="/spends"
        value={1}
        style={({ isActive }) => ({
          textDecoration: isActive ? '' : 'none',
          color: isActive ? 'blue' : 'black',
        })}
      />
      <Tab
        label="Savings"
        component={NavLink}
        to="/savings"
        value={2}
        style={({ isActive }) => ({
          textDecoration: isActive ? '' : 'none',
          color: isActive ? 'blue' : 'black',
        })}
      />
    </Tabs>
      
      <Stack sx={{p:2}}>
      <Routes>
        <Route path="/" element={<Spends />}></Route>
        <Route path="/spends" element={<Spends />}></Route>
        <Route path="/savings" element={<Savings />}></Route>
      </Routes>
      </Stack>
    </div>
  );
};

export default App;

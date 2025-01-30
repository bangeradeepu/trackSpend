import React, { useState, useEffect } from "react";
import { Button, Stack, Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import MonthlySpendingSavingsChart from "./MonthlySpendingSavingsChart ";
const Home = () => {
  const navigate = useNavigate();
  const [savingData, setSavingData] = useState([]);
  const [spendData, setSpendData] = useState([]);

  const handleSpendRedirect = () => {
    navigate("/spends");
  };

  const handleSavingsRedirect = () => {
    navigate("/savings");
  };

  useEffect(() => {
    getSavings();
    getSpends();
  }, []);

  const getSpends = async () => {
    try {
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/spends`
      );
      setSpendData(getData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSavings = async () => {
    try {
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/savings`
      );
      setSavingData(getData.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Updated calculations
  const totalSpends = spendData.reduce(
    (acc, item) => acc + Number(item.spendMoney),
    0
  );
  const totalSavings = savingData.reduce(
    (acc, item) => acc + Number(item.savingMoney),
    0
  );

  return (
    <div>
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
            width: "40%",
          }}
        >
          <Typography
            sx={{ textAlign: "left", fontSize: 14, color: "#2e2e2e" }}
          >
            Total Spends
          </Typography>
          <Typography sx={{ fontSize: 24, color: "#B82132" }}>
            {" "}
            ₹{totalSpends}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <IconButton
            onClick={handleSpendRedirect}
              sx={{
                backgroundColor: "#fcdcdc",
                color: "#B82132",
                width: 48,
                height: 48,
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
            width: "40%",
          }}
        >
          <Typography
            sx={{ textAlign: "left", fontSize: 14, color: "#2e2e2e" }}
          >
            Total Income
          </Typography>
          <Typography sx={{ fontSize: 24, color: "#00712D" }}>
            {" "}
            ₹{totalSavings}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <IconButton
            onClick={handleSavingsRedirect}
              sx={{
                backgroundColor: "#dcfce1",
                color: "#00712D",
                width: 48,
                height: 48,
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Box>
      </Stack>
      <MonthlySpendingSavingsChart />
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Savings = () => {
  const [savingName, setSavingName] = useState("");
  const [savingMoney, setSavingMoney] = useState("");
  const [savingData, setSavingData] = useState([]);
  const [spendData, setSpendData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredSavings, setFilteredSavings] = useState([]);
  const [filteredSpends, setFilteredSpends] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    getSpends();
    getSavings();
  }, []);

  const getSpends = async () => {
    try {
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/spends`
      );
      setSpendData(getData.data);
      setFilteredSpends(getData.data); // Initially, show all spends
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
      setFilteredSavings(getData.data); // Initially, show all savings
    } catch (error) {
      console.error(error);
    }
  };

  const addSaving = async () => {
    try {
      const postData = await axios.post(
        `${import.meta.env.VITE_BASE_API}/api/savings`,
        {
          savingName,
          savingMoney,
        }
      );
      setSavingMoney("");
      setSavingName("");
      getSavings();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSaving = async (id) => {
    try {
      const deleteData = await axios.delete(
        `${import.meta.env.VITE_BASE_API}/api/savings/${id}`
      );
      getSavings();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter savings and spends data based on selected year and month
  useEffect(() => {
    // Filter savings
    const filteredSavingsData = savingData.filter((saving) => {
      const savingDate = new Date(saving.createdAt);
      const savingYear = savingDate.getFullYear();
      const savingMonth = savingDate.getMonth() + 1;
      return (
        (selectedYear === "" || savingYear === Number(selectedYear)) &&
        (selectedMonth === "" || savingMonth === Number(selectedMonth))
      );
    });

    setFilteredSavings(filteredSavingsData);
  }, [selectedYear, selectedMonth, savingData, spendData]);

  const totalSavings = filteredSavings.reduce(
    (acc, saving) => acc + Number(saving.savingMoney),
    0
  );

  const totalSpends = filteredSpends.reduce(
    (acc, spend) => acc + Number(spend.spendMoney),
    0
  );

  // Get unique years for the dropdown
  const uniqueYears = [
    ...new Set([
      ...spendData.map((spend) => new Date(spend.createdAt).getFullYear()),
      ...savingData.map((saving) => new Date(saving.createdAt).getFullYear()),
    ]),
  ];

  return (
    <Stack>
      <Typography sx={{ fontSize: 22 }}>Savings</Typography>

      {/* Add Saving Form */}
      <Stack mb={2}>
        <TextField
          id="standard-basic"
          label="Saving Name"
          variant="standard"
          sx={{ mb: 2 }}
          value={savingName}
          onChange={(e) => setSavingName(e.target.value)}
        />
        <TextField
          id="standard-basic"
          label="Saved Amount"
          variant="standard"
          sx={{ mb: 4 }}
          value={savingMoney}
          onChange={(e) => setSavingMoney(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#2e2e2e" }}
          onClick={addSaving}
        >
          Add Saving
        </Button>
      </Stack>

      {/* Filters Section */}
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Year"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            label="Month"
            disabled={!selectedYear}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {months.map((month, index) => (
              <MenuItem key={month} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Insights Section */}
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Box sx={{ backgroundColor: "#B82132", p: 1.5, width: "50%" }}>
          <Typography sx={{ fontSize: 14, color: "#ffffff" }}>
            Total Spends
          </Typography>
          <Typography sx={{ fontSize: 18, color: "#ffffff", fontWeight: 700 }}>
            ${totalSpends}
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: "#00712D", p: 1.5, width: "50%" }}>
          <Typography sx={{ fontSize: 14, color: "#ffffff",textAlign:'right' }}>
            Total Savings
          </Typography>
          <Typography sx={{ fontSize: 18, color: "#ffffff", fontWeight: 700,textAlign:'right' }}>
            ${totalSavings}
          </Typography>
        </Box>
      </Stack>

      {/* Spending List */}
      <Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography>Savings List</Typography>
        </Stack>

        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Saving Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Saved Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSavings.map((saving, index) => (
                <TableRow key={saving._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{saving.savingName}</TableCell>
                  <TableCell>{saving.savingMoney}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteSaving(saving._id)}>
                      <DeleteIcon sx={{ color: "#2e2e2e" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>
                    ${totalSavings}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

export default Savings;

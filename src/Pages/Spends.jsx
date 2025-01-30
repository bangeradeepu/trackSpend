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
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Spends = () => {
  const [spendName, setSpendName] = useState("");
  const [spendMoney, setSpendMoney] = useState("");
  const [spendData, setSpendDate] = useState([]);
  const [savingData,setSavingData] =useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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
      console.log(getData.data);
      setSpendDate(getData.data);
      setFilteredSpends(getData.data); // Initially, show all data
    } catch (error) {
      console.error(error);
    }
  };
  const getSavings = async () => {
    try {
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/savings`
      );
      console.log(getData.data);
      setSavingData(getData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addSpend = async () => {
    try {
      const postData = await axios.post(
        `${import.meta.env.VITE_BASE_API}/api/spends`,
        {
          spendName,
          spendMoney,
        }
      );
      console.log(postData);
      setSpendMoney("");
      setSpendName("");
      getSpends();
      getSavings();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSpend = async(id) => {
    try {
        const deleteData = await axios.delete(`${import.meta.env.VITE_BASE_API}/api/spends/${id}`)
        console.log(deleteData);
        getSpends();
        getSavings();
    } catch (error) {
        console.log(error)
    }
  }

  // Filter spending data based on selected year and month
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const filteredData = spendData.filter((spend) => {
        const spendDate = new Date(spend.createdAt);
        const spendYear = spendDate.getFullYear();
        const spendMonth = spendDate.getMonth() + 1; // Months are zero-indexed
        return (
          spendYear === Number(selectedYear) &&
          spendMonth === Number(selectedMonth)
        );
      });
      setFilteredSpends(filteredData);
    } else if (selectedYear) {
      const filteredData = spendData.filter((spend) => {
        const spendDate = new Date(spend.createdAt);
        const spendYear = spendDate.getFullYear();
        return spendYear === Number(selectedYear);
      });
      setFilteredSpends(filteredData);
    } else {
      setFilteredSpends(spendData); // Show all data if no filter is selected
    }
  }, [selectedYear, selectedMonth, spendData]);

  const totalSpend = filteredSpends.reduce(
    (acc, spend) => acc + Number(spend.spendMoney),
    0
  );

  const totalSavings = savingData.reduce((acc, saving) => {
    const savingDate = new Date(saving.createdAt);
    const savingYear = savingDate.getFullYear();
    const savingMonth = savingDate.getMonth() + 1; // Months are zero-indexed
  
    // Check if the saving entry matches the selected year and month
    if (
      (selectedYear === "" || savingYear === Number(selectedYear)) &&
      (selectedMonth === "" || savingMonth === Number(selectedMonth))
    ) {
      return acc + Number(saving.savingMoney); // Sum up the savingMoney
    }
    return acc; // Otherwise, return the accumulated value
  }, 0);
  

  // Get unique years for the dropdown
  const uniqueYears = [
    ...new Set(
      spendData.map((spend) => new Date(spend.createdAt).getFullYear())
    ),
  ];
  const totalRemaining = totalSavings - totalSpend;

  return (
    <Stack>
      <Typography sx={{ fontSize: 22 }}>Spends</Typography>

      {/* Add Spend Form */}
      <Stack mb={2} mt={2} sx={{border:1,p:2,borderRadius:6,borderColor:'#aeaeae'}}>
        <TextField
          id="standard-basic"
          label="Spend Name"
          variant="standard"
          sx={{ mb: 4 }}
          value={spendName}
          onChange={(e) => setSpendName(e.target.value)}
        />
        <TextField
          id="standard-basic"
          label="Spent Amount"
          type="number"
          variant="standard"
          sx={{ mb: 4 }}
          value={spendMoney}
          onChange={(e) => setSpendMoney(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ height:50,backgroundColor:'#fcdcdc',color:'#B82132',boxShadow:'none',borderRadius:3 }}
          onClick={addSpend}
        >
          Add Spend
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
      {/* Spending Insight */}
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Box sx={{ backgroundColor: "#fcdcdc", p: 1.5, width: "40%",borderRadius:2 }}>
          <Typography sx={{ fontSize: 14, color: "#B82132" }}>
            Total Spends
          </Typography>

          <Typography sx={{ fontSize: 18, color: "#B82132", fontWeight: 700 }}>
            ₹{totalSpend}
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: "#dcfce1", p: 1.5, width: "40%",borderRadius:2 }}>
          <Typography
            sx={{ fontSize: 14, color: "#00712D", textAlign: "right" }}
          >
            Total Savings
          </Typography>

          <Typography
            sx={{
              fontSize: 18,
              color: "#00712D",
              fontWeight: 700,
              textAlign: "right",
            }}
          >
            ₹{totalSavings}
          </Typography>
        </Box>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Box sx={{ backgroundColor: "#faebd7", p: 1.5, width: "40%",borderRadius:2 }}>
          <Typography sx={{ fontSize: 14, color: "#fc9d17" }}>
            Total Spends
          </Typography>

          <Typography sx={{ fontSize: 18, color: "#fc9d17", fontWeight: 700 }}>
            ₹{totalRemaining}
          </Typography>
        </Box>

      </Stack>
      {/* Spending List */}
      <Stack>
 

        <TableContainer sx={{ mt: 1,border:1,borderColor:'#aeaeae',borderRadius:6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSpends.map((spend, index) => (
                <TableRow key={spend._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{spend.spendName}</TableCell>
                  <TableCell>{spend.spendMoney}</TableCell>
                  <TableCell>
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      <IconButton onClick={() => deleteSpend(spend._id)}>
                        <DeleteIcon sx={{ color: "#2e2e2e" }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
             
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{backgroundColor:'#fcdcdc',color:'#B82132',borderRadius:3,mt:2}}>
<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} p={2}>
<Typography>Total</Typography>
<Typography sx={{fontWeight:700,fontSize:18}}> ₹{totalSpend}</Typography>
</Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Spends;

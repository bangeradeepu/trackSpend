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
  CircularProgress,
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
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

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
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
      setTableLoading(true);
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/savings`
      );
      setSavingData(getData.data);
      setFilteredSavings(getData.data); // Initially, show all savings
      setTableLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addSaving = async () => {
    if (savingName === "" || savingMoney === "") {
      setHandleError("Please fill both fields!");
    } else {
      try {
        setLoadingAdd(true);
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
        getSpends();
        setLoadingAdd(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteSaving = async (id) => {
    try {
      setDeletingId(id);
      const deleteData = await axios.delete(
        `${import.meta.env.VITE_BASE_API}/api/savings/${id}`
      );
      getSavings();
      getSpends();
      setDeletingId(null);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFocus = () => {
    setHandleError("");
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

    // Filter spends
    const filteredSpendsData = spendData.filter((spend) => {
      const spendDate = new Date(spend.createdAt);
      const spendYear = spendDate.getFullYear();
      const spendMonth = spendDate.getMonth() + 1;
      return (
        (selectedYear === "" || spendYear === Number(selectedYear)) &&
        (selectedMonth === "" || spendMonth === Number(selectedMonth))
      );
    });

    setFilteredSpends(filteredSpendsData);
  }, [selectedYear, selectedMonth, savingData, spendData]);

  // Calculate totals
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
  const totalRemaining = totalSavings - totalSpends;

  return (
    <Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ fontSize: 22 }}>Incomes</Typography>
        <Typography sx={{ fontSize: 14 }}>{formattedDate}</Typography>
      </Stack>
      {/* Add Saving Form */}
      <Stack
        mb={2}
        mt={1}
        sx={{ border: 1, p: 2, borderRadius: 6, borderColor: "#aeaeae" }}
      >
        <TextField
          id="standard-basic"
          label="Saving Name"
          variant="standard"
          sx={{ mb: 4 }}
          value={savingName}
          onFocus={handleFocus}
          onChange={(e) => setSavingName(e.target.value)}
        />
        <TextField
          id="standard-basic"
          label="Saved Amount"
          variant="standard"
          type="number"
          sx={{ mb: 2 }}
          value={savingMoney}
          onFocus={handleFocus}
          onChange={(e) => setSavingMoney(e.target.value)}
        />
        {handleError && (
          <Typography sx={{ color: "#B82132", mb: 2, fontSize: 12 }}>
            {handleError}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 50,
            color: "#00712D",
            backgroundColor: "#dcfce1",
            boxShadow: "none",
            borderRadius: 3,
          }}
          onClick={addSaving}
        >
          {loadingAdd ? (
            <CircularProgress size={24} sx={{ color: "#00712D" }} />
          ) : (
            <>Add Saving</>
          )}
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
        <Box
          sx={{
            backgroundColor: "#fcdcdc",
            p: 1.5,
            width: "40%",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ fontSize: 14, color: "#B82132" }}>
            Total Spends
          </Typography>
          <Typography sx={{ fontSize: 18, color: "#B82132", fontWeight: 700 }}>
            ₹{totalSpends}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#dcfce1",
            p: 1.5,
            width: "40%",
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{ fontSize: 14, color: "#00712D", textAlign: "right" }}
          >
            Total Income
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
        <Box
          sx={{
            backgroundColor: "#faebd7",
            p: 1.5,
            width: "40%",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ fontSize: 14, color: "#fc9d17" }}>
            Total Savings
          </Typography>

          <Typography sx={{ fontSize: 18, color: "#fc9d17", fontWeight: 700 }}>
            ₹{totalRemaining}
          </Typography>
        </Box>
      </Stack>

      {/* Spending List */}
      {tableLoading ? (
        <Stack direction={"row"} justifyContent={"center"} mt={10} mb={10}>
          <CircularProgress sx={{ color: "#faebd7" }} />
        </Stack>
      ) : (
        <Stack>
          <TableContainer
            sx={{ mt: 1, border: 1, borderColor: "#aeaeae", borderRadius: 6 }}
          >
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
              {filteredSavings
  .slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort in descending order
  .map((saving, index) => (
    <TableRow key={saving._id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Stack>{saving.savingName}</Stack>
        <Stack sx={{ fontSize: 12, color: "#aeaeae" }}>
          {new Date(saving.createdAt)
            .toLocaleString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata",
            })
            .replace(" at", "")}
        </Stack>
      </TableCell>
      <TableCell>{saving.savingMoney}</TableCell>
      <TableCell>
        <IconButton onClick={() => deleteSaving(saving._id)}>
          {deletingId === saving._id ? (
            <CircularProgress size={24} sx={{ color: "black" }} />
          ) : (
            <DeleteIcon sx={{ color: "#2e2e2e" }} />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  ))}

              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              backgroundColor: "#dcfce1",
              color: "#00712D",
              borderRadius: 3,
              mt: 2,
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={2}
            >
              <Typography>Total</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                {" "}
                ₹{totalSavings}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default Savings;

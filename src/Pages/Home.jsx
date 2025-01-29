import React from 'react';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSpendRedirect = () => {
    navigate('/spends');
  };

  const handleSavingsRedirect = () => {
    navigate('/savings');
  };

  return (
    <div>
      <Stack spacing={2} direction="row" justifyContent={'center'} sx={{mt:20}}>
        <Button variant="contained" color="primary" onClick={handleSpendRedirect}>
          Go to Spends
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSavingsRedirect}>
          Go to Savings
        </Button>
      </Stack>
    </div>
  );
};

export default Home;

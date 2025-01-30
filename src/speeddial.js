import React from 'react';
import { useNavigate } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Box } from '@mui/material';

const Dial = () => {
  const navigate = useNavigate();

  const handleAddReportClick = () => {
    navigate('/form');
  };

  const handleConsolidateAndSummaryClick = () => {
    navigate('/cs');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Consolidate and Summary Button */}
      <Fab
        color="primary"
        aria-label="Consolidate and Summary"
        onClick={handleConsolidateAndSummaryClick}
        sx={{
          backgroundColor: '#32348c',
          '&:hover': { backgroundColor: '#272a75' },
        }}
      >
        <SummarizeIcon />
      </Fab>

      {/* Add Report Button */}
      <Fab
        color="primary"
        aria-label="Add Report"
        onClick={handleAddReportClick}
        sx={{
          backgroundColor: '#32348c',
          '&:hover': { backgroundColor: '#272a75' },
        }}
      >
        <AddCircleRoundedIcon />
      </Fab>
    </Box>
  );
};

export default Dial;

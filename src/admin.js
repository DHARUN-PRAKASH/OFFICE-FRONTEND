import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Card, CardContent, Button, FormControl, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Dash from './dash';
import {
  fetchMonthData,
  getFyYearStatus,
  getMonthStatus,
  activateFyYear,
  lockFyYear,
  activateMonth,
  lockMonth,
  fetchMonthUpdates
} from './axios'; // Adjust the path as needed

export const Admin = () => {
  const [selectedFyYear, setSelectedFyYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isFyYearActive, setIsFyYearActive] = useState(false);
  const [isMonthActive, setIsMonthActive] = useState(false);
  const [cardsData, setCardsData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetchMonthData();
      setCardsData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const updatedMonthData = await fetchMonthUpdates();
      if (updatedMonthData) {
        setCardsData(prevData =>
          prevData.map(month =>
            month.month_name === updatedMonthData.month_name ? updatedMonthData : month
          )
        );
      }
    };

    fetchData(); // Call the function when the component mounts

    // Optional: Set up polling (e.g., every 10 seconds)
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (selectedFyYear) {
      getFyYearStatus(selectedFyYear.getFullYear())
        .then(response => {
          setIsFyYearActive(response.data.fy_id);
        })
        .catch(error => {
          console.error('Error fetching FY year status:', error);
        });
    } else {
      setIsFyYearActive(false);
    }
  }, [selectedFyYear]);

  useEffect(() => {
    if (selectedMonth) {
      getMonthStatus(selectedMonth.toLocaleString('default', { month: 'long' }))
        .then(response => {
          setIsMonthActive(response.data.month_id);
        })
        .catch(error => {
          console.error('Error fetching month status:', error);
        });
    } else {
      setIsMonthActive(false);
    }
  }, [selectedMonth]);

  const handleFyYearChange = (newValue) => {
    setSelectedFyYear(newValue);
  };

  const handleMonthChange = (newValue) => {
    setSelectedMonth(newValue);
  };

  const handleFyYearActivate = async () => {
    if (!selectedFyYear) return;

    setIsFyYearActive(true);

    try {
      await activateFyYear(selectedFyYear.getFullYear());
    } catch (error) {
      console.error('Error activating FY year:', error);
    }
  };

  const handleFyYearLock = async () => {
    if (!selectedFyYear) return;

    setIsFyYearActive(false);

    try {
      await lockFyYear(selectedFyYear.getFullYear());
    } catch (error) {
      console.error('Error locking FY year:', error);
    }
  };

  const handleMonthActivate = async () => {
    if (!selectedMonth) return;

    setIsMonthActive(true);

    try {
      await activateMonth(selectedMonth.toLocaleString('default', { month: 'long' }));
      await fetchData();
    } catch (error) {
      console.error('Error activating month:', error);
    }
  };

  const handleMonthLock = async () => {
    if (!selectedMonth) return;

    setIsMonthActive(false);

    try {
      await lockMonth(selectedMonth.toLocaleString('default', { month: 'long' }));
      await fetchData();
    } catch (error) {
      console.error('Error locking month:', error);
    }
  };

  return (
    <div>
      <Dash />
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', marginBottom: '50px' }}>
        <Box mt={5} p={3} boxShadow={3} borderRadius={5} sx={{ backgroundColor: 'white', width: '80vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{color: 'white', backgroundColor: '#32348c', padding: '10px', borderRadius: '50px', textAlign: 'center', width: '100%' }}><b>ADMIN</b></Typography>

          <Box sx={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Card sx={{ width: '48%' }}>
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <FormControl sx={{ marginTop: 0, width: '100%' }}>
                    <DesktopDatePicker
                      views={['year']}
                      label="Financial Year"
                      value={selectedFyYear}
                      onChange={handleFyYearChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </FormControl>
                </LocalizationProvider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleFyYearActivate}
                    sx={{ width: '48%',borderRadius:'50px' }}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleFyYearLock}
                    sx={{ width: '48%',borderRadius:'50px' }}
                  >
                    Lock
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ width: '48%' }}>
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <FormControl sx={{ marginTop: 0, width: '100%' }}>
                    <DesktopDatePicker
                      views={['month']}
                      label="Month"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </FormControl>
                </LocalizationProvider>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleMonthActivate}
                    sx={{ width: '48%',borderRadius:'50px' }}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleMonthLock}
                    sx={{ width: '48%' ,borderRadius:'50px'}}
                  >
                    Lock
                  </Button>
                </Box>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>

              </Box>
            </Card>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cardsData.map((month, index) => (
              <Card key={index} sx={{ borderRadius:'50px',width: '12%', marginBottom: '20px', marginLeft: '20px', marginRight: '10px', height: '5vh', backgroundColor: month.month_id ? '#1b5e20' : '#c62828' }}>
                <CardContent style={{  display: 'flex', justifyContent: 'center', alignItems: 'center',padding:'10px' ,color:'white'}}>
                  <Typography variant="body2"><b>{month.month_name}</b></Typography>
                </CardContent>
                
              </Card>
            ))}
          </Box>
          
        </Box>
      </Container>
    </div>
  );
};

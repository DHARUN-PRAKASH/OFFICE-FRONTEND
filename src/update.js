import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Autocomplete, Grid, Box, Typography, Chip, Snackbar, Alert,Divider } from '@mui/material';
import { getFormById, modifyForm, getHeadCat, getSubCat, getMonth, getDepartment, getEmployee, getVehicle, getFyYear } from './axios';
import Dash from './dash';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { parse } from 'date-fns';
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const Update = ({ handleClose  }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fy_year, setFyYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [head_cat, setHeadCat] = useState(null);
  const [sub_cat, setSubCat] = useState(null);
  const [date, setDate] = useState(null);
  const [received_by, setReceivedBy] = useState([]);
  const [particulars, setParticulars] = useState('');
  const [departments, setDepartments] = useState(null);
  const [vehicles, setVehicles] = useState(null);

  const [bills, setBills] = useState([{ files: [] }]); // Initialize bills with an empty files array


  const [files, setFiles] = useState([]);
  const [oldFile, setOldFiles] = useState([]);

  const [headCats, setHeadCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [months, setMonths] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [fyYears, setFyYears] = useState([]);

  const [isSubCatDisabled, setIsSubCatDisabled] = useState(true);
  const [isDepartmentDisabled, setIsDepartmentDisabled] = useState(true);
  const [isVehicleDisabled, setIsVehicleDisabled] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  

  // Fetch data for dropdowns and lists
  useEffect(() => {
    const fetchData = async () => {
      try {

        const headCatData = await getHeadCat();
        const filteredHeadCats = headCatData.filter(cat => cat.head_cat_status === true);
        setHeadCats(filteredHeadCats);


        const subCatData = await getSubCat();
        const filteredSubCats = subCatData.filter(subCat => subCat.sub_cat_status === true);
        setSubCats(filteredSubCats);


        const monthData = await getMonth();
        const filteredMonths = monthData.filter(month => month.month_id === true);
        setMonths(filteredMonths);


        const departmentData = await getDepartment();
        setDepartmentsList(departmentData);

        const employeeData = await getEmployee();
        setEmployees(employeeData);

        const vehicleData = await getVehicle();
        setVehiclesList(vehicleData);

        const fyYearData = await getFyYear();
        const filteredFyYears = fyYearData.filter(fyYear => fyYear.fy_id === true);
        setFyYears(filteredFyYears);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch form details by ID from the URL and populate the fields
// Fetch form details by ID from the URL and populate the fields
 // Import the parse function from date-fns if needed

 useEffect(() => {
  const fetchFormDetails = async () => {
    if (id) {
      try {
        const formDetails = await getFormById(id); // Fetch form details

        // Map the fetched data into state variables
        setFyYear(formDetails.fy_year || null);
        setMonth(formDetails.month || null);
        setHeadCat(formDetails.head_cat || null);
        setSubCat(formDetails.sub_cat || null);

        // Parse the date from 'dd-MM-yyyy' format to a JavaScript Date object
        setDate(formDetails.date ? parse(formDetails.date, 'dd-MM-yyyy', new Date()) : null);

        setReceivedBy(formDetails.received_by || []);
        setParticulars(formDetails.particulars || '');
        setDepartments(formDetails.departments || null);
        setVehicles(formDetails.vehicles || null);

        // Handle bills with uploaded files
        const billsWithFiles = formDetails.bills.map((bill) => ({
          ...bill,
          files: formDetails.file.filter((file) => file.includes(bill.bill_no)), // Match files to the bill by bill_no
        }));
        setBills(billsWithFiles);

        // Set uploaded files and store old files separately
        setFiles(formDetails.file || []);
        setOldFiles(formDetails.file || []);

        // Initialize dropdown lists with current selections
        setHeadCats([formDetails.head_cat]); 
        setSubCats([formDetails.sub_cat]); 
        setMonths([formDetails.month]); 
        setFyYears([formDetails.fy_year]);
        setDepartmentsList(formDetails.departments ? [formDetails.departments] : []);
        setVehiclesList(formDetails.vehicles || []); 
        setEmployees(formDetails.received_by || []); 

        // Update disabled states based on the fetched data
        setIsSubCatDisabled(!formDetails.head_cat);
        setIsDepartmentDisabled(!formDetails.departments);
        setIsVehicleDisabled(!formDetails.vehicles);

      } catch (error) {
        console.error('Error fetching form details:', error);
      }
    }
  };

  fetchFormDetails();
}, [id]);


  

  // FEILD DISABLE LOGICS 

  useEffect(() => {
    if (sub_cat) {
      const subCatSplId = sub_cat.spl_id;
      const departmentEnabled = departmentsList.some(dept => dept.spl_id === subCatSplId);
      const vehicleEnabled = vehiclesList.some(vehicle => vehicle.spl_id === subCatSplId);

      setIsDepartmentDisabled(!departmentEnabled);
      setIsVehicleDisabled(!vehicleEnabled);

      if (!departmentEnabled) {
        setDepartments(null);
      }

      if (!vehicleEnabled) {
        setVehicles(null);
      }
    }
  }, [sub_cat, departmentsList, vehiclesList]);


  
  //VALIDATION

  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const errors = {};

    // Existing field validations
    if (!fy_year) errors.fy_year = 'Fiscal Year is required';
    if (!month) errors.month = 'Month is required';
    if (!date) errors.date = 'Date is required';
    if (!head_cat) errors.head_cat = 'Head Category is required';
    if (!sub_cat) errors.sub_cat = 'Sub Category is required';
    if (!particulars) errors.particulars = 'Particulars are required';
    if (!received_by || received_by.length === 0) errors.received_by = 'Received By is required';
    if ((!departments || departments.length === 0) && !isDepartmentDisabled) {
      errors.departments = 'At least one department is required';
    }
    if ((!vehicles || vehicles.length === 0) && !isVehicleDisabled) {
      errors.vehicles = 'At least one vehicle is required';
    }

    // Bill Validation
    if (!bills || bills.length === 0) {
      errors.bills = 'At least one bill is required';
    } else {
      bills.forEach((bill, index) => {
        if (!bill.bill_no) errors[`bill_no_${index}`] = 'Bill Number is required';
        if (!bill.amount) errors[`amount_${index}`] = 'Amount is required';
        if (!bill.files || bill.files.length === 0) errors[`files_${index}`] = 'At least one file is required for this bill';
      });
    }

    setErrors(errors);

    const isFormComplete = Object.keys(errors).length === 0;

    if (!isFormComplete) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else if (isFormComplete && !bills.some((bill) => bill.files.length > 0)) {
      setSnackbarMessage('Please upload at least one file for each bill.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    return isFormComplete ? null : errors;
  };

const formattedDate = date && !isNaN(new Date(date).getTime()) ? format(new Date(date), 'dd-MM-yyyy') : '';



  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form before submitting
    const errors = validateForm();

    // If there are errors, return and don't proceed with submission
    if (errors) {
      return;
    }

    // Create the form data object (excluding files)
    const formData = {
      _id: id, 
      fy_year: JSON.stringify(fy_year),
      month: JSON.stringify(month),
      head_cat: JSON.stringify(head_cat),
      sub_cat: JSON.stringify(sub_cat),
      date: formattedDate,
      received_by: JSON.stringify(received_by),
      particulars: particulars,
      departments: JSON.stringify(departments),
      vehicles: JSON.stringify(vehicles),
      bills: JSON.stringify(bills.map(bill => ({
        bill_no: bill.bill_no,
        amount: bill.amount,
      }))),
    };

    // Collect all the files from bills
    const files = bills.flatMap(bill => bill.files);

    try {
      const response = await modifyForm(formData, files);
      console.log('Response:', response);
      setSnackbarMessage('Form submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/table');
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setSnackbarMessage('Error submitting form');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleClear = () => {
    setFyYear(null);
    setMonth(null);
    setHeadCat(null);
    setSubCat(null);
    setDate(null);
    setReceivedBy([]);
    setParticulars('');
    setDepartments(null);
    setVehicles(null);
    setIsSubCatDisabled(true);
    setIsDepartmentDisabled(true);
    setIsVehicleDisabled(true);
    setFiles([]);
    setBills([]);
  };

  const handleBillChange = (index, field, value) => {
    const updatedBills = [...bills];
    updatedBills[index][field] = value;
    setBills(updatedBills);
  };

  const handleFileUpload = (index, newFiles) => {
    const updatedBills = [...bills];
    updatedBills[index].files = [...updatedBills[index].files, ...newFiles];
    setBills(updatedBills);
  };

  const handleFileDelete = (billIndex, fileIndex) => {
    const updatedBills = [...bills];
    updatedBills[billIndex].files.splice(fileIndex, 1);
    setBills(updatedBills);
  };

  const addNewBill = () => {
    setBills([...bills, { bill_no: "", amount: "", files: [] }]);
  };

  const removeBill = (index) => {
    const updatedBills = [...bills];
    updatedBills.splice(index, 1);
    setBills(updatedBills);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Dash />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 12 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: 3,
            borderRadius: 2,
            width: { xs: '90%', sm: '80%', md: '60%' },
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            style={{
              backgroundColor: '#32348c',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '50px',
            }}
          >
            <b>REPORT</b>
          </Typography>
          <Grid container spacing={2}>
            {/* Fiscal Year, Month, and Selected Date */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={fyYears}
                    getOptionLabel={(option) => option.fy_name}
                    value={fy_year}
                    onChange={(e, newValue) => setFyYear(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Fiscal Year"
                        error={!!errors.fy_year}
                        helperText={errors.fy_year || ''}
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={months}
                    getOptionLabel={(option) => option.month_name}
                    value={month}
                    onChange={(e, newValue) => setMonth(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Month"
                        error={!!errors.month}
                        helperText={errors.month || ''}
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label="Date"
                      format="dd/MM/yyyy"
                      value={date}
                      onChange={(newValue) => setDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.date}
                          helperText={errors.date}
                          sx={{ borderRadius: '30px' }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
  
            {/* Head Category and Sub Category */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={headCats}
                    getOptionLabel={(option) => option.head_cat_name}
                    value={head_cat}
                    onChange={(e, newValue) => {
                      setHeadCat(newValue);
                      setIsSubCatDisabled(newValue === null);
                      if (newValue === null) {
                        setSubCat(null);
                        setDepartments(null);
                        setVehicles(null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Head Category"
                        error={!!errors.head_cat}
                        helperText={errors.head_cat || ''}
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={subCats}
                    getOptionLabel={(option) => option.sub_cat_name}
                    value={sub_cat}
                    onChange={(e, newValue) => setSubCat(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sub Category"
                        error={!!errors.sub_cat}
                        helperText={errors.sub_cat || ''}
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    )}
                    disabled={isSubCatDisabled}
                  />
                </Grid>
              </Grid>
            </Grid>
  
            {/* Departments and Vehicles */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={departmentsList}
                    getOptionLabel={(option) => option.dept_full_name}
                    value={departments || []}
                    onChange={(e, newValue) => setDepartments(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Departments"
                        error={!!errors.departments}
                        helperText={errors.departments || ''}
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    )}
                    disabled={isDepartmentDisabled}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={vehiclesList}
                    getOptionLabel={(option) => option.vehicle_name}
                    value={vehicles || []}
                    onChange={(e, newValue) => setVehicles(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vehicles"
                        error={!!errors.vehicles}
                        helperText={errors.vehicles || ''}
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    )}
                    disabled={isVehicleDisabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={employees}
                    getOptionLabel={(option) =>
                      `${option.emp_id} / ${option.emp_name} / ${option.emp_designation}`
                    }
                    value={received_by}
                    onChange={(e, newValue) => setReceivedBy(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Received By"
                        variant="filled"
                        error={!!errors.received_by}
                        helperText={errors.received_by || ''}
                        sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    fullWidth
                    label="Particulars"
                    variant="filled"
                    value={particulars}
                    onChange={(e) => setParticulars(e.target.value)}
                    error={!!errors.particulars}
                    helperText={errors.particulars || ''}
                    sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
                  />
                </Grid>
              </Grid>
            </Grid>
  
            {/* Bills Section */}
            <Grid item xs={12}>
              {bills.map((bill, index) => (
                <Box key={index} mb={3}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Bill Number"
                        value={bill.bill_no}
                        onChange={(e) =>
                          handleBillChange(index, 'bill_no', e.target.value)
                        }
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Amount"
                        type="number"
                        value={bill.amount}
                        onChange={(e) =>
                          handleBillChange(index, 'amount', e.target.value)
                        }
                        fullWidth
                        sx={{ borderRadius: '30px' }}
                      />
                    </Grid>
                        {/* Upload Files */}
                        <Grid item xs={3} sm={2}>
                          <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            startIcon={<UploadFileIcon />}
                            sx={{ backgroundColor: '#32348c' }}
                          >
                            Upload
                            <input
                              type="file"
                              multiple
                              hidden
                              accept=".png,.jpeg,.jpg,.pdf"
                              onChange={(e) => handleFileUpload(index, e.target.files)}
                            />
                          </Button>
                        </Grid>
                        {/* Delete Button */}
                        <Grid item xs={3} sm={2}>
                          <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            startIcon={<DeleteIcon />}
                            onClick={() => removeBill(index)}
                            disabled={bills.length === 1} // Prevent removing the last bill
                            color="error"
                          >
                            Delete
                          </Button>
                        </Grid>
                  </Grid>
                                        {/* Files Chips */}
                                        <Box mt={1}>
                                          {bills[index]?.files?.length > 0 ? (
                                            bills[index].files.map((file, fileIndex) => (
                                              <Chip
                                                key={fileIndex}
                                                label={file.name || file}
                                                onDelete={() => handleFileDelete(index, fileIndex)}
                                                sx={{ mr: 1, mb: 1 }}
                                              />
                                            ))
                                          ) : (
                                            <Typography variant="body2" color="textSecondary">
                                              No files uploaded.
                                            </Typography>
                                          )}
                                        </Box>
                  
                                        <Divider sx={{ my: 2 }} />
                </Box>
              ))}
              <Box sx={{ textAlign: 'right' }}>
              <Button
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={addNewBill}
                      sx={{ mb: 2, color: '#32348c' }}
                    >
                      Add Bill
                    </Button>
              </Box>
            </Grid>
  

            {/* Submit and Clear Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="submit" variant="contained" color="success" sx={{ flexGrow: 1, mr: 1, borderRadius: '50px' }}>
                  Submit
                </Button>
                <Button variant="contained" color="error" onClick={handleClear} sx={{ flexGrow: 1, borderRadius: '50px' }}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
  
  
  
  
};

export default Update;

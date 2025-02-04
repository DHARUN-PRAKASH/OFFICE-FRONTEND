import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Autocomplete,
  Box,
  Grid,
  Paper,
  Typography,
  Button, Chip
} from "@mui/material";
import {
  getFormsByVehicleID,
  getFormsByHeadCatName,
  getFormsBySubCatName,
  getFormsByAmount,
  getFormsByFyYear,
  getFormsByMonth,
  getFormsByEmployeeIDs,
  getFormsByParticulars,
  getFormsByDate,
  getforms,
  getHeadCat,
  getSubCat,
  getMonth,
  getEmployee,
  getVehicle,
  getFyYear,
  deleteFormById,
  getFormsByBillNos,
  getFiscalYears,
  dateFilter
} from "./axios";
import Dash from "./dash";
import { PDFDocument, rgb } from "pdf-lib";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import Dial from "./speeddial";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

// Define custom styling for column headers
const useStyles = {
  header: {
    backgroundColor: "#32348c", // Your preferred color
    color: "#ffffff", // Ensure the text is readable
    fontSize: "16px",
    fontWeight: "bold",
  },
};

const Table = () => {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    vehicleId: "",
    headCategory: "",
    subCategory: "",
    amount: "",
    fyYear: "",
    month: "",
    employeeIds: "",
    particulars: "",
    date: null,
    bill: "",
    fromDate:null,
    toDate:null
  });


  const [headCats, setHeadCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [months, setMonths] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [fyYears, setFyYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          headCatData,
          subCatData,
          monthData,
          employeeData,
          vehicleData,
          fyYearData,
        ] = await Promise.all([
          getHeadCat(),
          getSubCat(),
          getMonth(),
          getEmployee(),
          getVehicle(),
          getFyYear(),
        ]);
        setHeadCats(headCatData);
        setSubCats(subCatData);
        setMonths(monthData);
        setEmployees(employeeData);
        setVehicles(vehicleData);
        setFyYears(fyYearData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);
  const handleFilterChange = (e, value, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };



  // Fetch forms based on filters
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        let data = [];

        // Construct filter criteria
        const activeFilters = Object.keys(filters).filter((key) => filters[key]);
        if (activeFilters.length === 0) {
          data = await getforms();
          console.log("Data fetched without filters:", data);
        } else {
          if (filters.vehicleId) {
            data = await getFormsByVehicleID(filters.vehicleId);
          } else if (filters.headCategory) {
            data = await getFormsByHeadCatName(filters.headCategory);
          } else if (filters.subCategory) {
            data = await getFormsBySubCatName(filters.subCategory);
          } else if (filters.amount) {
            data = await getFormsByAmount(filters.amount);
          } else if (filters.fyYear) {
            data = await getFormsByFyYear(filters.fyYear);
          } else if (filters.month) {
            data = await getFormsByMonth(filters.month);
          } else if (filters.employeeIds) {
            const employeeIds = Array.isArray(filters.employeeIds)
              ? filters.employeeIds
              : [filters.employeeIds];
            data = await getFormsByEmployeeIDs(employeeIds);
          } else if (filters.particulars) {
            data = await getFormsByParticulars(filters.particulars);
          } else if (filters.date) {
            data = await getFormsByDate(format(filters.date, 'dd-MM-yyyy'));
          } else if (filters.bill.length > 0) {
            data = await getFormsByBillNos(filters.bill);
          }
        }

        // Apply date range filter if dates are selected
        if (fromDate && toDate) {
          const formattedFromDate = format(fromDate, 'dd-MM-yyyy');
          const formattedToDate = format(toDate, 'dd-MM-yyyy');
          data = await dateFilter(formattedFromDate, formattedToDate);
        }

        // Format the response data for display
        const formattedData = data.map((form, index) => ({
          objectId: form._id,
          id: index + 1,
          vehicleId: form.vehicles?.map((vehicle) => vehicle.vehicle_id).join(', ') || 'N/A',
          date: form.date,
          headCategory: form.head_cat?.head_cat_name || 'N/A',
          subCategory: form.sub_cat?.sub_cat_name || 'N/A',
          particulars: form.particulars,
          amount: form.TotalAmount,
          merged_pdf: form.merged_pdf,
          fyYear: form.fy_year?.fy_name || 'N/A',
          month: form.month?.month_name || 'N/A',
          employeeIds: form.received_by?.map((emp) => emp.emp_id).join(', ') || 'N/A',
          departments: form.departments?.map((department) => department.dept_id).join(', ') || 'N/A',
          bill_no: form.bill_no || 'N/A',
        }));

        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [filters, fromDate, toDate]);



  const handlePdfGeneration = (rowData) => {
    try {
      const doc = new jsPDF();

      // Set title with background color and centered text
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(50, 52, 140);
      doc.rect(0, 0, 210, 15, "F"); // Header rectangle
      doc.text("Report", 105, 10, { align: "center" });

      // Define field-value pairs with the required keys only
      const fields = [
        ["Head Category", rowData.headCategory || "N/A"],
        ["Sub Category", rowData.subCategory || "N/A"],
        ["Vehicle ID", rowData.vehicleId || "N/A"],
        ["Departments", rowData.departments || "N/A"],
        ["Employee ID", rowData.employeeIds || "N/A"],
        ["Particulars", rowData.particulars || "N/A"],
        ["Total Amount", rowData.amount || "N/A"],
        ["Financial Year", rowData.fyYear || "N/A"],
        ["Month", rowData.month || "N/A"]
      ];

      // Initial Y position for the content
      let yPosition = 25;

      // Field-value table header
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(50, 52, 140);
      doc.rect(10, yPosition, 190, 10, "F"); // Header row rectangle
      doc.text("Field", 15, yPosition + 7);
      doc.text("Value", 110, yPosition + 7);
      yPosition += 12;

      // Field-value table rows
      fields.forEach(([field, value], index) => {
        // Alternate row color for better readability
        const isEvenRow = index % 2 === 0;
        doc.setFillColor(isEvenRow ? 240 : 255); // Light gray for even rows
        doc.rect(10, yPosition, 190, 10, "F"); // Row background

        // Set text styles
        doc.setFont("helvetica", "bold"); // Bold for field names
        doc.setTextColor(50, 50, 50);
        doc.text(field, 15, yPosition + 7); // Field text

        doc.setFont("helvetica", "normal"); // Normal for values
        doc.text(value.toString(), 110, yPosition + 7); // Value text

        yPosition += 10; // Increment Y position for the next row
      });

      // Open PDF in a new tab
      const pdfOutput = doc.output("dataurlnewwindow");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };



  const isAdmin = sessionStorage.getItem('admin') === 'true';

  const columns = [
    {
      field: "id",
      headerName: <b>S.No</b>,
      flex: 0.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "vehicleId",
      headerName: <b>VEHICLE ID</b>,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "date",
      headerName: <b>DATE</b>,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "headCategory",
      headerName: <b>HEAD CATEGORY</b>,
      flex: 1.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "subCategory",
      headerName: <b>SUB CATEGORY</b>,
      flex: 1.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "particulars",
      headerName: <b>PARTICULARS</b>,
      flex: 1.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "amount",
      headerName: <b>TOTAL AMOUNT</b>,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "merged_pdf",
      headerName: <b>PDF</b>,
      flex: 0.5,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          component="a"
          href={`http://10.167.1.7:90/merged_pdf/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PictureAsPdfRoundedIcon />
        </IconButton>
      ),
    },

    {
      field: "generatePdf",
      headerName: <b>GEN PDF</b>,
      flex: 0.7,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton onClick={() => handlePdfGeneration(params.row)}>
          <PreviewRoundedIcon />
        </IconButton>
      ),
    },
    isAdmin && {
      field: "actions",
      headerName: <b>ACTIONS</b>,
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.objectId)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.objectId)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ].filter(Boolean); // Remove undefined columns if not admin

  const handleClear = () => {
    setFilters({
      vehicleId: "",
      headCategory: "",
      subCategory: "",
      amount: "",
      fyYear: "",
      month: "",
      employeeIds: "",
      particulars: "",
      date: null,
      bill: "",
      fromDate:null,
      toDate:null
    });
    setFromDate(null);
    setToDate(null);  
  };

  const handleDelete = async (id) => {
    try {
      await deleteFormById(id);
      setRows((prevRows) => prevRows.filter((row) => row.objectId !== id));
    } catch (error) {
      console.error("Failed to delete the form:", error);
    }
  };

  const handleEdit = (objectId) => {
    console.log(`Edit row with ID: ${objectId}`);
    navigate(`/update/${objectId}`);
  };


  // Handle adding a new bill number
  const handleAddBill = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      event.preventDefault();
      const value = event.target.value.trim();
      if (!filters.bill.includes(value)) {
        setFilters((prev) => ({
          ...prev,
          bill: [...prev.bill, value],
        }));
      }
      event.target.value = '';
    }
  };

  const handleDeleteBill = (billToDelete) => {
    setFilters((prev) => {
      const updatedBills = prev.bill.filter((bill) => bill !== billToDelete);
      return {
        ...prev,
        bill: updatedBills.length > 0 ? updatedBills : "", // Set to '' if no bills remain
      };
    });
  };


  return (
    <div>
      <Dash />
      <div
        style={{
          padding: "30px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          marginTop: "30px",
          borderRadius: "10px",
        }}
      >
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              backgroundColor: "#32348c",
              color: "white",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <b>YOUR REPORT</b>
          </Typography>
          
          <Grid container spacing={2}>
            {[ 
              { label: "Vehicle ID", options: vehicles.map((v) => v.vehicle_id), key: "vehicleId" },
              { label: "Head Category", options: headCats.map((hc) => hc.head_cat_name), key: "headCategory" },
              { label: "Sub Category", options: subCats.map((sc) => sc.sub_cat_name), key: "subCategory" },
              { label: "Financial Year", options: fyYears.map((fy) => fy.fy_name), key: "fyYear" },
              { label: "Month", options: months.map((m) => m.month_name), key: "month" }
            ].map((field, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Autocomplete
                  options={field.options}
                  renderInput={(params) => <TextField {...params} variant="standard" label={field.label} fullWidth />}
                  value={filters[field.key]}
                  onChange={(e, value) => handleFilterChange(e, value, field.key)}
                />
              </Grid>
            ))}
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="number"
                label="Amount"
                variant="standard"
                value={filters.amount}
                onChange={(e) => handleFilterChange(e, e.target.value, "amount")}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={employees}
                getOptionLabel={(option) => `${option.emp_id} / ${option.emp_name} / ${option.emp_designation}`}
                renderInput={(params) => <TextField {...params} variant="standard" label="Employees" fullWidth />}
                value={employees.filter(emp => filters.employeeIds?.includes(emp.emp_id)) || []}
                onChange={(e, value) => handleFilterChange(e, value.map(emp => emp.emp_id), "employeeIds")}
                isOptionEqualToValue={(option, value) => option.emp_id === value.emp_id}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="text"
                label="Particulars"
                variant="standard"
                value={filters.particulars}
                onChange={(e) => handleFilterChange(e, e.target.value, "particulars")}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={filters.bill}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip key={option} label={option} {...getTagProps({ index })} onDelete={() => handleDeleteBill(option)} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="standard" label="Bill Numbers" placeholder="Type and press Enter" onKeyDown={handleAddBill} fullWidth />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={filters.date || null}
                  onChange={(newValue) => handleFilterChange(null, newValue, "date")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      onChange={(newValue) => setFromDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SwapHorizIcon />
                  </Grid>
                  <Grid item xs={5}>
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      onChange={(newValue) => setToDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Button onClick={handleClear} variant="contained" color="error" fullWidth>
                CLEAR FILTER
              </Button>
            </Grid>
          </Grid>
  
          <Box sx={{ height: 600, width: "100%", marginTop: "15px" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10} // Set page size to 10
              pagination
              sx={{
                "& .super-app-theme--header": useStyles.header, // Apply the header styling
                "& .MuiDataGrid-columnHeader": {
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }, // Fix header position
                "& .MuiDataGrid-cell": {
                  padding: "8px",
                },
              }}
            />
          </Box>
        </Paper>
      </div>
      <Dial />
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Table;

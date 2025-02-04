import axios from 'axios';

import { toDate } from 'date-fns';

// BASE URL

const BASE_URL = "http://10.167.1.7:90";  //90



// POST SIGN IN

export const postsignin = (userData) => {
  return axios.post(`${BASE_URL}/signin`, userData);
};


// POST REPORT OR FORM

export const postform = async (formData, files) => {
  try {
    const data = new FormData();

    // Append form fields
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        data.append(key, formData[key]);
      }
    }

    // Append files
    files.forEach((file) => {
      data.append('files', file);
    });

    // Post form data to the server
    const response = await axios.post(`${BASE_URL}/postform`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error posting form:', error);
    throw error;
  }
};


// DELETE FORM 

export const deleteFormById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/erase/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
};

export const getHeadCat = async () => {
  const response = await axios.get(`${BASE_URL}/gethead_cat`);
  return response.data;
};

export const getSubCat = async () => {
  const response = await axios.get(`${BASE_URL}/getsub_cat`);
  return response.data;
};

export const getMonth = async () => {
  const response = await axios.get(`${BASE_URL}/getmonth`);
  return response.data;
};

export const getDepartment = async () => {
  const response = await axios.get(`${BASE_URL}/getdepartment`);
  return response.data;
};

export const getEmployee = async () => {
  const response = await axios.get(`${BASE_URL}/getemployee`);
  return response.data;
};

export const getVehicle = async () => {
  const response = await axios.get(`${BASE_URL}/getvehicle`);
  return response.data;
};

export const getFyYear = async () => {
  const response = await axios.get(`${BASE_URL}/getfy_year`);
  return response.data;
};

export const getforms = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getforms`);
    const data = response.data;

    // Reverse the data array so that the last item comes first
    const reversedData = data.reverse();

    return reversedData;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
};

// Function to get fiscal year data  for action button if fy_id is true show the actiion button for admin : false users 
export const getFiscalYears = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getfy_year`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fiscal year data:", error);
    throw error; // Propagate the error for handling in the component
  }
};


// Function to get forms by amount
export const getFormsByAmount = async (amount) => {
  try {
    const response = await axios.get(`${BASE_URL}/${amount}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by amount:', error);
    throw error;
  }
};

// Function to get forms by particulars
export const getFormsByParticulars = async (particulars) => {
  try {
    const response = await axios.get(`${BASE_URL}/particulars/${particulars}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by particulars:', error);
    throw error;
  }
};

// Function to get forms by fiscal year
export const getFormsByFyYear = async (fyYear) => {
  try {
    const response = await axios.get(`${BASE_URL}/fy_year/${fyYear}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by fiscal year:', error);
    throw error;
  }
};

// Function to get forms by month
export const getFormsByMonth = async (month) => {
  try {
    const response = await axios.get(`${BASE_URL}/month/${month}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by month:', error);
    throw error;
  }
};

// Function to get forms by date
export const getFormsByDate = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/date/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by date:', error);
    throw error;
  }
};

// Function to get forms by head category name
export const getFormsByHeadCatName = async (headCatName) => {
  try {
    const response = await axios.get(`${BASE_URL}/getFormByHeadCatName/${headCatName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by head category name:', error);
    throw error;
  }
};

// Function to get forms by subcategory name
export const getFormsBySubCatName = async (subCatName) => {
  try {
    const response = await axios.get(`${BASE_URL}/getFormBySubCatName/${subCatName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by subcategory name:', error);
    throw error;
  }
};

// Function to get forms by vehicle ID
export const getFormsByVehicleID = async (vehicleID) => {
  try {
    const response = await axios.get(`${BASE_URL}/getFormByVehicleID/${vehicleID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by vehicle ID:', error);
    throw error;
  }
};

// Function to get forms by employee ID
export const getFormsByEmployeeIDs = async (empIDs) => {
  try {
    // Convert empIDs (array) into a comma-separated string
    const queryParam = empIDs.join(',');
    const response = await axios.get(`${BASE_URL}/getFormsByEmployeeIDs`, {
      params: {
        emp_ids: queryParam, // Pass the comma-separated IDs as a query parameter
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by employee IDs:', error);
    throw error;
  }
};

// FILTER FOR BILL NO 

export const getFormsByBillNos = async (billNos) => {
  try {
    // Join the bill numbers into a comma-separated string
    const billNosString = billNos.join(',');

    // Make the GET request with the bill_nos query parameter
    const response = await axios.get(`${BASE_URL}/getFormsByBillNos?bill_nos=${billNosString}`);

    // Return the response data (the forms)
    return response.data;
  } catch (error) {
    console.error('Error fetching forms by bill numbers:', error);
    throw error; // Rethrow the error to handle it further up the chain
  }
};

// GET FORM DATA BY FY YEAR AND MONTH 

export const getFormsByFyYearAndMonth = async (fy_year, month) => {
  try {
    const response = await axios.get(`${BASE_URL}/fy_year_month/${fy_year}/${month}`);
    return response.data;
  } catch (error) {
    console.error('Failed to retrieve forms', error);
    throw error;
  }
};

// Fetch financial year options
export const getFyYearOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getfyyearoption`);
    return response.data;
  } catch (error) {
    console.error('Error fetching financial year options:', error);
    throw error;
  }
};

// Fetch month options CS
export const getMonthOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getmonthoption`);
    return response.data;
  } catch (error) {
    console.error('Error fetching month options:', error);
    throw error;
  }
};

// Fetch month data
export const fetchMonthData = () => {
  return axios.get(`${BASE_URL}/getmonth`);
};

// Get financial year status
export const getFyYearStatus = (fyName) => {
  return axios.get(`${BASE_URL}/getfy_year`, {
    params: { fy_name: fyName }
  });
};

// Get month status
export const getMonthStatus = (monthName) => {
  return axios.get(`${BASE_URL}/getmonth`, {
    params: { month_name: monthName }
  });
};

// Activate financial year
export const activateFyYear = (fyName) => {
  return axios.post(`${BASE_URL}/settruefyyear`, { fy_name: fyName });
};

// Lock financial year
export const lockFyYear = (fyName) => {
  return axios.post(`${BASE_URL}/setfalsefyyear`, { fy_name: fyName });
};

// Activate month
export const activateMonth = (monthName) => {
  return axios.post(`${BASE_URL}/setmonthtrue`, { month_name: monthName });
};

// Lock month
export const lockMonth = (monthName) => {
  return axios.post(`${BASE_URL}/setmonthfalse`, { month_name: monthName });
};

// GET FORM BY ID 

export const getFormById = async (formId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getforms/${formId}`);
    console.log('Form fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error during the request setup:', error.message);
    }
    throw error;
  }
};

// MODIFY 

export const modifyForm = async (formData, files) => {
  try {
    const data = new FormData();

    // Append form fields
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = formData[key];
        // Check if the value is an array and stringify it
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      }
    }

    // Append files only if files exist
    if (files && files.length > 0) {
      files.forEach((file) => {
        data.append('files', file);
      });
    }

    // Put form data to the server
    const response = await axios.put(`${BASE_URL}/modify`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data); // Backend returned error response
    } else if (error.request) {
      console.error('No response received:', error.request); // Request made but no response
    } else {
      console.error('Error during the request setup:', error.message); // Error in setting up the request
    }
    throw error;
  }
};


//fiter by date in consolidate
export const dateFilter = async (formattedFDate, formattedTDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/date_filter/${formattedFDate}/${formattedTDate}`);
    console.log('Form fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// ADMIN MONTH FETCH

export const fetchMonthUpdates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/month-updates`); // Replace with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching month updates:', error);
    return null; // Handle error gracefully
  }
};


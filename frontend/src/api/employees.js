import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

// Use global axios instance with baseURL
axios.defaults.baseURL = baseURL;

// ==============================
// Employees
// ==============================
export const createEmployee = async (payload) => {
  const res = await axios.post('/employees', payload);
  return res.data;
};

export const updateEmployee = async (id, payload) => {
  const res = await axios.put(`/employees/${id}`, payload);
  return res.data;
};

export const getEmployeeByNic = async (nic) => {
  try {
    console.log('Fetching employee with NIC:', nic);
    console.log('Full URL:', `${baseURL}/employees/nic/${nic}`);
    const res = await axios.get(`/employees/nic/${nic}`);
    console.log('Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  const res = await axios.delete(`/employees/${id}`);
  return res;
};

export const getEmployees = async () => {
  const res = await axios.get('/employees');
  return res.data;
};

export const getEmployeeById = async (id) => {
  const res = await axios.get(`/employees/${id}`);
  return res.data;
};

// ==============================
// Attendance
// ==============================
export const getAttendance = async () => {
  const res = await axios.get('/attendance');
  return res.data;
};

export const getAttendanceByEmployee = async (employeeId) => {
  const res = await axios.get(`/attendance/employee/${employeeId}`);
  return res.data;
};

export const getAttendanceSummary = async (employeeId) => {
  const res = await axios.get(`/attendance/employee/${employeeId}/summary`);
  return res.data;
};

export const getAttendanceByDateRange = async (employeeId, startDate, endDate) => {
  const res = await axios.get(
    `/attendance/employee/${employeeId}/range?startDate=${startDate}&endDate=${endDate}`
  );
  return res.data;
};

export const markAttendance = async (payload) => {
  const res = await axios.post('/attendance', payload);
  return res.data;
};

export const updateAttendance = async (employeeId, workDate, status) => {
  const res = await axios.put(
    `/attendance/${employeeId}/${workDate}?status=${encodeURIComponent(status)}`
  );
  return res.data;
};

// ==============================
// Messages (Admin)
// ==============================
export const getAllMessagesAdmin = async () => {
  const res = await axios.get('/admin/Requests');
  return res.data;
};

export const markMessageAsDone = async (id) => {
  const res = await axios.put(`/admin/Requests/${id}/done`);
  return res.data;
};

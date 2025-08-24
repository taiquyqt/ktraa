import axios from 'axios';
import type { ApiResponse, Employee } from "../types/employee.type";

const EMPLOYEE_API_URL = "http://localhost:8080/api/employees";

// Hàm lấy danh sách nhân viên
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get<ApiResponse<Employee[]>>(EMPLOYEE_API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw new Error("Failed to fetch employees");
  }
};

// Tạo nhân viên mới
export const createEmployee = async (
  employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'active'>
): Promise<Employee> => {
  try {
    const response = await axios.post<ApiResponse<Employee>>(EMPLOYEE_API_URL, employeeData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create employee:", error);
    throw new Error("Failed to create employee");
  }
};

// Cập nhật nhân viên
export const updateEmployee = async (employeeData: Employee): Promise<Employee> => {
  try {
    // Chuẩn hóa payload theo EmployeeUpdateRequest bên BE
    const payload = {
      fullName: employeeData.fullName,
      dateOfBirth: employeeData.dateOfBirth,
      gender: employeeData.gender,
      phoneNumber: employeeData.phoneNumber,
      active: employeeData.active,
    };

    const response = await axios.put<ApiResponse<Employee>>(
      `${EMPLOYEE_API_URL}/${employeeData.id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update employee:", error);
    throw new Error("Failed to update employee");
  }
};

// Xóa nhân viên
export const deleteEmployee = async (employeeId: number): Promise<void> => {
  try {
    await axios.delete(`${EMPLOYEE_API_URL}/${employeeId}`);
  } catch (error) {
    console.error("Failed to delete employee:", error);
    throw new Error("Failed to delete employee");
  }
};

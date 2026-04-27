import axios from "axios";

const API_URL = "/api/admin/departments"; // To be created in backend

export interface Department {
  _id: string;
  name: string;
  description?: string;
  manager: string;
  status: "Active" | "Inactive";
}

export const getDepartments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDepartment = async (data: Partial<Department>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateDepartment = async (id: string, data: Partial<Department>) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

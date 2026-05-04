import { api } from '@/services/api';

const API_URL = '/admin/departments';

export interface Department {
  _id: string;
  name: string;
  description?: string;
  manager: string;
  status: 'Active' | 'Inactive';
}

export interface DepartmentApiResponse {
  success: boolean;
  data: Department | Department[];
  message?: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get<DepartmentApiResponse>(API_URL);
  if (response.data.success) {
    return response.data.data as Department[];
  }
  throw new Error(response.data.message || 'Failed to fetch departments');
};

export const createDepartment = async (data: Partial<Department>): Promise<Department> => {
  const response = await api.post<DepartmentApiResponse>(API_URL, data);
  if (response.data.success) {
    return response.data.data as Department;
  }
  throw new Error(response.data.message || 'Failed to create department');
};

export const updateDepartment = async (id: string, data: Partial<Department>): Promise<Department> => {
  const response = await api.put<DepartmentApiResponse>(`${API_URL}/${id}`, data);
  if (response.data.success) {
    return response.data.data as Department;
  }
  throw new Error(response.data.message || 'Failed to update department');
};

export const deleteDepartment = async (id: string): Promise<void> => {
  const response = await api.delete<DepartmentApiResponse>(`${API_URL}/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete department');
  }
};

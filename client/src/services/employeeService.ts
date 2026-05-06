import { api } from '@/services/api';
import { UserRole } from '@/types';

export interface EmployeeFiscalData {
  rfc: string;
  curp: string;
  fiscalCompliance: string; // URL or reference to document
  address: string;
  taxRegime: string;
}

export interface EmployeeOnboardingData {
  userId: string;
  fiscalData: EmployeeFiscalData;
  jobTitle: string;
  departmentId: string;
  teamId?: string;
  role: UserRole;
}

export const employeeService = {
  async updateFiscalData(userId: string, data: EmployeeFiscalData) {
    const { data: response } = await api.patch(`/api/employees/${userId}/fiscal`, data);
    return response;
  },

  async completeOnboarding(data: EmployeeOnboardingData) {
    const { data: response } = await api.post('/api/employees/onboarding/complete', data);
    return response;
  },
};

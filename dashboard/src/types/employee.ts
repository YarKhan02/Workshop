export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  position: string;
  address: string;
  joiningDate: string;
  salary: number;
}

export interface CreateEmployee {
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  position: string;
  address: string;
  joiningDate: string;
  salary: number;
}

export interface UpdateEmployee {
  fullName?: string;
  email?: string;
  phone?: string;
  nic?: string;
  position?: string;
  address?: string;
  joiningDate?: string;
  salary?: number;
}

export type CreditStatus = 'pending' | 'approved' | 'rejected';

export interface CreditApplication {
  id: string;
  name: string;
  motherName: string;
  fatherName: string;
  maritalStatus: string;
  gender: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  cep: string;
  city: string;
  address: string;
  country?: string;
  salary: string;
  status: CreditStatus;
  createdAt: string;
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: 'rg' | 'cpf' | 'income' | 'residence';
  url?: string;
  uploaded: boolean;
}

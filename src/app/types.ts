export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface PaymentProof {
  id: string;
  url: string;
  uploadedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  month: number; // 0-11
  year: number;
  proofs: PaymentProof[]; // Array of up to 2 proofs
}
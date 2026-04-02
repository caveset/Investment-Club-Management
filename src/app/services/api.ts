import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { User, PaymentRecord } from '../types';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const API_BASE = `${supabaseUrl}/functions/v1/make-server-f4ff8ddc`;

// ==================== AUTH ====================

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signUp(email: string, password: string, name: string, phone: string) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token || publicAnonKey;

  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password, name, phone }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  return response.json();
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ==================== USER ====================

export async function getMe() {
  const session = await getCurrentSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/me`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user');
  }

  const data = await response.json();
  return data.user;
}

export async function getAllUsers(): Promise<User[]> {
  const session = await getCurrentSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/users`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch users');
  }

  const data = await response.json();
  return data.users;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const session = await getCurrentSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }

  const data = await response.json();
  return data.user;
}

// ==================== PAYMENTS ====================

export async function getAllPayments(): Promise<PaymentRecord[]> {
  const session = await getCurrentSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/payments`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch payments');
  }

  const data = await response.json();
  return data.payments;
}

export async function uploadPaymentProof(
  userId: string,
  month: number,
  year: number,
  file: File
): Promise<PaymentRecord> {
  const session = await getCurrentSession();
  if (!session) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('month', month.toString());
  formData.append('year', year.toString());

  const response = await fetch(`${API_BASE}/payments/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload payment proof');
  }

  const data = await response.json();
  return data.payment;
}

export async function deletePaymentProof(
  userId: string,
  month: number,
  year: number,
  proofId: string
) {
  const session = await getCurrentSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(
    `${API_BASE}/payments/${userId}/${month}/${year}/${proofId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete payment proof');
  }

  const data = await response.json();
  return data.payment;
}

// ==================== INITIALIZATION ====================

export async function initializeDemoData() {
  console.log('Initializing demo data...');
  console.log('API URL:', `${API_BASE}/init-demo-data`);
  
  try {
    const response = await fetch(`${API_BASE}/init-demo-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const error = await response.json();
      console.error('Server error:', error);
      throw new Error(error.error || 'Failed to initialize demo data');
    }

    const data = await response.json();
    console.log('Init successful:', data);
    return data;
  } catch (error: any) {
    console.error('Fetch error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Provide more helpful error message
    if (error.message === 'Failed to fetch') {
      throw new Error(
        'Cannot connect to server. Please check:\n' +
        '1. Edge Function is deployed in Supabase\n' +
        '2. CORS is enabled\n' +
        '3. Your internet connection is active'
      );
    }
    
    throw error;
  }
}
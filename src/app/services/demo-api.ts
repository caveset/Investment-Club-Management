/**
 * DEMO MODE API
 * 
 * This is a fully functional demo that runs entirely in your browser
 * using localStorage. No backend or Supabase deployment needed!
 * 
 * Perfect for:
 * - Testing the app before deploying to Supabase
 * - Demos and presentations
 * - Development without internet connection
 */

import { User, PaymentRecord } from '../types';

const STORAGE_KEYS = {
  USERS: 'demo_users',
  PAYMENTS: 'demo_payments',
  CURRENT_USER: 'demo_current_user',
  SESSION: 'demo_session',
};

// Helper to get data from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper to save data to localStorage
function saveToStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ==================== AUTH ====================

export async function signIn(email: string, password: string) {
  await delay(500); // Simulate network delay

  const users: User[] = getFromStorage(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('Invalid login credentials');
  }

  // In demo mode, we accept any password for simplicity
  // (In production, this would verify the actual password)

  const session = {
    access_token: `demo_token_${user.id}`,
    user: user,
  };

  saveToStorage(STORAGE_KEYS.SESSION, session);
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);

  return session;
}

export async function signOut() {
  await delay(300);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export async function signUp(email: string, password: string, name: string, phone: string) {
  await delay(500);

  const users: User[] = getFromStorage(STORAGE_KEYS.USERS, []);
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    phone: phone || '',
    isAdmin: false,
    joinedAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // Create payment records
  const payments: PaymentRecord[] = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
  const currentYear = new Date().getFullYear();
  
  for (let month = 0; month < 12; month++) {
    payments.push({
      id: `payment-${newUser.id}-${month}-${currentYear}`,
      userId: newUser.id,
      month,
      year: currentYear,
      proofs: [],
    });
  }
  
  saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

  return { success: true, user: newUser };
}

export async function getCurrentSession() {
  return getFromStorage(STORAGE_KEYS.SESSION, null);
}

// ==================== USER ====================

export async function getMe() {
  await delay(200);
  const user = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  await delay(300);
  return getFromStorage(STORAGE_KEYS.USERS, []);
}

export async function updateUser(userId: string, updates: Partial<User>) {
  await delay(400);
  
  const users: User[] = getFromStorage(STORAGE_KEYS.USERS, []);
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    throw new Error('User not found');
  }

  users[index] = { ...users[index], ...updates };
  saveToStorage(STORAGE_KEYS.USERS, users);

  // Update current user if it's them
  const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  if (currentUser && currentUser.id === userId) {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, users[index]);
  }

  return users[index];
}

// ==================== PAYMENTS ====================

export async function getAllPayments(): Promise<PaymentRecord[]> {
  await delay(300);
  return getFromStorage(STORAGE_KEYS.PAYMENTS, []);
}

export async function uploadPaymentProof(
  userId: string,
  month: number,
  year: number,
  file: File
): Promise<PaymentRecord> {
  await delay(800); // Simulate upload time

  const payments: PaymentRecord[] = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
  const payment = payments.find(
    p => p.userId === userId && p.month === month && p.year === year
  );

  if (!payment) {
    throw new Error('Payment record not found');
  }

  if (payment.proofs.length >= 2) {
    throw new Error('Maximum 2 proofs per month allowed');
  }

  // In demo mode, we create a fake URL for the file
  const newProof = {
    id: `proof-${Date.now()}`,
    url: URL.createObjectURL(file), // Create a temporary URL
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };

  payment.proofs.push(newProof);
  saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

  return payment;
}

export async function deletePaymentProof(
  userId: string,
  month: number,
  year: number,
  proofId: string
) {
  await delay(400);

  const payments: PaymentRecord[] = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
  const payment = payments.find(
    p => p.userId === userId && p.month === month && p.year === year
  );

  if (!payment) {
    throw new Error('Payment record not found');
  }

  payment.proofs = payment.proofs.filter(p => p.id !== proofId);
  saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

  return payment;
}

// ==================== INITIALIZATION ====================

export async function initializeDemoData() {
  console.log('🎭 Initializing DEMO MODE data...');
  
  await delay(1000); // Simulate processing time

  // Member names (all 91 members)
  const memberNames = [
    'Mduduzi Cibane', 'Kennedy Mngoma', 'Peggy Lunga', 'PHUMLANI MADUNA',
    'Xoliswa Ngqase', 'Mphela malahlela', 'Patrick Hlathi', 'NhlaNhla Gwamada',
    'Lindani Majola', 'Celiwe Nhlapho', 'Mamokete Mookeletsi', 'Lindiwe Moyo',
    'Tumelo Motsoeneng', 'Dineo Seleke', 'Nonhlanhla Constance Kgafane', 'Nomthandazo Mavuso',
    'Mzwandile Moletsane', 'Mbali Tshabalala', 'Eric Hlangwane', 'Thandazo Mavuso',
    'George Taunyane', 'Nolusindiso Kondile', 'Sindisiwe sangweni', 'Sizakele Nhlabathi',
    'Ashley Mdletshe Malefane', 'Steven moleya', 'Diketso Makhele', 'Nhlanhla Khumalo',
    'Teressa Kgatitsoe', 'Steven Moleya', 'Shika Mathspo', 'Boitumelo Khoza',
    'Nompumelelo Ngqasa', 'Paulos Mazibu', 'Lawrence Ngomane', 'Mlungisi kop Abraham',
    'Celiwe Gunguluza', 'Anele Thanjekwayo', 'Josias Mbuyane', 'Vusi madonsela',
    'Zoleka Malefane', 'Arnold Sicelo Mazibu', 'Dikeledi Mathikge', 'Thulang Chauke',
    'Siyanda fanayedwa', 'Sizakele Mhlongo', 'Ntombizethu Le Roux', 'Puleng Tubane',
    'Maureen Sepaila', 'Caroline Dokota Makhasi', 'Maurice Phungwayo', 'Mduduzi Ndlovu',
    'Dimakatso Skhosana', 'Jabulani TSHABALALA', 'Joel Moeketsi Mokoetle', 'Thokozile Khumalo',
    'Boitumelo Lesola', 'Jabulile Dhlamini', 'Buyisiwe sibiya', 'Freddy Phakathi',
    'Hamilton Hukwe', 'Ntsakisi nemadzhilili', 'Bongani Vilakazi', 'Phila Nkumane',
    'Jabulani Tshabalala', 'Busiswa Mkhwanazi', 'Pauline Tsilo', 'Mduduzi Ndlovu B',
    'Nqobile Phewa', 'Sipho Mazibuko', 'Sidwell Khahloe', 'Lindiwe Maseko',
    'Edward Molotsane', 'Smangele Matshongo', 'Maria shirindza', 'Kiki Nkosi',
    'Carl mooke', 'Tintswalo Precious Ngoveni', 'Siyabonga Simelane', 'Mesh Gwadana',
    'Kgomotso Mosounyane', 'Esther mampho Rankapole', 'Zanele Portia Ngema', 'Talia Mathye',
    'Tumelo Zwane', 'Zanele Nhlabathi', 'Esther mampho', 'Charles Tokota',
    'Sibusiso Mazibuko', 'Lunga Skweyiya', 'Thabang Makhele'
  ];

  const users: User[] = [];
  const payments: PaymentRecord[] = [];
  const currentYear = new Date().getFullYear();

  // Create admin user
  const admin: User = {
    id: 'admin_001',
    email: 'admin@club.com',
    name: 'Admin User',
    phone: '+27123456789',
    isAdmin: true,
    joinedAt: new Date(2026, 0, 1).toISOString(),
  };
  users.push(admin);

  // Create all 91 members
  memberNames.forEach((name, i) => {
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@club.com`;
    const phone = `+2712345${(6800 + i).toString().padStart(4, '0')}`;
    
    const member: User = {
      id: `member_${(i + 1).toString().padStart(3, '0')}`,
      email,
      name,
      phone,
      isAdmin: false,
      joinedAt: new Date(2026, 0, 1 + Math.floor(i / 3)).toISOString(),
    };
    users.push(member);

    // Create payment records with random data
    const monthsPaid = Math.floor(Math.random() * 13);
    const paidMonths = new Set<number>();
    
    while (paidMonths.size < monthsPaid) {
      paidMonths.add(Math.floor(Math.random() * 12));
    }

    for (let month = 0; month < 12; month++) {
      const isPaid = paidMonths.has(month);
      const proofs = [];
      
      if (isPaid) {
        const numProofs = Math.random() > 0.5 ? 2 : 1;
        for (let p = 0; p < numProofs; p++) {
          proofs.push({
            id: `demo-proof-${member.id}-${month}-${p}`,
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileName: `payment-${month + 1}-proof-${p + 1}.pdf`,
            uploadedAt: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1).toISOString(),
          });
        }
      }

      payments.push({
        id: `payment-${member.id}-${month}-${currentYear}`,
        userId: member.id,
        month,
        year: currentYear,
        proofs,
      });
    }
  });

  // Save to localStorage
  saveToStorage(STORAGE_KEYS.USERS, users);
  saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

  console.log('✅ Demo data initialized:', {
    users: users.length,
    payments: payments.length,
  });

  return {
    success: true,
    message: 'Demo data initialized successfully!',
    admin: {
      email: 'admin@club.com',
      password: 'demo123',
      note: 'Use these credentials to log in (any password works in demo mode)',
    },
    members: {
      created: memberNames.length,
      total: memberNames.length,
      defaultPassword: 'demo123',
      note: 'All members can log in with their email and any password',
    },
  };
}

// ==================== HELPERS ====================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if demo data is initialized
export function isDemoDataInitialized(): boolean {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  return users.length > 0;
}

// Clear all demo data (for testing)
export function clearDemoData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

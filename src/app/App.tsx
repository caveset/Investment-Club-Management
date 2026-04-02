import { useState, useEffect } from 'react';
import { AuthScreen } from './components/auth-screen';
import { AdminDashboard } from './components/admin-dashboard';
import { UserDashboard } from './components/user-dashboard';
import { User, PaymentRecord } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import * as api from './services/api';
import * as demoApi from './services/demo-api';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Detect if we should use demo mode
  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(
          'https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health',
          { method: 'GET' }
        );
        
        if (response.ok) {
          console.log('✅ Backend available - using production mode');
          setIsDemoMode(false);
        } else {
          console.log('🎭 Backend unavailable - switching to DEMO MODE');
          setIsDemoMode(true);
        }
      } catch (error) {
        console.log('🎭 Backend unavailable - switching to DEMO MODE');
        setIsDemoMode(true);
      }
    }

    checkBackend();
  }, []);

  // Get the appropriate API based on mode
  const getApi = () => isDemoMode ? demoApi : api;

  // Check for existing session and load data
  useEffect(() => {
    async function initializeApp() {
      try {
        const session = await getApi().getCurrentSession();
        
        if (session) {
          // Load current user profile
          const userProfile = await getApi().getMe();
          setCurrentUser(userProfile);

          // Load all users and payments
          await loadData();
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    }

    // Wait a bit to ensure mode is set before initializing
    const timer = setTimeout(() => {
      initializeApp();
    }, 100);

    return () => clearTimeout(timer);
  }, [isDemoMode]); // Re-run when mode changes

  const loadData = async () => {
    try {
      const [usersData, paymentsData] = await Promise.all([
        getApi().getAllUsers(),
        getApi().getAllPayments()
      ]);

      setUsers(usersData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    }
  };

  const handleLogin = async (email: string, password: string, isAdmin: boolean) => {
    try {
      // Sign in with Supabase
      const session = await getApi().signIn(email, password);
      
      if (!session) {
        toast.error('Login failed');
        return;
      }

      // Get user profile
      const userProfile = await getApi().getMe();
      
      // Check if user type matches
      if (userProfile.isAdmin !== isAdmin) {
        await getApi().signOut();
        toast.error('Invalid credentials or wrong user type');
        return;
      }

      setCurrentUser(userProfile);
      toast.success(`Welcome back, ${userProfile.name}!`);

      // Load data after login
      await loadData();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    }
  };

  const handleRegister = async (name: string, email: string, password: string, phone: string) => {
    try {
      // Register new user
      const result = await getApi().signUp(email, password, name, phone);
      
      if (!result.success) {
        toast.error('Registration failed');
        return;
      }

      // Now sign them in
      await getApi().signIn(email, password);
      
      // Get their profile
      const userProfile = await getApi().getMe();
      setCurrentUser(userProfile);
      toast.success('Registration successful!');

      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    try {
      await getApi().signOut();
      setCurrentUser(null);
      setUsers([]);
      setPayments([]);
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleUploadPayment = async (userId: string, month: number, year: number, file: File) => {
    try {
      const updatedPayment = await getApi().uploadPaymentProof(userId, month, year, file);
      
      // Update local state
      setPayments(payments.map(p => 
        p.userId === userId && p.month === month && p.year === year 
          ? updatedPayment 
          : p
      ));

      toast.success('Payment proof uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    }
  };

  const handleDeleteProof = async (userId: string, month: number, year: number, proofId: string) => {
    try {
      const updatedPayment = await getApi().deletePaymentProof(userId, month, year, proofId);
      
      // Update local state
      setPayments(payments.map(p => 
        p.userId === userId && p.month === month && p.year === year 
          ? updatedPayment 
          : p
      ));

      toast.success('Proof deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete proof');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await getApi().updateUser(userId, updates);
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      
      // Update current user if it's their profile
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }

      toast.success('User updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Update failed');
    }
  };

  const handleInitDemo = async () => {
    try {
      const result = await getApi().initializeDemoData();
      toast.success(`Initialized: Admin + ${result.members.created} members!`);
    } catch (error: any) {
      console.error('Init demo error:', error);
      throw error; // Re-throw so auth screen can handle it
    }
  };

  // Log helpful startup message
  useEffect(() => {
    console.log('%c🎯 Investment Club App', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    
    if (isDemoMode) {
      console.log('%c🎭 DEMO MODE ACTIVE', 'font-size: 16px; font-weight: bold; color: #f59e0b; background: #fef3c7; padding: 4px 8px; border-radius: 4px;');
      console.log('');
      console.log('%cData Storage:', 'font-weight: bold;', 'Browser localStorage (no internet needed)');
      console.log('%cFeatures:', 'font-weight: bold;', 'All features work, data persists in your browser');
      console.log('%cTo switch to Production:', 'font-weight: bold;', 'Deploy backend with: supabase functions deploy make-server-f4ff8ddc');
    } else {
      console.log('%c✅ PRODUCTION MODE', 'font-size: 16px; font-weight: bold; color: #10b981; background: #d1fae5; padding: 4px 8px; border-radius: 4px;');
      console.log('');
      console.log('%cBackend API:', 'font-weight: bold;', 'https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc');
      console.log('%cHealth Check:', 'font-weight: bold;', 'https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health');
    }
    
    console.log('');
    console.log('%c💡 Tips:', 'font-weight: bold;');
    console.log('• Click "Initialize Demo Data" to create admin + 91 members');
    console.log('• Demo mode works offline - perfect for testing!');
    console.log('• Data in demo mode persists across page refreshes');
    console.log('• See TROUBLESHOOTING.md for deployment help');
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <AuthScreen 
          onLogin={handleLogin} 
          onRegister={handleRegister}
          onInitDemo={handleInitDemo}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium z-50 shadow-lg">
          🎭 DEMO MODE - Data stored locally in browser (No Supabase needed!)
        </div>
      )}
      
      {currentUser.isAdmin ? (
        <AdminDashboard
          admin={currentUser}
          users={users}
          payments={payments}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
          onUploadPayment={handleUploadPayment}
          onDeleteProof={handleDeleteProof}
        />
      ) : (
        <UserDashboard
          user={currentUser}
          payments={payments}
          onLogout={handleLogout}
          onUploadPayment={handleUploadPayment}
          users={users}
        />
      )}
      <Toaster />
    </>
  );
}

export default App;
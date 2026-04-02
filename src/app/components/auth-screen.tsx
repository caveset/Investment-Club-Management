import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, Database, CheckCircle } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, password: string, isAdmin: boolean) => void;
  onRegister: (name: string, email: string, password: string, phone: string) => void;
  onInitDemo?: () => Promise<void>;
}

export function AuthScreen({ onLogin, onRegister, onInitDemo }: AuthScreenProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [isInitializing, setIsInitializing] = useState(false);
  const [initSuccess, setInitSuccess] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword, isAdmin);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(regName, regEmail, regPassword, regPhone);
  };

  const handleInitDemo = async () => {
    if (!onInitDemo) return;
    
    setIsInitializing(true);
    setInitError(null);
    
    try {
      await onInitDemo();
      setInitSuccess(true);
      setLoginEmail('admin@club.com');
      setLoginPassword('InvestClub2026!');
      setIsAdmin(true);
    } catch (error: any) {
      console.error('Init demo failed:', error);
      const errorMsg = error.message || 'Failed to initialize demo data';
      setInitError(errorMsg);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Demo Data Initialization Card */}
        {onInitDemo && !initSuccess && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">First Time Setup</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Initialize the database with admin account + 91 investment club members
                  </p>
                  <Button 
                    onClick={handleInitDemo} 
                    disabled={isInitializing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    {isInitializing ? 'Initializing...' : 'Initialize Demo Data'}
                  </Button>
                  {initError && (
                    <div className="text-sm text-red-700 mt-3 bg-red-50 p-3 rounded border border-red-200">
                      <p className="font-semibold mb-1">❌ Initialization Failed</p>
                      <p className="whitespace-pre-line">{initError}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {initSuccess && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Setup Complete!</h3>
                  <p className="text-sm text-green-800 mb-2">
                    Created admin + 91 members. Login credentials have been filled in below.
                  </p>
                  <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                    <strong>Admin:</strong> admin@club.com / InvestClub2026!<br />
                    <strong>Members:</strong> All use password "Member2026!"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Auth Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Investment Club</CardTitle>
            <CardDescription>Manage your monthly contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="admin-login"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="admin-login" className="cursor-pointer">Login as Admin</Label>
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                  {initSuccess && (
                    <p className="text-sm text-green-600 text-center mt-2">
                      ✅ Use the credentials above to log in
                    </p>
                  )}
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input
                      id="reg-name"
                      placeholder="John Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Register</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
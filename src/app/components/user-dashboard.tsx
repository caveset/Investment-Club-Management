import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LogOut, Upload, CheckCircle, XCircle, User as UserIcon, Phone, Mail } from 'lucide-react';
import { User, PaymentRecord } from '../types';
import { PaymentGrid } from './payment-grid';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface UserDashboardProps {
  user: User;
  payments: PaymentRecord[];
  onLogout: () => void;
  onUploadPayment: (userId: string, month: number, year: number, file: File) => void;
  users: User[];
}

export function UserDashboard({ user, payments, onLogout, onUploadPayment, users }: UserDashboardProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear] = useState<number>(new Date().getFullYear());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const userPayments = payments.filter(p => p.userId === user.id && p.proofs?.length > 0);
  const completionRate = Math.round((userPayments.length / 12) * 100);
  const unpaidMonths = 12 - userPayments.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    onUploadPayment(user.id, selectedMonth, selectedYear, selectedFile);
    setSelectedFile(null);
    setUploadDialogOpen(false);
    toast.success('Payment proof uploaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments Made</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPayments.length}/12</div>
              <p className="text-xs text-muted-foreground">Monthly contributions</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unpaidMonths}</div>
              <p className="text-xs text-muted-foreground">Months remaining</p>
              {unpaidMonths > 0 && (
                <Badge variant="destructive" className="mt-2">
                  Action Required
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Payment Proof</CardTitle>
            <CardDescription>Upload your monthly bank statement PDF as proof of payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Payment Proof</DialogTitle>
                  <DialogDescription>
                    Select the month and upload your bank statement PDF
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={selectedMonth.toString()} onValueChange={(val) => setSelectedMonth(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {month} {selectedYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>PDF File</Label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>Upload</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Payment Grid */}
        <Card>
          <CardHeader>
            <CardTitle>My Payment History</CardTitle>
            <CardDescription>Track your monthly contributions throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentGrid users={users} payments={payments} isAdmin={false} currentUserId={user.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
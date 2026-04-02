import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LogOut, Download, Users, DollarSign, TrendingUp, FileText, Edit } from 'lucide-react';
import { User, PaymentRecord } from '../types';
import { PaymentGrid } from './payment-grid';
import { exportMonthlyReport } from '../utils/pdf-export';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ReminderDialog } from './reminder-dialog';
import { MemberDetailDialog } from './member-detail-dialog';

interface AdminDashboardProps {
  admin: User;
  users: User[];
  payments: PaymentRecord[];
  onLogout: () => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onUploadPayment: (userId: string, month: number, year: number, file: File) => void;
  onDeleteProof: (userId: string, month: number, year: number, proofId: string) => void;
}

export function AdminDashboard({ admin, users, payments, onLogout, onUpdateUser, onUploadPayment, onDeleteProof }: AdminDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate statistics
  const totalUsers = users.filter(u => !u.isAdmin).length;
  const totalExpectedPayments = totalUsers * 12;
  const totalPaidPayments = payments.filter(p => p.proofs?.length > 0).length;
  const currentMonthPayments = payments.filter(p => 
    p.month === selectedMonth && p.year === selectedYear && p.proofs?.length > 0
  ).length;
  const paymentRate = totalExpectedPayments > 0 
    ? Math.round((totalPaidPayments / totalExpectedPayments) * 100) 
    : 0;

  const handleExportReport = () => {
    exportMonthlyReport(users, payments, selectedMonth, selectedYear);
  };

  const handleViewMember = (user: User) => {
    setSelectedMember(user);
    setMemberDialogOpen(true);
  };

  const handleCloseMemberDialog = () => {
    setMemberDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {admin.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active club members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPaidPayments}</div>
              <p className="text-xs text-muted-foreground">Out of {totalExpectedPayments} expected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentRate}%</div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthPayments}</div>
              <p className="text-xs text-muted-foreground">{months[selectedMonth]} payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Export Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
            <CardDescription>Export detailed payment reports for any month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
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
              <ReminderDialog users={users} payments={payments} />
              <Button onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Tracking Grid</CardTitle>
            <CardDescription>12-month contribution overview for all members</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentGrid users={users} payments={payments} isAdmin={true} currentUserId={admin.id} />
          </CardContent>
        </Card>

        {/* Member List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Club Members</CardTitle>
            <CardDescription>All registered members and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.filter(u => !u.isAdmin).map((user) => {
                const userPayments = payments.filter(p => p.userId === user.id && p.proofs?.length > 0);
                const completionRate = Math.round((userPayments.length / 12) * 100);
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{userPayments.length}/12 Months Paid</p>
                        <p className="text-sm text-gray-600">{completionRate}% Complete</p>
                      </div>
                      <Badge variant={completionRate >= 100 ? "default" : completionRate >= 50 ? "secondary" : "destructive"}>
                        {completionRate >= 100 ? "Complete" : completionRate >= 50 ? "In Progress" : "Behind"}
                      </Badge>
                      <Button variant="outline" onClick={() => handleViewMember(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Member Detail Dialog */}
      {memberDialogOpen && selectedMember && (
        <MemberDetailDialog
          member={selectedMember}
          open={memberDialogOpen}
          onClose={handleCloseMemberDialog}
          onSave={onUpdateUser}
          onUploadPayment={onUploadPayment}
          onDeleteProof={onDeleteProof}
          payments={payments}
        />
      )}
    </div>
  );
}
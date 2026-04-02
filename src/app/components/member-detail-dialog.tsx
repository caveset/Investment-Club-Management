import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, PaymentRecord } from '../types';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Save, User as UserIcon, Mail, Phone, Calendar, Upload, Eye, Trash2 } from 'lucide-react';

interface MemberDetailDialogProps {
  member: User | null;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => void;
  onUploadPayment: (userId: string, month: number, year: number, file: File) => void;
  onDeleteProof: (userId: string, month: number, year: number, proofId: string) => void;
  payments: PaymentRecord[];
}

export function MemberDetailDialog({ member, open, onClose, onSave, onUploadPayment, onDeleteProof, payments }: MemberDetailDialogProps) {
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();

  // Reset form when member changes
  useState(() => {
    if (member) {
      setEditedName(member.name);
      setEditedEmail(member.email);
      setEditedPhone(member.phone);
    }
  });

  if (!member) return null;

  const memberPayments = payments.filter(p => p.userId === member.id);
  const paidPayments = memberPayments.filter(p => p.proofs?.length > 0);
  const completionRate = Math.round((paidPayments.length / 12) * 100);

  const handleSave = () => {
    if (!editedName.trim() || !editedEmail.trim() || !editedPhone.trim()) {
      toast.error('All fields are required');
      return;
    }

    onSave(member.id, {
      name: editedName,
      email: editedEmail,
      phone: editedPhone
    });

    setIsEditing(false);
    toast.success('Member profile updated successfully');
  };

  const handleCancel = () => {
    setEditedName(member.name);
    setEditedEmail(member.email);
    setEditedPhone(member.phone);
    setIsEditing(false);
  };

  const handleFileUpload = (month: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    onUploadPayment(member.id, month, currentYear, file);
    toast.success(`Payment proof uploaded for ${months[month]}`);
  };

  const handleViewProof = (pdfUrl: string) => {
    // In a real app, this would open the PDF in a new tab
    window.open(pdfUrl, '_blank');
    toast.info('Opening payment proof...');
  };

  const handleDeleteProof = (month: number, proofId: string) => {
    onDeleteProof(member.id, month, currentYear, proofId);
    toast.success(`Payment proof deleted for ${months[month]}`);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditing(false);
      setEditedName(member.name);
      setEditedEmail(member.email);
      setEditedPhone(member.phone);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
          <DialogDescription>
            View and manage member information and payment history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <Badge variant={completionRate >= 100 ? "default" : completionRate >= 50 ? "secondary" : "destructive"}>
                    {paidPayments.length}/12 Payments Complete ({completionRate}%)
                  </Badge>
                </div>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={isEditing ? editedName : member.name}
                  onChange={(e) => setEditedName(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedEmail : member.email}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={isEditing ? editedPhone : member.phone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </Label>
                <Input
                  value={new Date(member.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {/* Payment Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{paidPayments.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{12 - paidPayments.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Payment List */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
                <CardDescription>Payment status for each month of {currentYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {months.map((month, idx) => {
                    const payment = memberPayments.find(p => p.month === idx && p.year === currentYear);
                    const proofs = payment?.proofs || [];
                    const hasPaid = proofs.length > 0;
                    const canUploadMore = proofs.length < 2;

                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${hasPaid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {hasPaid ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{month}</p>
                            {proofs.length > 0 && (
                              <p className="text-xs text-gray-600">
                                {proofs.length} proof{proofs.length > 1 ? 's' : ''} uploaded
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {/* Display existing proofs */}
                          {proofs.length > 0 && (
                            <div className="flex gap-1 flex-wrap justify-end">
                              {proofs.map((proof, proofIdx) => (
                                <div key={proof.id} className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewProof(proof.url)}
                                    className="h-8"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View {proofIdx + 1}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteProof(idx, proof.id)}
                                    className="h-8"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Upload button - only show if less than 2 proofs */}
                          {canUploadMore && (
                            <div className="flex justify-end">
                              <Label htmlFor={`upload-${idx}`} className="cursor-pointer">
                                <Button
                                  size="sm"
                                  variant={hasPaid ? "secondary" : "default"}
                                  asChild
                                  className="h-8"
                                >
                                  <span>
                                    <Upload className="w-3 h-3 mr-1" />
                                    {hasPaid ? 'Add Another' : 'Upload'}
                                  </span>
                                </Button>
                              </Label>
                              <Input
                                id={`upload-${idx}`}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(idx, e)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
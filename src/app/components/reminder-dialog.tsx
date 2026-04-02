import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, PaymentRecord } from '../types';
import { Bell, Send } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface ReminderDialogProps {
  users: User[];
  payments: PaymentRecord[];
}

export function ReminderDialog({ users, payments }: ReminderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState<'all' | 'specific'>('all');
  const [message, setMessage] = useState('');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get members with outstanding payments
  const membersWithOutstanding = users.filter(u => {
    if (u.isAdmin) return false;
    const userPayments = payments.filter(p => p.userId === u.id && p.proofs?.length > 0);
    return userPayments.length < 12;
  }).map(user => {
    const userPayments = payments.filter(p => p.userId === user.id && p.proofs?.length > 0);
    const unpaidMonths = 12 - userPayments.length;
    const unpaidMonthsList = [];
    
    for (let month = 0; month < 12; month++) {
      const payment = payments.find(p => 
        p.userId === user.id && p.month === month && p.year === currentYear
      );
      if (!payment || !payment.proofs || payment.proofs.length === 0) {
        unpaidMonthsList.push(month);
      }
    }

    return {
      ...user,
      unpaidCount: unpaidMonths,
      unpaidMonths: unpaidMonthsList
    };
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === membersWithOutstanding.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(membersWithOutstanding.map(u => u.id));
    }
  };

  const handleSendReminders = () => {
    const recipients = reminderType === 'all' 
      ? membersWithOutstanding 
      : membersWithOutstanding.filter(u => selectedUsers.includes(u.id));

    if (recipients.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    // In a real app, this would send emails/SMS via backend API
    // For now, we'll simulate it with a toast notification
    
    recipients.forEach(user => {
      const monthsList = user.unpaidMonths.map(m => months[m]).join(', ');
      const reminderMessage = message || 
        `Hi ${user.name}, this is a friendly reminder about your outstanding payment(s) for: ${monthsList}. Please upload your payment proof at your earliest convenience. Thank you!`;
      
      console.log(`Sending reminder to ${user.email}:`, reminderMessage);
    });

    toast.success(`Reminders sent to ${recipients.length} member(s)`, {
      description: 'Members will receive notifications via email and SMS'
    });

    setOpen(false);
    setSelectedUsers([]);
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Send Reminders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Payment Reminders</DialogTitle>
          <DialogDescription>
            Send reminders to members with outstanding payments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reminder Type */}
          <div className="space-y-2">
            <Label>Send To</Label>
            <Select value={reminderType} onValueChange={(val: any) => setReminderType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All members with outstanding payments</SelectItem>
                <SelectItem value="specific">Select specific members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Members with Outstanding Payments ({membersWithOutstanding.length})</Label>
              {reminderType === 'specific' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSelectAll}
                  type="button"
                >
                  {selectedUsers.length === membersWithOutstanding.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </div>
            
            <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
              {membersWithOutstanding.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No members with outstanding payments
                </div>
              ) : (
                membersWithOutstanding.map(member => {
                  const monthsList = member.unpaidMonths.slice(0, 3).map(m => months[m]).join(', ');
                  const extraCount = member.unpaidMonths.length - 3;
                  
                  return (
                    <div key={member.id} className="p-3 hover:bg-gray-50 flex items-center gap-3">
                      {reminderType === 'specific' && (
                        <Checkbox
                          checked={selectedUsers.includes(member.id)}
                          onCheckedChange={() => handleToggleUser(member.id)}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                          <Badge variant="destructive">
                            {member.unpaidCount} unpaid
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Outstanding: {monthsList}{extraCount > 0 ? ` +${extraCount} more` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Leave blank for default reminder message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Default: "Hi [Name], this is a friendly reminder about your outstanding payment(s) for: [Months]. Please upload your payment proof at your earliest convenience."
            </p>
          </div>

          {/* Preview */}
          {(reminderType === 'all' || selectedUsers.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900">
                Preview: Will send to {reminderType === 'all' ? membersWithOutstanding.length : selectedUsers.length} member(s)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Reminders will be sent via email and SMS (if configured)
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} type="button">
            Cancel
          </Button>
          <Button onClick={handleSendReminders} type="button">
            <Send className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
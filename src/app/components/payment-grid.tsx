import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { User, PaymentRecord } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PaymentGridProps {
  users: User[];
  payments: PaymentRecord[];
  isAdmin: boolean;
  currentUserId: string;
}

export function PaymentGrid({ users, payments, isAdmin, currentUserId }: PaymentGridProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  const displayUsers = isAdmin ? users.filter(u => !u.isAdmin) : users.filter(u => u.id === currentUserId);

  const getPaymentForMonth = (userId: string, month: number): PaymentRecord | undefined => {
    return payments.find(p => p.userId === userId && p.month === month && p.year === currentYear);
  };

  const handleViewProof = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-medium">Member</th>
            {months.map((month) => (
              <th key={month} className="border border-gray-300 px-2 py-2 text-center font-medium text-sm">
                {month}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2 text-center font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers.map((user) => {
            const userPaymentsCount = payments.filter(p => p.userId === user.id && p.proofs?.length > 0).length;
            
            return (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">{user.name}</td>
                {months.map((_, monthIdx) => {
                  const payment = getPaymentForMonth(user.id, monthIdx);
                  const hasPaid = payment && payment.proofs?.length > 0;
                  
                  return (
                    <td key={monthIdx} className="border border-gray-300 px-2 py-2 text-center">
                      {hasPaid ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          {payment.proofs && payment.proofs.length > 0 && (
                            <div className="flex gap-1">
                              {payment.proofs.map((proof, idx) => (
                                <Button
                                  key={proof.id}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleViewProof(proof.url)}
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  {idx + 1}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 mx-auto" />
                      )}
                    </td>
                  );
                })}
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Badge variant={userPaymentsCount >= 12 ? "default" : userPaymentsCount >= 6 ? "secondary" : "destructive"}>
                    {userPaymentsCount}/12
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
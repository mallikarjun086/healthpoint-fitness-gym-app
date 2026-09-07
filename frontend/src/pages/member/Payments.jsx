import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Receipt, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import useRazorpay from '../../hooks/useRazorpay';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { loadScript } = useRazorpay();
  const { user } = useAuth();

  const currentUserId = user?.id || 1;

  useEffect(() => {
    fetchPayments();
  }, [currentUserId]);

  const fetchPayments = async () => {
    try {
      const res = await api.get(`/payments/user/${currentUserId}`);
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch payments", err);
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setProcessing(true);
      const isLoaded = await loadScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        setProcessing(false);
        return;
      }

      const orderRes = await api.post('/payments/create-order', {
        userId: currentUserId,
        amount: 2999,
        currency: 'INR',
        paymentFor: 'MEMBERSHIP',
        referenceId: 3
      });

      const { orderId, amount, currency } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: "HealthPoint Fitness",
        description: "Elite Membership Upgrade",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              userId: currentUserId,
              paymentFor: 'MEMBERSHIP',
              referenceId: 3
            });
            toast.success("Payment successful! Membership upgraded.");
            fetchPayments();
          } catch (err) {
            toast.error("Payment verification failed.");
            console.error(err);
          }
        },
        prefill: {
          name: user?.name || "Member User",
          email: user?.email || "user@hp.com",
          contact: user?.phoneNumber || "9876543210"
        },
        theme: {
          color: "#5B6EFF"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error("Payment failed: " + response.error.description);
      });
      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not initiate payment");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-accent">Account Billing</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Billing & Subscriptions</h1>
          <p className="text-xs text-text-secondary mt-0.5">Manage your active membership tier, invoices, and transaction ledger.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Plan Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="panel p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="badge-accent text-[10px]">Active Tier</span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">VIP Elite Annual Plan</h2>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-text-secondary uppercase font-semibold">Renewal Date</div>
                  <div className="text-sm font-semibold text-text-primary font-mono">Oct 12, 2026</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                  <div className="text-[10px] text-text-secondary font-semibold uppercase">Effective Rate</div>
                  <div className="text-lg stat-number text-text-primary mt-0.5">₹2,499 / mo</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                  <div className="text-[10px] text-text-secondary font-semibold uppercase">Membership Status</div>
                  <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                  <div className="text-[10px] text-text-secondary font-semibold uppercase">Payment Method</div>
                  <div className="text-xs font-medium text-text-primary flex items-center gap-1.5 mt-1 font-mono">
                    <CreditCard className="w-3.5 h-3.5 text-primary" /> •••• 4421
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  className="btn-primary"
                  onClick={handleUpgrade}
                  disabled={processing}
                >
                  {processing && <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1.5" />}
                  {processing ? 'Processing...' : 'Upgrade Tier'}
                </button>
                <button className="btn-secondary">Cancel Subscription</button>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" /> Invoice History
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-8"><div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" /></div>
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div 
                      key={p.id}
                      className="panel p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-primary border border-border">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-text-primary">{p.paymentFor?.replace(/_/g, ' ')}</div>
                          <div className="text-[11px] text-text-secondary font-mono">{new Date(p.createdAt).toLocaleDateString()} • Ref: HP-{p.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-sm stat-number text-text-primary">₹{p.amount}</div>
                          <div className="text-[10px] text-emerald-400 font-medium">Settled</div>
                        </div>
                        <button className="p-2 rounded-lg bg-surface-elevated hover:bg-surface text-text-secondary hover:text-text-primary border border-border transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <div className="panel p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h4 className="font-semibold text-xs text-text-primary">Next Billing Cycle</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your annual renewal of <strong className="text-text-primary">₹29,999</strong> is scheduled for <strong className="text-text-primary">Oct 12, 2026</strong>.
              </p>
              <button className="btn-secondary w-full text-xs">
                Update Billing Method
              </button>
            </div>

            <div className="panel p-5 space-y-3">
              <h4 className="font-semibold text-xs text-text-primary">GST Tax Invoices</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Corporate invoices with GST registration are automatically dispatched after each billing settlement.
              </p>
              <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Edit GSTIN Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;

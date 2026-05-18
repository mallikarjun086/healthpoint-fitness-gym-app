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

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/user/1');
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch payments", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-400 mt-1">Manage your membership and view payment history.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Plan Card */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-l-4 border-l-primary"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">Active Plan</span>
                  </div>
                  <h2 className="text-3xl font-black italic uppercase">Annual Elite Membership</h2>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Renews On</div>
                  <div className="text-lg font-bold">Oct 12, 2024</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Monthly Cost</div>
                  <div className="text-xl font-bold">₹249</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Status</div>
                  <div className="text-xl font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Payment Method</div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> **** 4421
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="btn-premium px-8 py-3 text-sm">Upgrade Plan</button>
                <button className="px-8 py-3 text-sm text-gray-400 hover:text-white transition-colors">Cancel Subscription</button>
              </div>
            </motion.div>

            {/* Payment History */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3 px-2">
                <Receipt className="w-5 h-5 text-primary" /> Payment History
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div></div>
              ) : (
                <div className="space-y-3">
                  {payments.map((p, i) => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 flex justify-between items-center group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Receipt className="w-6 h-6 text-gray-500 group-hover:text-primary" />
                        </div>
                        <div>
                          <div className="font-bold">{p.paymentFor.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()} • ID: HP-{p.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="font-black text-lg">₹{p.amount}</div>
                          <div className="text-[10px] text-green-400 font-bold uppercase">Success</div>
                        </div>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-primary hover:text-black transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="glass-card p-6 border-t-4 border-t-orange-500/50">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold">Next Billing Cycle</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Your next payment of **₹2999** will be automatically charged on **Oct 12, 2024**. Make sure your primary payment method has sufficient funds.
              </p>
              <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-sm font-bold">
                Update Payment Method
              </button>
            </div>

            <div className="glass-card p-8 bg-black/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Clock className="w-12 h-12 text-primary/10 -rotate-12" />
              </div>
              <h4 className="text-lg font-bold mb-4">Tax Invoices</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Need a GST invoice for your business? Update your billing details including GSTIN in your profile settings.
              </p>
              <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                Manage Billing Info <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;

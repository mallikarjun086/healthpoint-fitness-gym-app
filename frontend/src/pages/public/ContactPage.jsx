import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Dumbbell, 
  Clock, 
  Globe, 
  Instagram, 
  Twitter, 
  Linkedin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Navbar from '../../components/layout/Navbar';
import TiltCard from '../../components/ui/TiltCard';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', subject: 'General Inquiry' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    toast.success("Message received! Our team will respond within 2 business hours.");
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Support Email",
      value: "support@healthpoint.com",
      sub: "Average response: < 2 hours"
    },
    {
      icon: Phone,
      label: "Member Concierge",
      value: "+91 80 4912 3456",
      sub: "Mon-Sat, 6:00 AM - 10:00 PM IST"
    },
    {
      icon: MapPin,
      label: "Flagship Facility",
      value: "100ft Road, Indiranagar",
      sub: "Bengaluru, KA 560038"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary pt-28 pb-20 px-6 relative overflow-hidden">
      <Navbar />

      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto text-center mb-16 space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          <span className="caption">Get in Touch</span>
        </div>
        <h1 className="heading-xl sm:text-5xl text-text-primary">
          Let's Start Your Evolution
        </h1>
        <p className="body-md max-w-xl mx-auto">
          Have questions regarding gym access, custom athletic programming, or enterprise corporate club memberships?
        </p>
      </header>

      <section className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Contact Details Column */}
        <div className="space-y-4">
          {contactInfo.map((item) => (
            <div key={item.label} className="panel-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-sm">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="caption">{item.label}</div>
                <div className="text-base font-bold text-text-primary font-display mt-0.5">{item.value}</div>
                <div className="body-sm text-text-muted mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Message Form */}
        <div className="lg:col-span-2">
          <div className="panel-elevated p-8 sm:p-10 space-y-6">
            <h3 className="text-xl font-bold text-text-primary font-display">Send a Direct Message</h3>

            {isSent ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-text-primary font-display">Message Sent Successfully</h4>
                <p className="body-sm text-text-secondary max-w-sm mx-auto">Thank you for reaching out. A HealthPoint performance specialist will get in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="caption ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Alex Rivers" 
                      className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-4 text-xs text-text-primary outline-none focus:border-primary/60" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="caption ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="alex@healthpoint.com" 
                      className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-4 text-xs text-text-primary outline-none focus:border-primary/60" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="caption ml-1">Message</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we assist your training or facility inquiries?" 
                    className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-4 text-xs text-text-primary outline-none focus:border-primary/60"
                  />
                </div>

                <button type="submit" className="btn-primary py-3 px-8 shadow-accent">
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

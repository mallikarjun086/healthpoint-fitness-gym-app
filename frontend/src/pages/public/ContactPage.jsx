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
  Linkedin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "support@healthpoint.com",
      sub: "Average response: 2 hours"
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+91 800-FIT-HELP",
      sub: "Mon-Fri, 9am - 6pm IST"
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "Elite Performance Center, Bangalore",
      sub: "Karnataka, India"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-premium rounded-xl group-hover:rotate-12 transition-transform">
              <Dumbbell className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-black italic tracking-tighter">HEALTHPOINT</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">About</Link>
            <Link to="/features" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Features</Link>
            <Link to="/pricing" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Pricing</Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
              Let's Start Your <br /><span className="text-primary">Evolution.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Have questions about our training protocols or membership plans? Our elite support team is ready to assist you.
            </p>
          </motion.div>
        </div>
      </header>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-8">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{item.label}</h4>
                <div className="text-xl font-bold mb-1">{item.value}</div>
                <div className="text-sm text-gray-500">{item.sub}</div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="glass-card p-8 flex justify-around">
              {[Instagram, Twitter, Linkedin, Globe].map((Icon, i) => (
                <button key={i} className="p-3 rounded-xl bg-white/5 hover:bg-primary hover:text-black transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <MessageSquare className="w-40 h-40" />
              </div>
              
              <h3 className="text-3xl font-black italic uppercase mb-8">Send a Message</h3>
              
              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Membership Support</option>
                    <option>Technical Issue</option>
                    <option>Trainer Consultation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Your Message</label>
                  <textarea rows="5" placeholder="How can we help you evolve today?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                </div>

                <button className="btn-premium w-full py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group">
                  SEND MESSAGE <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Hours Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-black italic uppercase">Live Support Hours</h4>
              <p className="text-gray-400 text-sm">We are online and ready to help you during these times.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-6 border-r border-white/10">
              <div className="text-primary font-black italic text-xl">24/7</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Self Service</div>
            </div>
            <div className="text-center px-6">
              <div className="text-white font-black italic text-xl">9-6</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Chat</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
        &copy; 2024 HealthPoint Fitness Global Support. Moving Together.
      </footer>
    </div>
  );
};

export default ContactPage;

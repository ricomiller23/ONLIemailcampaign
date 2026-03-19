'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  CheckCircle, 
  Plus, 
  Briefcase, 
  X, 
  Copy, 
  Send, 
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LEGAL_CONTACTS, type Contact, TEMPLATES } from '@/lib/contacts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIdx, setSelectedContactIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | 'pending' | 'approached' | 'sent'>('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('onli_intro');
  const [newContact, setNewContact] = useState({
    fname: '', lname: '', company: '', title: '', email: '', notes: '', status: 'pending' as const
  });

  // Load from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('onli-campaign-contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    } else {
      setContacts(LEGAL_CONTACTS);
    }
  }, []);

  // Save to localStorage when contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('onli-campaign-contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => c.status === 'pending').length,
    approached: contacts.filter(c => c.status === 'approached' || c.status === 'conversation').length,
    sent: contacts.filter(c => c.status === 'sent').length,
  };

  const openDrawer = (contactId: string) => {
    const idx = contacts.findIndex(c => c.id === contactId);
    setSelectedContactIdx(idx);
    setDraft('');
    setIsDrawerOpen(true);
  };

  const handleGenerate = async () => {
    if (selectedContactIdx === null) return;
    setIsGenerating(true);
    const c = contacts[selectedContactIdx];
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: c.fname, company: c.company, title: c.title, notes: c.notes }),
      });
      const data = await res.json();
      setDraft(data.body);
    } catch (e) {
      console.error(e);
      // Fallback
      const template = TEMPLATES[selectedTemplate as keyof typeof TEMPLATES];
      if (template) {
        const body = template.body
          .replace(/{first_name}/g, c.fname || 'there')
          .replace(/{company}/g, c.company || 'your company');
        setDraft(`Subject: ${template.subject.replace(/{company}/g, c.company)}\n\n${body}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContact = () => {
    if (!newContact.fname || !newContact.email) return;
    const c: Contact = {
      ...newContact,
      id: 'c-' + Date.now(),
    };
    setContacts([c, ...contacts]);
    setIsModalOpen(false);
    setNewContact({ fname: '', lname: '', company: '', title: '', email: '', notes: '', status: 'pending' });
  };

  const sendEmail = () => {
    if (selectedContactIdx === null) return;
    const c = contacts[selectedContactIdx];
    
    let subject = 'ONLI — Introduction';
    let body = draft;
    
    const subjectMatch = draft.match(/^Subject:\s*(.*)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      body = draft.replace(/^Subject:\s*.*\n*/i, '').trim();
    }

    const mailtoUrl = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    if (c.status === 'pending') {
      const newContacts = [...contacts];
      newContacts[selectedContactIdx].status = 'approached';
      setContacts(newContacts);
    }
  };

  return (
    <div className="flex h-screen bg-bg-dark text-text-main overflow-hidden font-sans">
      {/* Sidebar */}
      <nav className="w-20 bg-bg-panel border-r border-border flex flex-col items-center py-6 gap-8 shrink-0">
        <div className="text-onli-blue font-black text-xs tracking-[3px] uppercase [writing-mode:vertical-rl] rotate-180 mb-6 drop-shadow-[0_0_8px_rgba(0,180,255,0.5)]">
          ONLI
        </div>
        <div className="w-11 h-11 rounded-xl bg-onli-dark text-onli-blue shadow-[inset_0_0_0_1px_rgba(0,180,255,0.4)] flex items-center justify-center cursor-pointer">
          <Mail size={20} />
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-text-muted hover:text-white cursor-pointer">
          <Users size={20} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-onli-blue bg-clip-text text-transparent">
              Marketing Email Campaign
            </h1>
            <p className="text-text-muted text-sm mt-1">
              ONLI outreach pipeline — manage, draft, and send personalized campaigns.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-bg-panel p-1 border border-border rounded-lg">
              {(['All', 'pending', 'approached', 'sent'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                    filter === f ? "bg-bg-card text-text-main shadow-lg" : "text-text-muted hover:text-text-main"
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-onli-blue/10 border border-onli-blue/30 text-onli-blue rounded-lg text-xs font-semibold hover:bg-onli-blue/20 transition-all hover:shadow-onli-glow"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add Contact
            </button>
          </div>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Contacts" value={stats.total} color="#00b4ff" />
          <MetricCard label="Pending" value={stats.pending} color="#00e5c3" />
          <MetricCard label="Approached" value={stats.approached} color="#e5bf00" />
          <MetricCard label="Sent" value={stats.sent} color="#39ff14" />
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 flex-1 overflow-x-auto pb-4">
          <KanbanColumn 
            title="Pending" 
            count={stats.pending} 
            contacts={contacts.filter(c => c.status === 'pending')}
            onContactClick={openDrawer}
          />
          <KanbanColumn 
            title="Approached" 
            count={contacts.filter(c => c.status === 'approached').length} 
            contacts={contacts.filter(c => c.status === 'approached')}
            onContactClick={openDrawer}
          />
          <KanbanColumn 
            title="In Conversation" 
            count={contacts.filter(c => c.status === 'conversation').length} 
            contacts={contacts.filter(c => c.status === 'conversation')}
            onContactClick={openDrawer}
          />
          <KanbanColumn 
            title="Sent / Onboarded" 
            count={stats.sent} 
            contacts={contacts.filter(c => c.status === 'sent')}
            onContactClick={openDrawer}
          />
        </div>
      </main>

      {/* Detail Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedContactIdx !== null && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-screen w-[420px] bg-bg-panel border-l border-border z-50 p-8 overflow-y-auto"
            >
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-white"
              >
                <X size={22} />
              </button>

              <div className="mb-8">
                <span className="inline-block bg-onli-blue/10 text-onli-blue px-2 py-1 rounded text-[10px] font-bold tracking-wider mb-3 uppercase">
                  {contacts[selectedContactIdx].status.toUpperCase()}
                </span>
                <h2 className="text-2xl font-bold">{contacts[selectedContactIdx].fname} {contacts[selectedContactIdx].lname}</h2>
                <p className="text-text-muted text-sm">{contacts[selectedContactIdx].company}</p>
              </div>

              <section className="bg-bg-card border border-border rounded-lg p-5 mb-4">
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-onli-blue" />
                    <a href={`mailto:${contacts[selectedContactIdx].email}`} className="text-onli-blue hover:underline">
                      {contacts[selectedContactIdx].email || '—'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <Briefcase size={14} />
                    <span>{contacts[selectedContactIdx].title || '—'}</span>
                  </div>
                </div>
              </section>

              <section className="bg-bg-card border border-border rounded-lg p-5 mb-4">
                <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-4">Campaign</h3>
                <select 
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-2.5 text-sm mb-4 outline-none focus:border-onli-blue"
                >
                  <option value="onli_intro">ONLI — Introduction</option>
                  <option value="onli_followup">ONLI — Follow-Up</option>
                </select>
                <div className="flex gap-3">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-onli-blue to-onli-teal text-bg-dark font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <div className="w-4 h-4 border-2 border-bg-dark border-t-transparent animate-spin rounded-full" /> : <Zap size={14} fill="currentColor" />}
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
              </section>

              {draft && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-onli-blue tracking-wider">
                    <span>Campaign Draft</span>
                    <div className="flex gap-2">
                       <button onClick={() => navigator.clipboard.writeText(draft)} className="flex items-center gap-1 border border-onli-blue/50 px-2 py-1 rounded">
                        <Copy size={10} /> COPY
                      </button>
                      <button onClick={sendEmail} className="flex items-center gap-1 bg-onli-blue text-bg-dark px-2 py-1 rounded">
                        <Send size={10} /> SEND
                      </button>
                    </div>
                  </div>
                  <textarea 
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full h-64 bg-black/40 border border-border rounded-lg p-4 text-xs font-mono leading-relaxed outline-none focus:border-onli-blue resize-none"
                  />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-bg-panel border border-onli-blue/30 rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-onli-blue/20 rounded-full flex items-center justify-center text-onli-blue">✉</div>
                Add Outreach Contact
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">First Name</label>
                  <input value={newContact.fname} onChange={e => setNewContact({...newContact, fname: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-onli-blue" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Last Name</label>
                  <input value={newContact.lname} onChange={e => setNewContact({...newContact, lname: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-onli-blue" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Company</label>
                  <input value={newContact.company} onChange={e => setNewContact({...newContact, company: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-onli-blue" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Email</label>
                  <input value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-onli-blue" />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={saveContact} className="flex-1 bg-onli-blue text-bg-dark font-bold py-2.5 rounded-lg text-sm hover:shadow-onli-glow transition-all">
                  Add Contact
                </button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 border border-border rounded-lg text-sm font-semibold py-2.5 hover:bg-white/5 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="relative overflow-hidden bg-bg-panel border border-border rounded-xl p-5 pl-7">
      <div className="absolute left-0 top-0 w-1.5 h-full opacity-70" style={{ backgroundColor: color }} />
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-[10px] text-text-muted uppercase tracking-[1.5px] mt-1 font-semibold">{label}</div>
    </div>
  );
}

function KanbanColumn({ title, count, contacts, onContactClick }: { title: string, count: number, contacts: Contact[], onContactClick: (id: string) => void }) {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col glass-panel overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center shrink-0">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</h3>
        <span className="bg-bg-card px-2 py-0.5 rounded-full text-[10px] font-bold">{count}</span>
      </div>
      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            onClick={() => onContactClick(contact.id)}
            className="group relative glass-card p-4 cursor-pointer"
          >
            <div className="absolute top-4 right-4 text-[9px] font-bold px-1.5 py-0.5 rounded bg-onli-blue/10 text-onli-blue">
              {contact.status.toUpperCase()}
            </div>
            <div className="font-semibold text-sm mb-1 group-hover:text-onli-blue transition-colors">
              {contact.fname} {contact.lname}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
              <span className="truncate">{contact.company}</span>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="h-24 flex items-center justify-center border border-dashed border-border rounded-lg text-xs text-text-muted">
            No contacts
          </div>
        )}
      </div>
    </div>
  );
}

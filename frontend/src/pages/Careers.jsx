import React, { useState } from 'react';
import { Briefcase, Sparkles, MapPin, CheckCircle2, ArrowRight, Heart, ShieldCheck, Laptop, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const perks = [
  { title: 'Flexible Work', desc: 'Remote-first culture with flexible working hours.', icon: Laptop },
  { title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and family.', icon: Heart },
  { title: 'Learning Allowance', desc: 'Annual budget for courses, books & certifications.', icon: Sparkles },
  { title: 'Competitive Pay', desc: 'Top tier salary, ESOPs & performance bonuses.', icon: ShieldCheck },
];

const jobs = [
  {
    id: 1,
    title: 'Senior Fullstack Engineer (React & Node.js)',
    department: 'Engineering',
    location: 'Bengaluru / Remote',
    type: 'Full-Time',
    description: 'Lead the architecture of high-concurrency e-commerce storefronts, microservices, and payment pipelines.',
  },
  {
    id: 2,
    title: 'AI & Machine Learning Systems Specialist',
    department: 'AI Innovation Lab',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Build predictive product recommendation engines, real-time demand forecasting, and NLP shopping assistants.',
  },
  {
    id: 3,
    title: 'Senior Product Designer (UI/UX)',
    department: 'Design',
    location: 'Bengaluru',
    type: 'Full-Time',
    description: 'Create intuitive, accessible, and high-converting mobile & web interfaces for over 1M active shoppers.',
  },
  {
    id: 4,
    title: 'E-Commerce Growth Marketing Manager',
    department: 'Marketing',
    location: 'Bengaluru / Remote',
    type: 'Full-Time',
    description: 'Drive multi-channel acquisition campaigns, customer retention loops, and flash sale marketing strategies.',
  },
];

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [resumeNote, setResumeNote] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const { user } = useAuth();

  const handleOpenApplication = (job) => {
    setSelectedJob(job);
    setApplicantName(user?.name || '');
    setApplicantEmail(user?.email || '');
    setSuccessNotice('');
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setSuccessNotice(`🎉 Thank you ${applicantName}! Your application for ${selectedJob.title} has been submitted.`);
    setTimeout(() => {
      setSelectedJob(null);
      setSuccessNotice('');
    }, 2500);
  };

  return (
    <div className="space-y-16 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 opacity-90 z-0" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>Careers at NexusMart</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Shape the Future of <span className="bg-gradient-to-r from-indigo-400 via-amber-300 to-purple-300 bg-clip-text text-transparent">Digital Commerce</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            We are looking for bold thinkers, talented engineers, and creative problem solvers to build next-generation e-commerce systems.
          </p>
        </div>
      </section>

      {/* 🌟 Why Work With Us (Perks) */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Join NexusMart?</h2>
          <p className="text-xs text-slate-600">Empowering team members to do their best work with competitive benefits.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {perks.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 💼 Open Positions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Current Job Openings</h2>
            <p className="text-xs text-slate-600">Explore open positions across engineering, product, and growth</p>
          </div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-200">
            {jobs.length} Openings
          </span>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {job.department}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{job.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" />{job.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenApplication(job)}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📄 Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Apply for Role</h3>
                <p className="text-xs text-indigo-600 font-bold">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successNotice ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Resume / Cover Note</label>
                  <textarea
                    rows={3}
                    required
                    value={resumeNote}
                    onChange={(e) => setResumeNote(e.target.value)}
                    placeholder="Link to LinkedIn/GitHub or brief background summary..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold w-full py-3 rounded-xl text-xs inline-flex justify-center items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Submit Application</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;

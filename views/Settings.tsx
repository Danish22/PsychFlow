
import React from 'react';
import { Card, SectionHeader, Button, Input } from '../components/UI';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <SectionHeader 
        title="Settings" 
        description="Configure your practice and account preferences."
      />

      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Clinical Profile</h3>
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value="Dr. Sarah Thompson" />
            <Input label="Specialization" value="Clinical Psychologist" />
            <Input label="License Number" value="PSY-123456789" />
            <Input label="Email" value="s.thompson@psycheflow.com" />
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary">Save Profile Changes</Button>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Practice Preferences</h3>
        <Card className="divide-y divide-slate-100">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Multi-Therapist Clinic Mode</p>
              <p className="text-sm text-slate-500">Enable features for managing multiple clinicians and shared calendars.</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all"></div>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">AI Documentation Assistance</p>
              <p className="text-sm text-slate-500">Allow AI to help draft clinical notes from session bullet points.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all"></div>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Auto-Invoicing</p>
              <p className="text-sm text-slate-500">Automatically generate invoices after each session is locked.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all"></div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-bold text-rose-600">Danger Zone</h3>
        <Card className="p-6 border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Delete Practice Data</p>
              <p className="text-sm text-slate-500">Permanently remove all clinical records, client data, and billing history.</p>
            </div>
            <Button variant="danger">Request Deletion</Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Settings;

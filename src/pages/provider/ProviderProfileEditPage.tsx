import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, ShieldCheck, Save, Award } from 'lucide-react';
import { providerService } from '../../services/api';
import { Provider } from '../../types';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ProviderProfileEditPage: React.FC = () => {
  const { showToast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProv = async () => {
      const p = await providerService.getProviderById('prov-1');
      setProvider(p);
      setName(p.name);
      setPhone(p.phone);
      setBio(p.bio);
      setExperienceYears(p.experienceYears);
    };
    loadProv();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;
    setIsSaving(true);
    try {
      const updated = await providerService.updateProviderDetails(provider.id, {
        name,
        phone,
        bio,
        experienceYears: Number(experienceYears),
      });
      setProvider(updated);
      showToast('Provider profile successfully updated.', 'success', 'Profile Saved');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Provider Public Profile
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Information shown to prospective customers discovering your local trade services.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-card space-y-6">
        {/* Verification status header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <img
              src={provider?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-200"
            />
            <div>
              <h3 className="font-bold text-base text-neutral-900">{name}</h3>
              <p className="text-xs text-neutral-500">{provider?.primaryCategory} Specialist</p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Provider
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Business / Professional Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Contact Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Years of Practical Experience
              </label>
              <input
                type="number"
                min={1}
                max={40}
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Professional Biography & Trade Expertise
            </label>
            <textarea
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Highlight your trade certifications, brand proficiencies, tooling, and safety practices..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-neutral-300 focus:border-primary-500 outline-none leading-relaxed"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

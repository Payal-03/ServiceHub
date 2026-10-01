import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { availabilityService, providerService } from '../../services/api';
import { ServiceArea, Provider } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const ProviderServiceAreasPage: React.FC = () => {
  const { showToast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Area Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [city, setCity] = useState('Mathura');
  const [areaName, setAreaName] = useState('');
  const [pincode, setPincode] = useState('');

  const loadAreas = async () => {
    try {
      setIsLoading(true);
      const prov = await providerService.getProviderById('prov-1');
      setProvider(prov);
      setAreas(prov.serviceAreas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaName.trim() || !pincode.trim()) {
      showToast('Please specify both area name and pincode', 'warning');
      return;
    }
    const newArea: ServiceArea = {
      id: `sa-${Date.now()}`,
      city,
      area: areaName.trim(),
      pincode: pincode.trim(),
    };
    const updatedList = [...areas, newArea];
    try {
      await availabilityService.updateServiceAreas('prov-1', updatedList);
      setAreas(updatedList);
      setAddModalOpen(false);
      setAreaName('');
      setPincode('');
      showToast('New service territory added.', 'success', 'Area Added');
    } catch (err: any) {
      showToast(err.message || 'Failed to add area', 'error');
    }
  };

  const handleRemoveArea = async (areaId: string) => {
    if (areas.length <= 1) {
      showToast('You must maintain at least one active service territory.', 'warning');
      return;
    }
    const updatedList = areas.filter((a) => a.id !== areaId);
    try {
      await availabilityService.updateServiceAreas('prov-1', updatedList);
      setAreas(updatedList);
      showToast('Service area removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove area', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Service Coverage & Pincodes
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Customer matching uses your registered city, neighborhood locality, and 6-digit postal pincodes.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service Area
        </Button>
      </div>

      {/* Coverage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {areas.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-card flex flex-col justify-between group hover:border-primary-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleRemoveArea(a.id)}
                  className="text-neutral-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove Territory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-base text-neutral-900">{a.area}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{a.city}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 uppercase font-medium">Postal Pincode</span>
              <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md">
                {a.pincode}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Area Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Operating Service Area"
        subtitle="Customers in this postal area will be matched with you"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddArea}>
              Add Area
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddArea} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
            >
              <option value="Mathura">Mathura</option>
              <option value="Vrindavan">Vrindavan</option>
              <option value="Agra">Agra</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Locality / Area Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="e.g. Dampier Nagar, Dayal Bagh"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              6-digit Pincode <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 281001"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none font-mono"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

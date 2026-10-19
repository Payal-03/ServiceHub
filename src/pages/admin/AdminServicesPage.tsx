import React, { useState, useEffect } from 'react';
import { Zap, Edit2, Info } from 'lucide-react';
import { serviceCategoryService } from '../../services/api';
import { ServiceCategory } from '../../types';
import { COMMON_SERVICE_PROBLEMS, calculateServiceEstimate } from '../../services/pricingService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminServicesPage: React.FC = () => {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('499');

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await serviceCategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenEdit = (c: ServiceCategory) => {
    setEditingCatId(c.id);
    setDescription(c.description);
    setBasePrice(c.basePrice.toString());
    setModalOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    try {
      await serviceCategoryService.toggleCategoryStatus(id);
      showToast('Electrician service status updated', 'info');
      await loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatId || !description.trim() || Number(basePrice) <= 0) return;

    try {
      await serviceCategoryService.updateCategory(editingCatId, {
        description: description.trim(),
        basePrice: Number(basePrice),
      });
      showToast('Electrical service pricing updated', 'success');
      setModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save changes', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Electrical Service Pricing
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          ServiceHub offers one service: on-demand electricians. Manage the benchmark price that drives every
          customer estimate, and review the estimate range for each problem type.
        </p>
      </div>

      {/* Electrician service card */}
      {isLoading ? (
        <div className="h-28 rounded-3xl bg-neutral-100 animate-pulse" />
      ) : (
        <div className="space-y-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-900">{c.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {c.active ? 'Accepting requests' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 max-w-xl">{c.description}</p>
                  <span className="text-[11px] text-neutral-400 block font-medium">
                    {c.providerCount} electricians registered
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                    Benchmark Visit Price
                  </span>
                  <span className="text-base font-black text-neutral-900">₹{c.basePrice}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(c.id)}
                    className="px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700"
                  >
                    {c.active ? 'Pause Service' : 'Resume Service'}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    title="Edit pricing"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Problem types and estimate ranges */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-card overflow-hidden">
        <div className="p-5 border-b border-neutral-100">
          <h2 className="font-bold text-base text-neutral-900">Electrical problem types &amp; estimate ranges</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Estimates are calculated from the benchmark price and each problem's complexity. Final charges always need
            customer approval.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3 font-semibold">Problem</th>
                <th className="px-5 py-3 font-semibold">Typical Time</th>
                <th className="px-5 py-3 font-semibold">Estimate Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {COMMON_SERVICE_PROBLEMS.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60">
                  <td className="px-5 py-3 font-semibold text-neutral-900">
                    {p.title}
                    {p.popular && (
                      <span className="ml-2 text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{p.typicalTurnaround}</td>
                  <td className="px-5 py-3 font-bold text-neutral-900">
                    {calculateServiceEstimate(p.categorySlug, p.id).formattedRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-start gap-2 text-[11px] text-neutral-500">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>Changing the benchmark price updates the estimate range shown to customers on new requests.</span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Electrician Service"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Benchmark Visit Price (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Service Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';
import { providerService, serviceCategoryService } from '../../services/api';
import { Provider, ProviderOfferedService, ServiceCategory } from '../../types';
import { COMMON_SERVICE_PROBLEMS } from '../../services/pricingService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const ProviderServicesPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceCategoryId, setServiceCategoryId] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [basePrice, setBasePrice] = useState('499');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      const prov = await providerService.getCurrentProvider();
      setProvider(prov);
      const cats = await serviceCategoryService.getCategories();
      setCategories(cats);
      if (cats.length > 0) setServiceCategoryId(cats[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setServiceTitle('');
    setBasePrice('499');
    setDescription('');
    if (categories.length > 0) setServiceCategoryId(categories[0].id);
    setModalOpen(true);
  };

  const handleOpenEdit = (svc: ProviderOfferedService) => {
    setEditingServiceId(svc.id);
    setServiceCategoryId(svc.categoryId);
    setServiceTitle(svc.title);
    setBasePrice(svc.basePrice.toString());
    setDescription(svc.description);
    setModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    const matchedCat = categories.find((c) => c.id === serviceCategoryId);
    const categoryName = matchedCat ? matchedCat.name : provider.primaryCategory;

    let updatedServices: ProviderOfferedService[] = [...provider.services];

    if (editingServiceId) {
      updatedServices = updatedServices.map((s) =>
        s.id === editingServiceId
          ? {
              ...s,
              categoryId: serviceCategoryId,
              categoryName,
              title: serviceTitle,
              basePrice: Number(basePrice),
              description,
            }
          : s
      );
      showToast('Service updated successfully', 'success');
    } else {
      const newSvc: ProviderOfferedService = {
        id: `ps-${Date.now()}`,
        categoryId: serviceCategoryId,
        categoryName,
        title: serviceTitle,
        basePrice: Number(basePrice),
        description,
        active: true,
      };
      updatedServices.push(newSvc);
      showToast('New service package added to your profile', 'success');
    }

    const updated = await providerService.updateProviderDetails(provider.id, {
      services: updatedServices,
    });
    setProvider(updated);
    setModalOpen(false);
  };

  const handleToggleActive = async (serviceId: string) => {
    if (!provider) return;
    const updatedServices = provider.services.map((s) =>
      s.id === serviceId ? { ...s, active: !s.active } : s
    );
    const updated = await providerService.updateProviderDetails(provider.id, {
      services: updatedServices,
    });
    setProvider(updated);
    showToast('Service availability status updated', 'info');
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!provider) return;
    const updatedServices = provider.services.filter((s) => s.id !== serviceId);
    const updated = await providerService.updateProviderDetails(provider.id, {
      services: updatedServices,
    });
    setProvider(updated);
    showToast('Service removed from your profile', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Electrical Services & Base Pricing
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Configure your electrical service packages, visit rates, and standard work descriptions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service Package
        </Button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
        <div className="divide-y divide-neutral-100">
          {provider?.services.map((svc) => (
            <div
              key={svc.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-neutral-900">{svc.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      svc.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {svc.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">{svc.description}</p>
                <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {svc.categoryName}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block uppercase font-medium">Base Price</span>
                  <span className="text-base font-extrabold text-neutral-900">₹{svc.basePrice}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(svc.id)}
                    className="p-2 text-xs rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    title={svc.active ? 'Deactivate' : 'Activate'}
                  >
                    {svc.active ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-2 text-xs rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    className="p-2 text-xs rounded-xl border border-neutral-200 hover:bg-rose-50 text-rose-600"
                    title="Remove Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingServiceId ? 'Edit Service Package' : 'Add New Service Package'}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveService}>
              Save Service
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Trade
            </label>
            <div className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {categories.find((c) => c.id === serviceCategoryId)?.name ?? 'Electrician'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Service Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              list="electrical-service-suggestions"
              placeholder="e.g. Inverter Wiring & Health Check"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
            <datalist id="electrical-service-suggestions">
              {COMMON_SERVICE_PROBLEMS.map((p) => (
                <option key={p.id} value={p.title} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Starting Price (₹ INR) <span className="text-rose-500">*</span>
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
              Package Scope & Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included: inspection, fault tracing, standard labor..."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

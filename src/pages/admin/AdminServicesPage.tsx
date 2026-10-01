import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, CheckCircle2, XCircle, Zap, Wrench, Wind, Laptop, Sparkles } from 'lucide-react';
import { serviceCategoryService } from '../../services/api';
import { ServiceCategory } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminServicesPage: React.FC = () => {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('499');
  const [iconName, setIconName] = useState('Zap');

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

  const handleOpenAdd = () => {
    setEditingCatId(null);
    setName('');
    setSlug('');
    setDescription('');
    setBasePrice('499');
    setIconName('Zap');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: ServiceCategory) => {
    setEditingCatId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setBasePrice(c.basePrice.toString());
    setIconName(c.iconName);
    setModalOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    try {
      await serviceCategoryService.toggleCategoryStatus(id);
      showToast('Category status updated', 'info');
      await loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCatId) {
        // Edit in mock store
        const updated = categories.map((c) =>
          c.id === editingCatId
            ? {
                ...c,
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                basePrice: Number(basePrice),
                iconName,
              }
            : c
        );
        setCategories(updated);
        showToast('Service category updated', 'success');
      } else {
        await serviceCategoryService.addCategory({
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          description,
          basePrice: Number(basePrice),
          iconName,
          active: true,
        });
        showToast('New service category created', 'success');
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Service Category Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage public trade verticals, base benchmark pricing, and discoverability.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Category
        </Button>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
                <Tag className="w-5 h-5" />
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
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 max-w-xl">{c.description}</p>
                <span className="text-[11px] text-neutral-400 block font-medium">
                  {c.providerCount} active technicians registered
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                  Base Price
                </span>
                <span className="text-base font-black text-neutral-900">₹{c.basePrice}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(c.id)}
                  className="px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700"
                >
                  {c.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCatId ? 'Edit Category' : 'Add Service Category'}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveCategory}>
              Save Category
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Carpentry & Furniture Repair"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Starting Benchmark Price (₹ INR) <span className="text-rose-500">*</span>
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
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of services included under this trade vertical..."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

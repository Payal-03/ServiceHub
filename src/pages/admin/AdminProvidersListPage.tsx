import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ShieldCheck, Star, MapPin, Search } from 'lucide-react';
import { providerService } from '../../services/api';
import { Provider } from '../../types';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/common/Skeletons';

export const AdminProvidersListPage: React.FC = () => {
  const navigate = useNavigate();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const data = await providerService.getAllProvidersForAdmin();
        setProviders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.primaryCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Registered Provider Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Full registry of all trade professionals, verification states, and ratings.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provider name, category..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-300 focus:border-primary-500 outline-none bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Provider</th>
                  <th className="py-3.5 px-4">Primary Category</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Completed Jobs</th>
                  <th className="py-3.5 px-4">Starting Rate</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover border border-neutral-200"
                        />
                        <div>
                          <span className="font-bold text-neutral-900 block">{p.name}</span>
                          <span className="text-[11px] text-neutral-400">{p.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        {p.primaryCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.verificationStatus === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-neutral-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 font-medium">{p.jobCount} jobs</td>
                    <td className="py-3.5 px-4 font-black text-neutral-900">₹{p.startingPrice}</td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/customer/providers/${p.id}`)}
                      >
                        Inspect Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

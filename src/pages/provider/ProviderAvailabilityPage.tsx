import React, { useState, useEffect } from 'react';
import { Clock, Check, Save, RotateCcw } from 'lucide-react';
import { availabilityService } from '../../services/api';
import { WeeklyAvailability, DaySchedule } from '../../types';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ProviderAvailabilityPage: React.FC = () => {
  const { showToast } = useToast();

  const [schedule, setSchedule] = useState<WeeklyAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const daysList = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const;

  useEffect(() => {
    const fetchSched = async () => {
      try {
        setIsLoading(true);
        const data = await availabilityService.getAvailability('prov-1');
        setSchedule(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSched();
  }, []);

  const handleToggleDay = (day: keyof WeeklyAvailability) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        available: !schedule[day].available,
      },
    });
  };

  const handleTimeChange = (
    day: keyof WeeklyAvailability,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!schedule) return;
    setIsSaving(true);
    try {
      await availabilityService.updateAvailability('prov-1', schedule);
      showToast('Weekly operating hours updated successfully.', 'success', 'Schedule Saved');
    } catch (err: any) {
      showToast(err.message || 'Failed to update schedule', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !schedule) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Weekly Operating Schedule
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Configure which days of the week and standard hours you accept customer appointments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isSaving}
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Weekly Schedule
        </Button>
      </div>

      {/* Days List */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-card space-y-4">
        <div className="divide-y divide-neutral-100">
          {daysList.map(({ key, label }) => {
            const daySched = schedule[key as keyof WeeklyAvailability];
            return (
              <div
                key={key}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Day label & Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={daySched.available}
                      onChange={() => handleToggleDay(key as keyof WeeklyAvailability)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                  </label>

                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">{label}</h4>
                    <span
                      className={`text-[11px] font-medium ${
                        daySched.available ? 'text-emerald-700' : 'text-neutral-400'
                      }`}
                    >
                      {daySched.available ? 'Accepting bookings' : 'Unavailable / Day Off'}
                    </span>
                  </div>
                </div>

                {/* Hours selection */}
                {daySched.available ? (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Start:</span>
                      <input
                        type="time"
                        value={daySched.startTime}
                        onChange={(e) =>
                          handleTimeChange(key as keyof WeeklyAvailability, 'startTime', e.target.value)
                        }
                        className="p-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 font-semibold outline-none focus:border-primary-500"
                      />
                    </div>
                    <span className="text-neutral-400 font-medium">to</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">End:</span>
                      <input
                        type="time"
                        value={daySched.endTime}
                        onChange={(e) =>
                          handleTimeChange(key as keyof WeeklyAvailability, 'endTime', e.target.value)
                        }
                        className="p-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 font-semibold outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-400 font-medium italic">
                    Closed for appointments
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

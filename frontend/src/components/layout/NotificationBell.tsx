import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Clock, Info, CheckCircle2, ChevronRight, Wrench } from 'lucide-react';
import { Notification } from '../../types';
import { notificationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [list, countRes] = await Promise.all([
        notificationApi.getMyNotifications(),
        notificationApi.getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(countRes.unreadCount);
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for live notification updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try {
        await notificationApi.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.warn('Failed to mark notification as read:', err);
      }
    }

    setIsOpen(false);
    if (notif.requestId) {
      navigate(`/requests/${notif.requestId}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer flex items-start gap-3 text-left ${
                    !notif.isRead ? 'bg-primary-50/30' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !notif.isRead
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs font-bold truncate ${
                          !notif.isRead ? 'text-neutral-900' : 'text-neutral-700'
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.requestId && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 pt-0.5">
                        View Job Details <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-neutral-800">No notifications yet</p>
                <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                  When a customer updates a job you bid on, you will be notified here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

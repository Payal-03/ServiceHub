import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  phone: string;
  email?: string;
  roleTitle?: string;
  contextTitle?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactName,
  phone,
  email,
  roleTitle = 'Provider',
  contextTitle = 'Service Request',
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    showToast(`Copied ${phone} to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMockMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;
    setMsgSent(true);
    showToast(`Message logged for ${contactName}. (Ready for Twilio/SMS webhook)`, 'info');
    setTimeout(() => {
      setMsgSent(false);
      setQuickMsg('');
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact ${roleTitle}: ${contactName}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        <p className="text-xs text-neutral-500">
          Coordinate visit schedule, access instructions, or clarify problem details for{' '}
          <strong className="text-neutral-800">{contextTitle}</strong>.
        </p>

        {/* Primary Phone Action */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Verified Direct Line</span>
              <span className="font-extrabold text-neutral-900 text-sm tracking-wide">{phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPhone}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors"
              title="Copy number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
          </div>
        </div>

        {/* WhatsApp & Email Quick Links */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
              `Hello ${contactName}, I am contacting you regarding our ServiceHub request for ${contextTitle}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-neutral-700 font-semibold"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Open WhatsApp</span>
            <ExternalLink className="w-3 h-3 text-neutral-400 ml-auto" />
          </a>

          {email && (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(`ServiceHub: ${contextTitle}`)}`}
              className="p-3 rounded-xl border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center gap-2 text-neutral-700 font-semibold"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Send Email</span>
              <ExternalLink className="w-3 h-3 text-neutral-400 ml-auto" />
            </a>
          )}
        </div>

        {/* In-app Message Input (Frontend abstraction for future Chat/SMS API) */}
        <form onSubmit={handleSendMockMessage} className="space-y-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-700">Send In-App Note</label>
            <span className="text-[10px] text-neutral-400">Integrated messaging layer</span>
          </div>
          <textarea
            value={quickMsg}
            onChange={(e) => setQuickMsg(e.target.value)}
            rows={2}
            placeholder={`Hi ${contactName}, let me know what time works best for you...`}
            className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="outline" type="button" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" variant="primary" type="submit" disabled={!quickMsg.trim() || msgSent}>
              {msgSent ? 'Sent!' : 'Send Note'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

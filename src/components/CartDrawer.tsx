import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react';
import { ESLIS_SHOWROOMS, WHATSAPP_NUMBER } from '../data/defaultCatalog';
import { formatKes } from '../services/storageService';
import { CartItem } from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onConfirmOrder: (branch: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onConfirmOrder,
}) => {
  const [selectedBranch, setSelectedBranch] = useState(ESLIS_SHOWROOMS[0].name);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!open) return null;

  const subtotal = items.reduce(
    (sum, entry) => sum + entry.item.priceKes * entry.quantity,
    0
  );

  const whatsappSummary = items
    .map(
      (entry) =>
        `• ${entry.quantity}× ${entry.item.title} (${formatKes(
          entry.item.priceKes * entry.quantity
        )})`
    )
    .join('\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Eslis Furniture, I'd like to place an order:\n${whatsappSummary}\n\nTotal: ${formatKes(
      subtotal
    )}\nPreferred Showroom: ${selectedBranch}`
  )}`;

  const handleConfirm = () => {
    if (items.length === 0) return;
    onConfirmOrder(selectedBranch);
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
    }, 3500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#111211]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <div className="w-full max-w-md bg-[#F7F3EB] text-[#141615] h-full flex flex-col shadow-2xl border-l border-[#141615]/10">
        <div className="px-6 py-5 border-b border-[#141615]/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Your Eslis Bag</h2>
            <p className="text-xs text-[#141615]/60">
              Handcrafted delivery or showroom pickup
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="w-9 h-9 rounded-full border border-[#141615]/15 flex items-center justify-center hover:bg-[#141615]/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {orderConfirmed && (
            <div className="rounded-2xl bg-[#1B3B2B] text-[#F7F3EB] p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#B84A27] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm mb-0.5">Order Logged with Studio</p>
                <p className="text-[#F7F3EB]/80">
                  Your selection has been recorded for {selectedBranch}. You can also message us directly on WhatsApp to schedule delivery.
                </p>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-[#141615] mb-1">
                Your bag is currently empty.
              </p>
              <p className="text-xs text-[#141615]/60">
                Select a piece from the collection stage to add it here.
              </p>
            </div>
          ) : (
            items.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-2xl bg-[#EFEAE0] border border-[#141615]/10"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#E5DDD0] shrink-0">
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#141615] truncate">
                      {item.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.title}`}
                      className="text-[#141615]/45 hover:text-[#9E3B1C] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#141615]/60 mb-3 tabular-nums">
                    {formatKes(item.priceKes)} each
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F7F3EB] border border-[#141615]/15 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#141615]/10 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold tabular-nums w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label="Increase quantity"
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#141615]/10 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-[#141615] tabular-nums">
                      {formatKes(item.priceKes * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#141615]/10 bg-[#EFEAE0]/70 space-y-4">
            <div>
              <label
                htmlFor="bag-branch-select"
                className="block text-xs font-semibold text-[#141615]/75 mb-1.5"
              >
                Preferred Showroom / Dispatch Hub
              </label>
              <select
                id="bag-branch-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2.5 text-xs font-medium text-[#141615] focus:outline-none focus:border-[#9E3B1C]"
              >
                {ESLIS_SHOWROOMS.map((branch) => (
                  <option key={branch.id} value={branch.name}>
                    {branch.name} — {branch.landmark}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-[#141615]/75">Subtotal</span>
              <span className="text-xl font-extrabold text-[#141615] tabular-nums">
                {formatKes(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-3 rounded-full bg-[#141615] text-[#F7F3EB] text-xs font-semibold hover:bg-[#1B3B2B] transition-colors cursor-pointer"
              >
                Record Order
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-xs font-semibold hover:bg-[#B84A27] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

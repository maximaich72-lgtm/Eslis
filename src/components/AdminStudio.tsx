import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Lock,
  Plus,
  RotateCcw,
  Trash2,
  Unlock,
} from 'lucide-react';
import { ESLIS_SHOWROOMS } from '../data/defaultCatalog';
import { formatKes } from '../services/storageService';
import {
  FurnitureCategory,
  FurnitureItem,
  SaleRecord,
  SiteMediaConfig,
} from '../types/furniture';
import { ResilientImage } from './ResilientImage';

interface AdminStudioProps {
  items: FurnitureItem[];
  media: SiteMediaConfig;
  sales: SaleRecord[];
  onSaveItem: (item: FurnitureItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onSaveMedia: (media: SiteMediaConfig) => Promise<void>;
  onRecordSale: (sale: Omit<SaleRecord, 'id' | 'createdAt'>) => Promise<void>;
  onResetAll: () => Promise<void>;
  onExitAdmin: () => void;
}

const DEFAULT_PASSCODE =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || '2026';

const CATEGORIES: FurnitureCategory[] = [
  'Sofas',
  'Chairs',
  'Bedroom',
  'Storage',
  'Dining',
];

function readFileAsDataUrl(file: File, onLoaded: (url: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      onLoaded(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  items,
  media,
  sales,
  onSaveItem,
  onDeleteItem,
  onSaveMedia,
  onRecordSale,
  onResetAll,
  onExitAdmin,
}) => {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('eslis_admin_unlocked') === '1';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'media' | 'sales'>('catalog');
  const [statusNotice, setStatusNotice] = useState('');

  // Catalog form state
  const [editingItem, setEditingItem] = useState<FurnitureItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // New item draft
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FurnitureCategory>('Sofas');
  const [newPriceKes, setNewPriceKes] = useState('35000');
  const [newQty, setNewQty] = useState('4');
  const [newDimensions, setNewDimensions] = useState('210 × 90 × 78 cm');
  const [newMaterial, setNewMaterial] = useState('Kiln-dried hardwood · Textured bouclé');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Media draft state
  const [mediaDraft, setMediaDraft] = useState<SiteMediaConfig>(media);

  // Manual sale draft state
  const [saleItemTitle, setSaleItemTitle] = useState(items[0]?.title || '');
  const [saleQty, setSaleQty] = useState('1');
  const [saleBranch, setSaleBranch] = useState(ESLIS_SHOWROOMS[0].name);
  const [saleChannel, setSaleChannel] = useState<'Showroom' | 'WhatsApp'>('Showroom');

  const notify = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(''), 3000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === DEFAULT_PASSCODE) {
      sessionStorage.setItem('eslis_admin_unlocked', '1');
      setUnlocked(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Default studio passcode is 2026.');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('eslis_admin_unlocked');
    setUnlocked(false);
    setPasscodeInput('');
  };

  // Real-time financial metrics
  const totalInventoryValue = items.reduce(
    (sum, item) => sum + item.priceKes * Math.max(1, item.quantityOnHand || 1),
    0
  );
  const totalSalesRevenue = sales.reduce((sum, sale) => sum + sale.totalKes, 0);
  const inStockCount = items.filter((item) => item.inStock).length;

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const price = Math.max(0, Number(newPriceKes) || 0);
    const qty = Math.max(0, Number(newQty) || 0);
    const slotNumber = String(items.length + 1).padStart(2, '0');
    const created: FurnitureItem = {
      id: `eslis-${Date.now()}`,
      slotNumber,
      title: newTitle.trim(),
      category: newCategory,
      priceKes: price,
      dimensions: newDimensions.trim() || 'Custom sizing',
      material: newMaterial.trim() || 'Kiln-dried East African hardwood',
      description:
        newDescription.trim() ||
        'Handcrafted to order in the Eslis Ruiru workshop.',
      imageUrl:
        newImageUrl.trim() ||
        '/src/assets/images/ruiru_sectional_sofa_1795535951225.jpg',
      inStock: qty > 0,
      featured: true,
      quantityOnHand: qty,
      updatedAt: new Date().toISOString(),
    };
    await onSaveItem(created);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setShowNewForm(false);
    notify(`Added "${created.title}" to catalog.`);
  };

  const handleUpdateEditingItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await onSaveItem(editingItem);
    notify(`Saved changes to "${editingItem.title}".`);
    setEditingItem(null);
  };

  const handleSaveSiteMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveMedia(mediaDraft);
    notify('Updated homepage hero and room lookbook imagery.');
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const matched = items.find((i) => i.title === saleItemTitle) || items[0];
    if (!matched) return;
    const qty = Math.max(1, Number(saleQty) || 1);
    await onRecordSale({
      itemTitle: matched.title,
      quantity: qty,
      totalKes: matched.priceKes * qty,
      branch: saleBranch,
      channel: saleChannel,
    });
    notify(`Recorded ${qty}× ${matched.title} sale.`);
  };

  if (!unlocked) {
    return (
      <main className="min-h-[82vh] bg-[#F7F3EB] text-[#141615] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-[28px] bg-[#EFEAE0] border border-[#141615]/12 p-8 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-[#141615] text-[#F7F3EB] flex items-center justify-center mb-5">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            Eslis Studio Admin
          </h1>
          <p className="text-sm text-[#141615]/70 mb-6">
            Enter the studio passcode to edit furniture pieces, replace photography, and update KES pricing.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-xs font-semibold text-[#141615]/80 mb-1.5"
              >
                Studio Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode (default: 2026)"
                className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#9E3B1C]"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs font-medium text-[#9E3B1C]">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#141615] text-[#F7F3EB] text-sm font-semibold hover:bg-[#1B3B2B] transition-colors cursor-pointer"
            >
              Unlock Studio
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#141615]/10 text-xs text-[#141615]/60 space-y-2">
            <p>
              Default local passcode: <span className="font-mono-tabular font-semibold">2026</span>.
              Set <code className="font-mono-tabular">ADMIN_PASSWORD</code> (or{' '}
              <code className="font-mono-tabular">VITE_ADMIN_PASSWORD</code>) in production.
            </p>
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 font-semibold text-[#141615] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EB] text-[#141615] py-10 sm:py-14">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#141615]/10">
          <div>
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E3B1C] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Eslis Inventory &amp; Media Studio
            </h1>
            <p className="text-sm text-[#141615]/65 mt-1">
              Manage furniture pieces, KES prices, hero visuals, and lookbook photography.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {confirmReset ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#9E3B1C]/10 border border-[#9E3B1C]/30 px-3 py-1.5 text-xs">
                <span>Restore defaults?</span>
                <button
                  type="button"
                  onClick={async () => {
                    await onResetAll();
                    setConfirmReset(false);
                    notify('Catalog and imagery reset to defaults.');
                  }}
                  className="font-bold text-[#9E3B1C] hover:underline cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="text-[#141615]/70 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#141615]/20 text-xs font-semibold hover:bg-[#141615]/5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141615] text-[#F7F3EB] text-xs font-semibold hover:bg-[#1B3B2B] cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Lock Studio</span>
            </button>
          </div>
        </div>

        {/* Real-time Financial & Inventory KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          <div className="rounded-2xl bg-[#EFEAE0] border border-[#141615]/10 p-5">
            <p className="text-xs text-[#141615]/60 mb-1">Total Inventory Value</p>
            <p className="text-2xl font-extrabold text-[#141615] tabular-nums">
              {formatKes(totalInventoryValue)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#1B3B2B] text-[#F7F3EB] p-5">
            <p className="text-xs text-[#F7F3EB]/70 mb-1">Recorded Sales Total</p>
            <p className="text-2xl font-extrabold tabular-nums">
              {formatKes(totalSalesRevenue)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#EFEAE0] border border-[#141615]/10 p-5">
            <p className="text-xs text-[#141615]/60 mb-1">Catalog Pieces</p>
            <p className="text-2xl font-extrabold text-[#141615] tabular-nums">
              {items.length}
            </p>
          </div>
          <div className="rounded-2xl bg-[#EFEAE0] border border-[#141615]/10 p-5">
            <p className="text-xs text-[#141615]/60 mb-1">Ready In Stock</p>
            <p className="text-2xl font-extrabold text-[#141615] tabular-nums">
              {inStockCount} / {items.length}
            </p>
          </div>
        </div>

        {statusNotice && (
          <div className="mb-6 rounded-2xl bg-[#1B3B2B] text-[#F7F3EB] px-4 py-3 text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-[#B84A27]" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#EFEAE0] border border-[#141615]/10">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#141615] text-[#F7F3EB]'
                  : 'text-[#141615]/70 hover:text-[#141615]'
              }`}
            >
              Furniture &amp; Prices
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaDraft(media);
                setActiveTab('media');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#141615] text-[#F7F3EB]'
                  : 'text-[#141615]/70 hover:text-[#141615]'
              }`}
            >
              Hero &amp; Room Pictures
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-[#141615] text-[#F7F3EB]'
                  : 'text-[#141615]/70 hover:text-[#141615]'
              }`}
            >
              Sales Log ({sales.length})
            </button>
          </div>

          {activeTab === 'catalog' && (
            <button
              type="button"
              onClick={() => setShowNewForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-xs font-semibold hover:bg-[#B84A27] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showNewForm ? 'Close New Form' : 'Add Furniture Item'}</span>
            </button>
          )}
        </div>

        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Add New Item Form */}
            {showNewForm && (
              <form
                onSubmit={handleCreateItem}
                className="rounded-[24px] bg-[#EFEAE0] border border-[#141615]/12 p-6 sm:p-8 space-y-5"
              >
                <h2 className="text-lg font-bold">Add New Furniture Piece</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Item Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Karen Solid Oak Dining Table"
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as FurnitureCategory)}
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Price (KES)</label>
                      <input
                        type="number"
                        min={0}
                        value={newPriceKes}
                        onChange={(e) => setNewPriceKes(e.target.value)}
                        className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Stock Qty</label>
                      <input
                        type="number"
                        min={0}
                        value={newQty}
                        onChange={(e) => setNewQty(e.target.value)}
                        className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={newDimensions}
                      onChange={(e) => setNewDimensions(e.target.value)}
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Material Spec</label>
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Picture URL (or upload file)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://... or upload image"
                        className="flex-1 rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141615] text-[#F7F3EB] text-xs font-semibold cursor-pointer shrink-0">
                        <ImagePlus className="w-4 h-4" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) readFileAsDataUrl(file, setNewImageUrl);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Description</label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Short editorial note about joinery and comfort"
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="px-4 py-2.5 rounded-full border border-[#141615]/20 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#1B3B2B] text-[#F7F3EB] text-xs font-semibold cursor-pointer"
                  >
                    Save Piece
                  </button>
                </div>
              </form>
            )}

            {/* Edit Modal / Inline Drawer */}
            {editingItem && (
              <form
                onSubmit={handleUpdateEditingItem}
                className="rounded-[24px] bg-[#141615] text-[#F7F3EB] p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Editing {editingItem.slotNumber} — {editingItem.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="text-xs text-[#F7F3EB]/70 hover:underline cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#F7F3EB]/70 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, title: e.target.value })
                      }
                      className="w-full rounded-xl bg-[#1F2220] border border-white/15 px-3.5 py-2.5 text-sm text-[#F7F3EB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#F7F3EB]/70 mb-1">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingItem.priceKes}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          priceKes: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl bg-[#1F2220] border border-white/15 px-3.5 py-2.5 text-sm text-[#F7F3EB] tabular-nums"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#F7F3EB]/70 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editingItem.quantityOnHand}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            quantityOnHand: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded-xl bg-[#1F2220] border border-white/15 px-3.5 py-2.5 text-sm text-[#F7F3EB] tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#F7F3EB]/70 mb-1">
                        Status
                      </label>
                      <select
                        value={editingItem.inStock ? 'in' : 'order'}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            inStock: e.target.value === 'in',
                          })
                        }
                        className="w-full rounded-xl bg-[#1F2220] border border-white/15 px-3 py-2.5 text-sm text-[#F7F3EB]"
                      >
                        <option value="in">In Stock</option>
                        <option value="order">Made to Order</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#F7F3EB]/70 mb-1">
                      Dimensions &amp; Material
                    </label>
                    <input
                      type="text"
                      value={editingItem.material}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, material: e.target.value })
                      }
                      className="w-full rounded-xl bg-[#1F2220] border border-white/15 px-3.5 py-2.5 text-sm text-[#F7F3EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#F7F3EB]/70 mb-1">
                      Picture URL or Upload Replacement
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.imageUrl}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, imageUrl: e.target.value })
                        }
                        className="flex-1 rounded-xl bg-[#1F2220] border border-white/15 px-3.5 py-2.5 text-sm text-[#F7F3EB]"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#9E3B1C] text-[#F7F3EB] text-xs font-semibold cursor-pointer shrink-0">
                        <ImagePlus className="w-4 h-4" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              readFileAsDataUrl(file, (url) =>
                                setEditingItem((prev) =>
                                  prev ? { ...prev, imageUrl: url } : null
                                )
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#F7F3EB]/70 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#1F2220] border border-white/15 px-3.5 py-2.5 text-sm text-[#F7F3EB]"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2.5 rounded-full border border-white/20 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-xs font-semibold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Catalog List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-5 flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-full sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5DDD0] shrink-0">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#141615]/60 mb-1">
                        <span className="font-mono-tabular font-semibold text-[#9E3B1C]">
                          {item.slotNumber} · {item.category}
                        </span>
                        <span className="tabular-nums">
                          {item.quantityOnHand} units · {item.inStock ? 'In Stock' : 'Custom'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#141615] truncate">
                        {item.title}
                      </h3>
                      <p className="text-base font-extrabold text-[#1B3B2B] tabular-nums mb-1">
                        {formatKes(item.priceKes)}
                      </p>
                      <p className="text-xs text-[#141615]/65 line-clamp-2">
                        {item.material}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#141615]/10">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="px-3.5 py-1.5 rounded-full bg-[#141615] text-[#F7F3EB] text-xs font-semibold hover:bg-[#1B3B2B] cursor-pointer"
                      >
                        Edit Item &amp; Picture
                      </button>

                      <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#141615]/20 text-xs font-semibold hover:bg-[#141615]/5 cursor-pointer">
                        <ImagePlus className="w-3.5 h-3.5" />
                        <span>Quick Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              readFileAsDataUrl(file, async (url) => {
                                await onSaveItem({ ...item, imageUrl: url });
                                notify(`Updated picture for "${item.title}".`);
                              });
                            }
                          }}
                        />
                      </label>

                      {confirmDeleteId === item.id ? (
                        <div className="inline-flex items-center gap-2 text-xs ml-auto">
                          <button
                            type="button"
                            onClick={async () => {
                              await onDeleteItem(item.id);
                              setConfirmDeleteId(null);
                              notify(`Removed "${item.title}".`);
                            }}
                            className="font-bold text-[#9E3B1C] hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[#141615]/65 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          aria-label={`Delete ${item.title}`}
                          className="ml-auto p-1.5 text-[#141615]/50 hover:text-[#9E3B1C] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HERO & LOOKBOOK MEDIA */}
        {activeTab === 'media' && (
          <form onSubmit={handleSaveSiteMedia} className="space-y-8">
            <div className="rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold">Hero Centerpiece &amp; Manifesto Feature</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hero Sofa */}
                <div className="space-y-3">
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#E5DDD0]">
                    <ResilientImage
                      src={mediaDraft.heroImageUrl}
                      alt="Hero sofa preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="block text-xs font-semibold">Hero Sofa Picture</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mediaDraft.heroImageUrl}
                      onChange={(e) =>
                        setMediaDraft({ ...mediaDraft, heroImageUrl: e.target.value })
                      }
                      className="flex-1 rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141615] text-[#F7F3EB] text-xs font-semibold cursor-pointer shrink-0">
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            readFileAsDataUrl(file, (url) =>
                              setMediaDraft((prev) => ({ ...prev, heroImageUrl: url }))
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      value={mediaDraft.heroTagline}
                      onChange={(e) =>
                        setMediaDraft({ ...mediaDraft, heroTagline: e.target.value })
                      }
                      placeholder="Hero tagline"
                      className="rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={mediaDraft.heroSubTagline}
                      onChange={(e) =>
                        setMediaDraft({ ...mediaDraft, heroSubTagline: e.target.value })
                      }
                      placeholder="Hero sub-tagline"
                      className="rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Craft Spotlight */}
                <div className="space-y-3">
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#E5DDD0]">
                    <ResilientImage
                      src={mediaDraft.craftSpotlightImageUrl}
                      alt="Craft spotlight preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="block text-xs font-semibold">
                    Manifesto Left Spotlight Picture
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mediaDraft.craftSpotlightImageUrl}
                      onChange={(e) =>
                        setMediaDraft({
                          ...mediaDraft,
                          craftSpotlightImageUrl: e.target.value,
                        })
                      }
                      className="flex-1 rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141615] text-[#F7F3EB] text-xs font-semibold cursor-pointer shrink-0">
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            readFileAsDataUrl(file, (url) =>
                              setMediaDraft((prev) => ({
                                ...prev,
                                craftSpotlightImageUrl: url,
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      value={mediaDraft.craftSpotlightTitle}
                      onChange={(e) =>
                        setMediaDraft({
                          ...mediaDraft,
                          craftSpotlightTitle: e.target.value,
                        })
                      }
                      placeholder="Spotlight piece title"
                      className="rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={mediaDraft.craftSpotlightMaterial}
                      onChange={(e) =>
                        setMediaDraft({
                          ...mediaDraft,
                          craftSpotlightMaterial: e.target.value,
                        })
                      }
                      placeholder="Material subtitle"
                      className="rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms, lived in. */}
            <div className="rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold">&ldquo;rooms, lived in.&rdquo; Lookbook Slots</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mediaDraft.rooms.map((room, idx) => (
                  <div key={room.id} className="space-y-3">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5DDD0]">
                      <ResilientImage
                        src={room.imageUrl}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-mono-tabular font-semibold text-[#9E3B1C]">
                      {room.label}
                    </p>
                    <input
                      type="text"
                      value={room.title}
                      onChange={(e) => {
                        const nextRooms = [...mediaDraft.rooms];
                        nextRooms[idx] = { ...room, title: e.target.value };
                        setMediaDraft({ ...mediaDraft, rooms: nextRooms });
                      }}
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={room.location}
                      onChange={(e) => {
                        const nextRooms = [...mediaDraft.rooms];
                        nextRooms[idx] = { ...room, location: e.target.value };
                        setMediaDraft({ ...mediaDraft, rooms: nextRooms });
                      }}
                      className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={room.imageUrl}
                        onChange={(e) => {
                          const nextRooms = [...mediaDraft.rooms];
                          nextRooms[idx] = { ...room, imageUrl: e.target.value };
                          setMediaDraft({ ...mediaDraft, rooms: nextRooms });
                        }}
                        className="flex-1 rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2 text-xs"
                      />
                      <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#141615] text-[#F7F3EB] text-xs font-semibold cursor-pointer shrink-0">
                        <ImagePlus className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              readFileAsDataUrl(file, (url) => {
                                setMediaDraft((prev) => {
                                  const nextRooms = [...prev.rooms];
                                  nextRooms[idx] = { ...nextRooms[idx], imageUrl: url };
                                  return { ...prev, rooms: nextRooms };
                                });
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#9E3B1C] text-[#F7F3EB] text-sm font-semibold hover:bg-[#B84A27] cursor-pointer"
              >
                Publish All Media Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SALES LOG */}
        {activeTab === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleAddSale}
              className="lg:col-span-4 rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-6 space-y-4 h-fit"
            >
              <h2 className="text-lg font-bold">Record Showroom Sale</h2>
              <div>
                <label className="block text-xs font-semibold mb-1">Furniture Piece</label>
                <select
                  value={saleItemTitle}
                  onChange={(e) => setSaleItemTitle(e.target.value)}
                  className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2.5 text-sm"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title} ({formatKes(item.priceKes)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={saleQty}
                    onChange={(e) => setSaleQty(e.target.value)}
                    className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2.5 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Channel</label>
                  <select
                    value={saleChannel}
                    onChange={(e) =>
                      setSaleChannel(e.target.value as 'Showroom' | 'WhatsApp')
                    }
                    className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2.5 text-sm"
                  >
                    <option value="Showroom">Showroom</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Showroom Branch</label>
                <select
                  value={saleBranch}
                  onChange={(e) => setSaleBranch(e.target.value)}
                  className="w-full rounded-xl bg-[#F7F3EB] border border-[#141615]/15 px-3 py-2.5 text-sm"
                >
                  {ESLIS_SHOWROOMS.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#1B3B2B] text-[#F7F3EB] text-xs font-semibold hover:bg-[#142D20] cursor-pointer"
              >
                Log Sale
              </button>
            </form>

            <div className="lg:col-span-8 rounded-[24px] bg-[#EFEAE0] border border-[#141615]/10 p-6 overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Recent Orders &amp; Showroom Sales</h2>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#141615]/15 text-xs text-[#141615]/60">
                    <th className="py-2.5 pr-4 font-semibold">Piece</th>
                    <th className="py-2.5 pr-4 font-semibold">Branch</th>
                    <th className="py-2.5 pr-4 font-semibold">Channel</th>
                    <th className="py-2.5 pr-4 font-semibold text-right">Qty</th>
                    <th className="py-2.5 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141615]/10">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="py-3 pr-4 font-semibold">{sale.itemTitle}</td>
                      <td className="py-3 pr-4 text-xs text-[#141615]/75">{sale.branch}</td>
                      <td className="py-3 pr-4 text-xs">{sale.channel}</td>
                      <td className="py-3 pr-4 text-right tabular-nums">{sale.quantity}</td>
                      <td className="py-3 text-right font-bold tabular-nums">
                        {formatKes(sale.totalKes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

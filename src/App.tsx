import { Suspense, lazy, useEffect, useState } from 'react';
import { CollectionStage } from './components/CollectionStage';
import { HeroSection } from './components/HeroSection';
import { ActiveRoute, Navbar } from './components/Navbar';
import {
  DEFAULT_FURNITURE_ITEMS,
  DEFAULT_SALES,
  DEFAULT_SITE_MEDIA,
} from './data/defaultCatalog';
import { storageService } from './services/storageService';
import {
  CartItem,
  FurnitureItem,
  SaleRecord,
  SiteMediaConfig,
} from './types/furniture';

const ManifestoBlock = lazy(() =>
  import('./components/ManifestoBlock').then((m) => ({ default: m.ManifestoBlock }))
);
const MaterialsAndMetrics = lazy(() =>
  import('./components/MaterialsAndMetrics').then((m) => ({
    default: m.MaterialsAndMetrics,
  }))
);
const LookbookAndCloser = lazy(() =>
  import('./components/LookbookAndCloser').then((m) => ({
    default: m.LookbookAndCloser,
  }))
);
const AdminStudio = lazy(() =>
  import('./components/AdminStudio').then((m) => ({ default: m.AdminStudio }))
);
const CartDrawer = lazy(() =>
  import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer }))
);
const FilmModal = lazy(() =>
  import('./components/FilmModal').then((m) => ({ default: m.FilmModal }))
);

export default function App() {
  const [route, setRoute] = useState<ActiveRoute>('home');
  const [items, setItems] = useState<FurnitureItem[]>(DEFAULT_FURNITURE_ITEMS);
  const [media, setMedia] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA);
  const [sales, setSales] = useState<SaleRecord[]>(DEFAULT_SALES);
  const [activeCollectionId, setActiveCollectionId] = useState<string>(
    DEFAULT_FURNITURE_ITEMS[0].id
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      storageService.getItems(),
      storageService.getSiteMedia(),
      storageService.getSales(),
    ]).then(([loadedItems, loadedMedia, loadedSales]) => {
      if (!mounted) return;
      setItems(loadedItems);
      setMedia(loadedMedia);
      setSales(loadedSales);
      if (loadedItems[0]) {
        setActiveCollectionId(loadedItems[0].id);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleNavigate = (nextRoute: ActiveRoute, sectionId?: string) => {
    setRoute(nextRoute);
    if (nextRoute === 'home') {
      if (sectionId) {
        scrollToSection(sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const handleSelectHeroPiece = (id: string) => {
    setActiveCollectionId(id);
    scrollToSection('collection');
  };

  const handleAddToBag = (item: FurnitureItem) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setBagOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === id
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveFromBag = (id: string) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== id));
  };

  const handleConfirmOrder = async (branch: string) => {
    let nextSales = sales;
    for (const entry of cart) {
      nextSales = await storageService.recordSale({
        itemTitle: entry.item.title,
        quantity: entry.quantity,
        totalKes: entry.item.priceKes * entry.quantity,
        branch,
        channel: 'Web Bag',
      });
    }
    setSales(nextSales);
    setCart([]);
  };

  const handleSaveItem = async (item: FurnitureItem) => {
    const next = await storageService.saveItem(item);
    setItems(next);
  };

  const handleDeleteItem = async (id: string) => {
    const next = await storageService.deleteItem(id);
    setItems(next);
    if (activeCollectionId === id && next[0]) {
      setActiveCollectionId(next[0].id);
    }
  };

  const handleSaveMedia = async (nextMedia: SiteMediaConfig) => {
    const saved = await storageService.saveSiteMedia(nextMedia);
    setMedia(saved);
  };

  const handleRecordSale = async (sale: Omit<SaleRecord, 'id' | 'createdAt'>) => {
    const nextSales = await storageService.recordSale(sale);
    setSales(nextSales);
  };

  const handleResetAll = async () => {
    const reset = await storageService.resetAll();
    setItems(reset.items);
    setMedia(reset.media);
    setSales(reset.sales);
    if (reset.items[0]) {
      setActiveCollectionId(reset.items[0].id);
    }
  };

  const totalBagCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#141615]">
      <Navbar
        activeRoute={route}
        onNavigate={handleNavigate}
        bagCount={totalBagCount}
        onOpenBag={() => setBagOpen(true)}
        socials={media.socials}
      />

      {route === 'home' ? (
        <main>
          <HeroSection
            media={media}
            spotlightItems={items}
            onShopCollection={() => scrollToSection('collection')}
            onWatchFilm={() => setFilmOpen(true)}
            onSelectPiece={handleSelectHeroPiece}
          />

          <CollectionStage
            items={items}
            activeId={activeCollectionId}
            onSelectId={setActiveCollectionId}
            onAddToBag={handleAddToBag}
            whatsappNumber={media.socials.whatsappNumber}
          />

          <Suspense fallback={<div className="min-h-[320px] bg-[#EFEAE0]" />}>
            <ManifestoBlock
              media={media}
              onExploreMaterials={() => scrollToSection('materials')}
            />
            <MaterialsAndMetrics />
            <LookbookAndCloser
              media={media}
              onShopCollection={() => scrollToSection('collection')}
              onOpenAdmin={() => handleNavigate('admin')}
            />
          </Suspense>
        </main>
      ) : (
        <Suspense
          fallback={
            <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F3EB] text-sm font-medium text-[#141615]/70">
              Loading Studio...
            </div>
          }
        >
          <AdminStudio
            items={items}
            media={media}
            sales={sales}
            onSaveItem={handleSaveItem}
            onDeleteItem={handleDeleteItem}
            onSaveMedia={handleSaveMedia}
            onRecordSale={handleRecordSale}
            onResetAll={handleResetAll}
            onExitAdmin={() => handleNavigate('home', 'hero')}
          />
        </Suspense>
      )}

      {bagOpen && (
        <Suspense fallback={null}>
          <CartDrawer
            open={bagOpen}
            items={cart}
            onClose={() => setBagOpen(false)}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemoveFromBag}
            onConfirmOrder={handleConfirmOrder}
            whatsappNumber={media.socials.whatsappNumber}
          />
        </Suspense>
      )}

      {filmOpen && (
        <Suspense fallback={null}>
          <FilmModal
            open={filmOpen}
            onClose={() => setFilmOpen(false)}
            items={items}
            media={media}
          />
        </Suspense>
      )}
    </div>
  );
}

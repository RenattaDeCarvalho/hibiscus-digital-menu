"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, GripVertical, LogOut, Home, Save, X, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  // Fetch hero image setting
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/settings')
        .then(r => r?.json?.() ?? {})
        .then((data: any) => {
          if (data?.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        })
        .catch(() => {});
    }
  }, [status]);

  const handleUploadHeroImage = useCallback(async (file: File) => {
    setUploadingHero(true);
    try {
      // Get presigned URL
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: true }),
      });
      const { uploadUrl, cloud_storage_path } = await presignedRes.json();
      
      // Upload to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type, 'Content-Disposition': 'attachment' },
        body: file,
      });
      
      // Get final URL
      const completeRes = await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloud_storage_path, isPublic: true }),
      });
      const { url } = await completeRes.json();
      
      // Save setting
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'heroImageUrl', value: url }),
      });
      
      setHeroImageUrl(url);
      toast.success('Imagem de fundo atualizada!');
    } catch {
      toast.error('Erro ao fazer upload da imagem');
    }
    setUploadingHero(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res?.json?.();
      setCategories(data ?? []);
    } catch { setCategories([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchCategories();
  }, [status, fetchCategories]);

  const fetchItems = useCallback(async (catId: string) => {
    try {
      const res = await fetch(`/api/admin/items?categoryId=${catId}`);
      const data = await res?.json?.();
      setItems(data ?? []);
    } catch { setItems([]); }
  }, []);

  const handleSelectCat = useCallback((cat: any) => {
    setSelectedCat(cat);
    fetchItems(cat?.id ?? '');
    setEditingItem(null);
  }, [fetchItems]);

  const handleSaveCategory = useCallback(async (catData: any) => {
    try {
      const isNew = !catData?.id;
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${catData.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      if (!res?.ok) throw new Error('Failed');
      toast.success(isNew ? 'Categoria criada!' : 'Categoria atualizada!');
      setEditingCat(null);
      fetchCategories();
    } catch {
      toast.error('Erro ao salvar categoria');
    }
  }, [fetchCategories]);

  const handleDeleteCategory = useCallback(async (id: string) => {
    if (!confirm('Deletar esta categoria e todos os seus itens?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      toast.success('Categoria deletada!');
      setSelectedCat(null);
      fetchCategories();
    } catch {
      toast.error('Erro ao deletar');
    }
  }, [fetchCategories]);

  const handleSaveItem = useCallback(async (itemData: any) => {
    try {
      const isNew = !itemData?.id;
      const url = isNew ? '/api/admin/items' : `/api/admin/items/${itemData.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!res?.ok) throw new Error('Failed');
      toast.success(isNew ? 'Item criado!' : 'Item atualizado!');
      setEditingItem(null);
      if (selectedCat?.id) fetchItems(selectedCat.id);
    } catch {
      toast.error('Erro ao salvar item');
    }
  }, [selectedCat, fetchItems]);

  const handleDeleteItem = useCallback(async (id: string) => {
    if (!confirm('Deletar este item?')) return;
    try {
      await fetch(`/api/admin/items/${id}`, { method: 'DELETE' });
      toast.success('Item deletado!');
      if (selectedCat?.id) fetchItems(selectedCat.id);
    } catch {
      toast.error('Erro ao deletar');
    }
  }, [selectedCat, fetchItems]);

  const handleMoveCategory = useCallback(async (catId: string, direction: 'up' | 'down') => {
    try {
      await fetch(`/api/admin/categories/${catId}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      fetchCategories();
    } catch {}
  }, [fetchCategories]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,5%)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[hsl(40,60%,55%)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(0,0%,5%)]/95 backdrop-blur-sm border-b border-[hsl(0,0%,12%)]">
        <div className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <Image src="/logo-hibiscus.png" alt="Hibiscus" fill className="object-contain" />
            </div>
            <div>
              <h1 className="font-serif text-[hsl(40,60%,55%)] text-lg">Administração</h1>
              <p className="text-[hsl(40,10%,40%)] text-[10px]">{session?.user?.email ?? ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1 text-[hsl(40,10%,50%)] hover:text-[hsl(40,60%,55%)] text-xs transition-colors"
            >
              <Home className="w-3.5 h-3.5" /> Cardápio
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-1 text-[hsl(40,10%,50%)] hover:text-red-400 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-4 py-6">
        {/* Hero Image Setting */}
        <div className="mb-6 p-4 rounded-xl bg-[hsl(0,0%,8%)] border border-[hsl(0,0%,12%)]">
          <h3 className="font-serif text-[hsl(40,20%,85%)] text-base mb-3">Imagem de Fundo (Hero)</h3>
          <div className="flex items-center gap-4">
            {heroImageUrl && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-[hsl(0,0%,12%)]">
                <Image src={heroImageUrl} alt="Hero" fill className="object-cover" />
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(40,60%,55%)]/10 border border-[hsl(40,60%,55%)]/30 text-[hsl(40,60%,55%)] text-xs cursor-pointer hover:bg-[hsl(40,60%,55%)]/20 transition-colors">
              <Upload className="w-4 h-4" />
              {uploadingHero ? 'Enviando...' : 'Trocar Imagem'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingHero}
                onChange={(e) => {
                  const f = e.target?.files?.[0];
                  if (f) handleUploadHeroImage(f);
                }}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-[hsl(40,20%,85%)] text-lg">Categorias</h2>
              <button
                onClick={() => setEditingCat({ namePt: '', nameEn: '', nameEs: '', slug: '', iconUrl: '', descPt: '', descEn: '', descEs: '' })}
                className="flex items-center gap-1 text-[hsl(40,60%,55%)] hover:text-[hsl(40,60%,70%)] text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Nova
              </button>
            </div>
            <div className="space-y-2">
              {(categories ?? [])?.map?.((cat: any, idx: number) => (
                <div
                  key={cat?.id ?? idx}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedCat?.id === cat?.id
                      ? 'bg-[hsl(40,60%,55%)]/10 border border-[hsl(40,60%,55%)]/30'
                      : 'bg-[hsl(0,0%,8%)] hover:bg-[hsl(0,0%,11%)] border border-transparent'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleMoveCategory(cat?.id, 'up')} className="text-[hsl(40,10%,40%)] hover:text-[hsl(40,60%,55%)]">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleMoveCategory(cat?.id, 'down')} className="text-[hsl(40,10%,40%)] hover:text-[hsl(40,60%,55%)]">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleSelectCat(cat)}
                    className="flex-1 text-left"
                  >
                    <span className="text-sm text-[hsl(40,20%,85%)]">{cat?.namePt ?? ''}</span>
                  </button>
                  <button onClick={() => setEditingCat(cat)} className="text-[hsl(40,10%,40%)] hover:text-[hsl(40,60%,55%)]">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat?.id ?? '')} className="text-[hsl(40,10%,40%)] hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )) ?? []}
            </div>
          </div>

          {/* Items List */}
          <div className="md:col-span-2">
            {selectedCat ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-[hsl(40,20%,85%)] text-lg">{selectedCat?.namePt ?? ''}</h2>
                  <button
                    onClick={() => setEditingItem({ categoryId: selectedCat?.id, namePt: '', nameEn: '', nameEs: '', descPt: '', descEn: '', descEs: '', price: 0 })}
                    className="flex items-center gap-1 text-[hsl(40,60%,55%)] hover:text-[hsl(40,60%,70%)] text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Novo Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(items ?? [])?.map?.((item: any, idx: number) => (
                    <div
                      key={item?.id ?? idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(0,0%,8%)] hover:bg-[hsl(0,0%,11%)] transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[hsl(40,20%,85%)]">{item?.namePt ?? ''}</span>
                          <span className="text-sm text-[hsl(40,60%,55%)] font-serif">R$ {item?.price?.toFixed?.(2)?.replace?.('.', ',') ?? '0,00'}</span>
                        </div>
                        <p className="text-[hsl(40,10%,40%)] text-xs truncate mt-0.5">{item?.descPt ?? ''}</p>
                      </div>
                      <button onClick={() => setEditingItem(item)} className="text-[hsl(40,10%,40%)] hover:text-[hsl(40,60%,55%)]">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteItem(item?.id ?? '')} className="text-[hsl(40,10%,40%)] hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )) ?? []}
                  {(items?.length ?? 0) === 0 ? (
                    <p className="text-center text-[hsl(40,10%,40%)] text-sm py-8">Nenhum item nesta categoria.</p>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-[hsl(40,10%,35%)] text-sm">
                Selecione uma categoria para gerenciar seus itens.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Edit Modal */}
      {editingCat ? (
        <CategoryModal
          category={editingCat}
          onSave={handleSaveCategory}
          onClose={() => setEditingCat(null)}
        />
      ) : null}

      {/* Item Edit Modal */}
      {editingItem ? (
        <ItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => setEditingItem(null)}
        />
      ) : null}
    </div>
  );
}

const AVAILABLE_ICONS = [
  { url: '/icons/sandwich.svg', label: 'Sanduíche' },
  { url: '/icons/pasta.svg', label: 'Massas' },
  { url: '/icons/pizza.svg', label: 'Pizza' },
  { url: '/icons/soup.svg', label: 'Sopa' },
  { url: '/icons/salad.svg', label: 'Salada' },
  { url: '/icons/main-dish.svg', label: 'Prato Principal' },
  { url: '/icons/dessert.svg', label: 'Sobremesa' },
  { url: '/icons/coffee.svg', label: 'Café' },
  { url: '/icons/water.svg', label: 'Água/Suco' },
  { url: '/icons/beer.svg', label: 'Cerveja' },
  { url: '/icons/cocktail.svg', label: 'Coquetel' },
  { url: '/icons/wine.svg', label: 'Vinho/Destilado' },
  { url: '/icons/whisky.svg', label: 'Whisky' },
];

function CategoryModal({ category, onSave, onClose }: { category: any; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    id: category?.id ?? '',
    slug: category?.slug ?? '',
    namePt: category?.namePt ?? '',
    nameEn: category?.nameEn ?? '',
    nameEs: category?.nameEs ?? '',
    descPt: category?.descPt ?? '',
    descEn: category?.descEn ?? '',
    descEs: category?.descEs ?? '',
    iconUrl: category?.iconUrl ?? '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [field]: value }));
    if (field === 'namePt' && !category?.id) {
      const slug = value?.toLowerCase?.()?.normalize?.('NFD')?.replace?.(/[\u0300-\u036f]/g, '')?.replace?.(/[^a-z0-9]+/g, '-')?.replace?.(/^-|-$/g, '') ?? '';
      setForm((prev: any) => ({ ...(prev ?? {}), [field]: value, slug }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[hsl(0,0%,8%)] rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" onClick={(e: React.MouseEvent) => e?.stopPropagation?.()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-[hsl(40,60%,55%)] text-xl">
            {category?.id ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>
          <button onClick={onClose} className="text-[hsl(40,10%,40%)] hover:text-[hsl(40,20%,70%)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <InputField label="Nome (PT)" value={form?.namePt ?? ''} onChange={(v: string) => handleChange('namePt', v)} />
          <InputField label="Nome (EN)" value={form?.nameEn ?? ''} onChange={(v: string) => handleChange('nameEn', v)} />
          <InputField label="Nome (ES)" value={form?.nameEs ?? ''} onChange={(v: string) => handleChange('nameEs', v)} />
          <InputField label="Slug" value={form?.slug ?? ''} onChange={(v: string) => handleChange('slug', v)} />
          <InputField label="Descrição (PT)" value={form?.descPt ?? ''} onChange={(v: string) => handleChange('descPt', v)} />
          <InputField label="Descrição (EN)" value={form?.descEn ?? ''} onChange={(v: string) => handleChange('descEn', v)} />
          <InputField label="Descrição (ES)" value={form?.descEs ?? ''} onChange={(v: string) => handleChange('descEs', v)} />

          {/* Icon Picker */}
          <div>
            <label className="block text-[hsl(40,10%,55%)] text-xs mb-2">Ícone da Categoria</label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon.url}
                  type="button"
                  onClick={() => handleChange('iconUrl', icon.url)}
                  title={icon.label}
                  className={`relative w-full aspect-square rounded-lg border-2 flex items-center justify-center p-2 transition-all ${
                    form.iconUrl === icon.url
                      ? 'border-[hsl(40,60%,55%)] bg-[hsl(40,60%,55%)]/15 shadow-[0_0_8px_hsl(40,60%,55%,0.3)]'
                      : 'border-[hsl(0,0%,18%)] bg-[hsl(0,0%,10%)] hover:border-[hsl(40,30%,30%)] hover:bg-[hsl(0,0%,12%)]'
                  }`}
                >
                  <Image src={icon.url} alt={icon.label} width={28} height={28} className="object-contain" />
                  {form.iconUrl === icon.url && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[hsl(40,60%,55%)] flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-[hsl(0,0%,5%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {form.iconUrl && (
              <p className="text-[hsl(40,10%,40%)] text-[10px] mt-1.5 truncate">
                Selecionado: {AVAILABLE_ICONS.find(i => i.url === form.iconUrl)?.label ?? form.iconUrl}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[hsl(0,0%,18%)] text-[hsl(40,10%,60%)] text-sm hover:bg-[hsl(0,0%,12%)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-lg bg-[hsl(40,60%,55%)] text-[hsl(0,0%,5%)] text-sm font-medium hover:bg-[hsl(40,60%,45%)] transition-colors flex items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemModal({ item, onSave, onClose }: { item: any; onSave: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    id: item?.id ?? '',
    categoryId: item?.categoryId ?? '',
    namePt: item?.namePt ?? '',
    nameEn: item?.nameEn ?? '',
    nameEs: item?.nameEs ?? '',
    descPt: item?.descPt ?? '',
    descEn: item?.descEn ?? '',
    descEs: item?.descEs ?? '',
    price: item?.price ?? 0,
    imageUrl: item?.imageUrl ?? '',
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const presignRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file?.name ?? 'image.jpg', contentType: file?.type ?? 'image/jpeg', isPublic: true }),
      });
      const { uploadUrl, cloud_storage_path } = await presignRes?.json?.() ?? {};
      if (!uploadUrl) throw new Error('No upload URL');

      const signedHeaders = new URL(uploadUrl)?.searchParams?.get?.('X-Amz-SignedHeaders') ?? '';
      const headers: Record<string, string> = { 'Content-Type': file?.type ?? 'image/jpeg' };
      if (signedHeaders?.includes?.('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      await fetch(uploadUrl, { method: 'PUT', headers, body: file });

      const completeRes = await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloud_storage_path, isPublic: true }),
      });
      const { url } = await completeRes?.json?.() ?? {};
      if (url) handleChange('imageUrl', url);
      toast.success('Imagem enviada!');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[hsl(0,0%,8%)] rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" onClick={(e: React.MouseEvent) => e?.stopPropagation?.()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-[hsl(40,60%,55%)] text-xl">
            {item?.id ? 'Editar Item' : 'Novo Item'}
          </h3>
          <button onClick={onClose} className="text-[hsl(40,10%,40%)] hover:text-[hsl(40,20%,70%)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <InputField label="Nome (PT)" value={form?.namePt ?? ''} onChange={(v: string) => handleChange('namePt', v)} />
          <InputField label="Nome (EN)" value={form?.nameEn ?? ''} onChange={(v: string) => handleChange('nameEn', v)} />
          <InputField label="Nome (ES)" value={form?.nameEs ?? ''} onChange={(v: string) => handleChange('nameEs', v)} />
          <InputField label="Descrição (PT)" value={form?.descPt ?? ''} onChange={(v: string) => handleChange('descPt', v)} />
          <InputField label="Descrição (EN)" value={form?.descEn ?? ''} onChange={(v: string) => handleChange('descEn', v)} />
          <InputField label="Descrição (ES)" value={form?.descEs ?? ''} onChange={(v: string) => handleChange('descEs', v)} />
          <div>
            <label className="text-[hsl(40,10%,50%)] text-xs mb-1 block">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form?.price ?? 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('price', parseFloat(e?.target?.value ?? '0') || 0)}
              className="w-full bg-[hsl(0,0%,12%)] border border-[hsl(0,0%,18%)] rounded-lg py-2.5 px-3 text-sm text-[hsl(40,20%,85%)] focus:outline-none focus:border-[hsl(40,60%,40%)] transition-colors"
            />
          </div>
          <div>
            <label className="text-[hsl(40,10%,50%)] text-xs mb-1 block">Imagem</label>
            <div className="flex items-center gap-3">
              {form?.imageUrl ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[hsl(0,0%,12%)]">
                  <Image src={form.imageUrl} alt="Item" fill className="object-cover" />
                </div>
              ) : null}
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[hsl(0,0%,18%)] text-[hsl(40,10%,60%)] text-xs hover:bg-[hsl(0,0%,12%)] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Enviando...' : 'Upload'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[hsl(0,0%,18%)] text-[hsl(40,10%,60%)] text-sm hover:bg-[hsl(0,0%,12%)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-lg bg-[hsl(40,60%,55%)] text-[hsl(0,0%,5%)] text-sm font-medium hover:bg-[hsl(40,60%,45%)] transition-colors flex items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[hsl(40,10%,50%)] text-xs mb-1 block">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e?.target?.value ?? '')}
        className="w-full bg-[hsl(0,0%,12%)] border border-[hsl(0,0%,18%)] rounded-lg py-2.5 px-3 text-sm text-[hsl(40,20%,85%)] focus:outline-none focus:border-[hsl(40,60%,40%)] transition-colors"
      />
    </div>
  );
}

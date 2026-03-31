'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AuthGuard } from '@/components/auth';
import { api } from '@/lib/api';

type Status = {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const initialStatus: Status = { type: 'idle', message: '' };

export default function AdminPage() {
  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [scormFile, setScormFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [scormStatus, setScormStatus] = useState<Status>(initialStatus);
  const [logoStatus, setLogoStatus] = useState<Status>(initialStatus);

  const canUploadScorm = useMemo(
    () => Boolean(productId.trim() && title.trim() && tag.trim() && description.trim() && productImage && scormFile),
    [productId, title, tag, description, productImage, scormFile]
  );
  const canUploadLogo = Boolean(logoFile);

  async function onScormUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canUploadScorm || !scormFile || !productImage) return;

    setScormStatus({ type: 'loading', message: 'Adding product...' });
    try {
      const response = await api.admin.uploadScorm({
        productId: productId.trim(),
        title: title.trim(),
        tag: tag.trim(),
        description: description.trim(),
        image: productImage,
        file: scormFile,
      });
      setScormStatus({
        type: 'success',
        message:
          response.message ||
          (response.scormUrl
            ? `Product added successfully. SCORM URL: ${response.scormUrl}`
            : 'Product added successfully.'),
      });
      setScormFile(null);
      setProductImage(null);
      setProductId('');
      setTitle('');
      setTag('');
      setDescription('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add product.';
      setScormStatus({ type: 'error', message });
    }
  }

  async function onLogoUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!logoFile) return;

    setLogoStatus({ type: 'loading', message: 'Uploading logo...' });
    try {
      const response = await api.admin.uploadLogo(logoFile);
      setLogoStatus({
        type: 'success',
        message:
          response.message ||
          (response.logoUrl ? `Logo uploaded successfully. URL: ${response.logoUrl}` : 'Logo uploaded successfully.'),
      });
      setLogoFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload logo.';
      setLogoStatus({ type: 'error', message });
    }
  }

  return (
    <AuthGuard>
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-[3.333rem]">
          <h1 className="text-3xl font-semibold text-otto-burgundy">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add products with SCORM packages and update the platform logo.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8">
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-otto-burgundy">Add Product</h2>
              <p className="mt-1 text-sm text-gray-600">
                Required fields: Product ID, Product Title, Product Tag, Product Description, Product Image, and Product SCORM File (.zip).
              </p>

              <form className="mt-5 space-y-4" onSubmit={onScormUpload}>
                <div>
                  <label htmlFor="productId" className="mb-1 block text-sm font-medium text-gray-800">
                    Product ID
                  </label>
                  <input
                    id="productId"
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="e.g. 1234567890"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-800">
                    Product Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product title"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tag" className="mb-1 block text-sm font-medium text-gray-800">
                    Product Tag
                  </label>
                  <input
                    id="tag"
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. Compliance"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-800">
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short product description"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productImage" className="mb-1 block text-sm font-medium text-gray-800">
                    Product Image
                  </label>
                  <input
                    id="productImage"
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => setProductImage(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-otto-burgundy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="scormFile" className="mb-1 block text-sm font-medium text-gray-800">
                    Product SCORM File
                  </label>
                  <input
                    id="scormFile"
                    type="file"
                    accept=".zip,application/zip,application/x-zip-compressed"
                    onChange={(e) => setScormFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-otto-burgundy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canUploadScorm || scormStatus.type === 'loading'}
                  className="rounded-md bg-otto-burgundy px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {scormStatus.type === 'loading' ? 'Saving...' : 'Add Product'}
                </button>
              </form>

              {scormStatus.type !== 'idle' && (
                <p
                  className={`mt-4 text-sm ${
                    scormStatus.type === 'error' ? 'text-red-600' : 'text-green-700'
                  }`}
                >
                  {scormStatus.message}
                </p>
              )}
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-otto-burgundy">Logo Upload</h2>
              <p className="mt-1 text-sm text-gray-600">
                Upload a new logo for the admin branding.
              </p>

              <form className="mt-5 space-y-4" onSubmit={onLogoUpload}>
                <div>
                  <label htmlFor="logoFile" className="mb-1 block text-sm font-medium text-gray-800">
                    Logo File
                  </label>
                  <input
                    id="logoFile"
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-otto-burgundy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canUploadLogo || logoStatus.type === 'loading'}
                  className="rounded-md bg-otto-burgundy px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {logoStatus.type === 'loading' ? 'Uploading...' : 'Upload Logo'}
                </button>
              </form>

              {logoStatus.type !== 'idle' && (
                <p
                  className={`mt-4 text-sm ${
                    logoStatus.type === 'error' ? 'text-red-600' : 'text-green-700'
                  }`}
                >
                  {logoStatus.message}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

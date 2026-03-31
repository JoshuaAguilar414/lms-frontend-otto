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
  const [scormFile, setScormFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [scormStatus, setScormStatus] = useState<Status>(initialStatus);
  const [logoStatus, setLogoStatus] = useState<Status>(initialStatus);

  const canUploadScorm = useMemo(
    () => Boolean(productId.trim() && title.trim() && scormFile),
    [productId, title, scormFile]
  );
  const canUploadLogo = Boolean(logoFile);

  async function onScormUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canUploadScorm || !scormFile) return;

    setScormStatus({ type: 'loading', message: 'Uploading SCORM package...' });
    try {
      const response = await api.admin.uploadScorm({
        productId: productId.trim(),
        title: title.trim(),
        file: scormFile,
      });
      setScormStatus({
        type: 'success',
        message:
          response.message ||
          (response.scormUrl
            ? `SCORM uploaded successfully. URL: ${response.scormUrl}`
            : 'SCORM uploaded successfully.'),
      });
      setScormFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload SCORM package.';
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
            Upload SCORM packages and update the platform logo.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8">
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-otto-burgundy">SCORM Upload</h2>
              <p className="mt-1 text-sm text-gray-600">
                Required fields: product ID, title, and SCORM file (.zip).
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
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Course title"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="scormFile" className="mb-1 block text-sm font-medium text-gray-800">
                    SCORM File
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
                  {scormStatus.type === 'loading' ? 'Uploading...' : 'Upload SCORM'}
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

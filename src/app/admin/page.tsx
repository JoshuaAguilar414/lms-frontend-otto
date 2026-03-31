'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AuthGuard } from '@/components/auth';
import { api, CourseResponse } from '@/lib/api';

type Status = {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const initialStatus: Status = { type: 'idle', message: '' };

export default function AdminPage() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [tableStatus, setTableStatus] = useState<Status>(initialStatus);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [scormFile, setScormFile] = useState<File | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [scormStatus, setScormStatus] = useState<Status>(initialStatus);
  const [editStatus, setEditStatus] = useState<Status>(initialStatus);
  const [logoStatus, setLogoStatus] = useState<Status>(initialStatus);

  const canUploadScorm = useMemo(
    () => Boolean(productId.trim() && title.trim() && tag.trim() && description.trim() && productImage && scormFile),
    [productId, title, tag, description, productImage, scormFile]
  );
  const canUpdateCourse = useMemo(
    () => Boolean(editTitle.trim() && editTag.trim() && editDescription.trim()),
    [editTitle, editTag, editDescription]
  );
  const canUploadLogo = Boolean(logoFile);

  async function loadCourses() {
    setLoadingCourses(true);
    try {
      const res = await fetch('/api/courses', { cache: 'no-store' });
      const data = (await res.json().catch(() => [])) as CourseResponse[];
      setCourses(Array.isArray(data) ? data : []);
      setTableStatus(initialStatus);
    } catch {
      setTableStatus({ type: 'error', message: 'Failed to load products.' });
    } finally {
      setLoadingCourses(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

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
      setIsAddModalOpen(false);
      await loadCourses();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add product.';
      setScormStatus({ type: 'error', message });
    }
  }

  function openEditModal(course: CourseResponse) {
    setEditingCourse(course);
    setEditTitle(course.title || '');
    setEditTag(course.tag || course.tags?.[0] || 'Course');
    setEditDescription(course.description || '');
    setEditStatus(initialStatus);
    setIsEditModalOpen(true);
  }

  async function onEditCourse(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingCourse || !canUpdateCourse) return;

    setEditStatus({ type: 'loading', message: 'Updating product...' });
    try {
      const res = await api.admin.updateCourse(editingCourse._id, {
        title: editTitle.trim(),
        tag: editTag.trim(),
        description: editDescription.trim(),
      });
      setEditStatus({ type: 'success', message: res.message || 'Product updated successfully.' });
      setIsEditModalOpen(false);
      setEditingCourse(null);
      await loadCourses();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product.';
      setEditStatus({ type: 'error', message });
    }
  }

  async function onDeleteCourse(course: CourseResponse) {
    const ok = window.confirm(`Delete "${course.title}"? This cannot be undone.`);
    if (!ok) return;
    setDeleteLoadingId(course._id);
    setTableStatus({ type: 'loading', message: 'Deleting product...' });
    try {
      const res = await api.admin.deleteCourse(course._id);
      setTableStatus({ type: 'success', message: res.message || 'Product deleted successfully.' });
      await loadCourses();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product.';
      setTableStatus({ type: 'error', message });
    } finally {
      setDeleteLoadingId(null);
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
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-[3.333rem]">
          <h1 className="text-3xl font-semibold text-otto-burgundy">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage training products and platform logo.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8">
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-otto-burgundy">Products</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    View all products, then add, edit, or delete from this table.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScormStatus(initialStatus);
                    setProductId('');
                    setTitle('');
                    setTag('');
                    setDescription('');
                    setProductImage(null);
                    setScormFile(null);
                    setIsAddModalOpen(true);
                  }}
                  className="rounded-md bg-otto-burgundy px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add Product
                </button>
              </div>

              {tableStatus.type !== 'idle' && (
                <p
                  className={`mt-4 text-sm ${
                    tableStatus.type === 'error' ? 'text-red-600' : 'text-green-700'
                  }`}
                >
                  {tableStatus.message}
                </p>
              )}

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-3 py-2">Product ID</th>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Tag</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCourses ? (
                      <tr>
                        <td className="px-3 py-4 text-sm text-gray-600" colSpan={4}>
                          Loading products...
                        </td>
                      </tr>
                    ) : courses.length === 0 ? (
                      <tr>
                        <td className="px-3 py-4 text-sm text-gray-600" colSpan={4}>
                          No products yet. Click "Add Product" to create one.
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course._id} className="border-b border-gray-100 text-sm text-gray-800">
                          <td className="px-3 py-3">{course._id}</td>
                          <td className="px-3 py-3">{course.title}</td>
                          <td className="px-3 py-3">{course.tag || course.tags?.[0] || '-'}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(course)}
                                className="rounded border border-otto-burgundy px-3 py-1 text-xs font-semibold text-otto-burgundy hover:bg-otto-burgundy hover:text-white"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteCourse(course)}
                                disabled={deleteLoadingId === course._id}
                                className="rounded border border-red-600 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {deleteLoadingId === course._id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-otto-burgundy">Add Product</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Required fields: Product ID, title, tag, description, image, and SCORM zip.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

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
              <p className={`mt-4 text-sm ${scormStatus.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
                {scormStatus.message}
              </p>
            )}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-otto-burgundy">Edit Product</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Update title, tag, and description for this product.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={onEditCourse}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Product ID</label>
                <input
                  type="text"
                  value={editingCourse?._id || ''}
                  className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                  disabled
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Product Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Product Tag</label>
                <input
                  type="text"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Product Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-otto-burgundy"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!canUpdateCourse || editStatus.type === 'loading'}
                className="rounded-md bg-otto-burgundy px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editStatus.type === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {editStatus.type !== 'idle' && (
              <p className={`mt-4 text-sm ${editStatus.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
                {editStatus.message}
              </p>
            )}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Link as LucideLink, X, Trash2, Edit, UploadCloud } from 'lucide-react';

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
}

export default function LinksContent() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentLink, setCurrentLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links`);
      const json = await res.json();
      if (json.success) {
        setLinks(json.links || []);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setCurrentLink(null);
    setFormData({
      title: '',
      url: '',
      description: '',
      category: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (link: Link) => {
    setModalMode('edit');
    setCurrentLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      category: link.category || '',
      is_active: link.is_active,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      url: formData.url,
      description: formData.description,
      category: formData.category,
      is_active: formData.is_active,
    };

    try {
      const url = modalMode === 'edit' 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${currentLink?.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/links`;

      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLinks();
      } else {
        alert('Failed to save link. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchLinks();
      } else {
        alert('Failed to delete link.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Link Management</h1>
        <button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          + Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-lg">No links found. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Title</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">URL</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-800/50">
                  <td className="p-4">{link.title}</td>
                  <td className="p-4 break-all text-sm">{link.url}</td>
                  <td className="p-4">{link.category || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      link.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {link.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => openEditModal(link)}
                      className="text-yellow-500 hover:text-yellow-400 text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(link.id)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-2xl font-semibold">
                {modalMode === 'add' ? 'Add New Link' : 'Edit Link'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Link title"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Link description"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Education, Tools, News"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-400 cursor-pointer">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold rounded-xl transition disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
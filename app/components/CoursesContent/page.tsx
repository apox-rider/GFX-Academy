'use client';

import { useState, useMemo, useEffect } from 'react';
import { Play, FileText, Unlock, Lock, Crown, Star, X, Trash2 } from 'lucide-react';

interface Tutorial {
  id: number;
  title: string;
  type: 'video' | 'pdf';
  duration?: string;
  pages?: number;
  url: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

interface CourseLevel {
  level: 'Beginner' | 'Intermediate' | 'Expert';
  description: string;
  badge: string;
  access: string;
  icon: React.ReactNode;
  color: string;
  tutorials: Tutorial[];
}

export default function CoursesContent() {
  const [activeLevel, setActiveLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner');
  const [toturial, setToturial] = useState<Tutorial[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'preview'>('add');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    type: 'video' as 'video' | 'pdf',
    duration: '',
    pages: '',
    url: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getToturials = () => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutorials`)
      .then(res => res.json())
      .then(json => setToturial(json));
  };

  useEffect(() => {
    getToturials();
  }, []);

  const beginnerTutorials = useMemo(() => 
    toturial.filter(t => t.level === 'Beginner'), 
    [toturial]
  );

  const intermediateTutorials = useMemo(() => 
    toturial.filter(t => t.level === 'Intermediate'), 
    [toturial]
  );

  const expertTutorials = useMemo(() => 
    toturial.filter(t => t.level === 'Expert'), 
    [toturial]
  );

  const courseLevels: CourseLevel[] = [
    {
      level: 'Beginner',
      description: 'Foundational knowledge for complete beginners',
      badge: 'FREE',
      access: 'Available to Everyone (No payment required)',
      icon: <Unlock className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      tutorials: beginnerTutorials
    },
    {
      level: 'Intermediate',
      description: 'Builds upon Beginner level + practical trading strategies',
      badge: 'BRONZE / SILVER / GOLD',
      access: 'Requires Bronze, Silver or Gold Package',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-600',
      tutorials: intermediateTutorials 
    },
    {
      level: 'Expert',
      description: 'Professional level strategies + Gold exclusive benefits',
      badge: 'GOLD ONLY',
      access: 'Gold Package Only + 1 Month Free Signals',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600',
      tutorials: expertTutorials
    },
  ];

  const currentLevel = courseLevels.find(l => l.level === activeLevel)!;

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    setSelectedTutorial(null);
    setFormData({
      id: 0,
      title: '',
      type: 'video',
      duration: '',
      pages: '',
      url: '',
      level: activeLevel,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (tutorial: Tutorial) => {
    setModalMode('edit');
    setSelectedTutorial(tutorial);
    setFormData({
      id: tutorial.id,
      title: tutorial.title,
      type: tutorial.type,
      duration: tutorial.duration || '',
      pages: tutorial.pages?.toString() || '',
      url: tutorial.url,
      level: tutorial.level,
    });
    setIsModalOpen(true);
  };

  // Open Preview Modal
  const openPreviewModal = (tutorial: Tutorial) => {
    setModalMode('preview');
    setSelectedTutorial(tutorial);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      type: formData.type,
      duration: formData.type === 'video' ? formData.duration : undefined,
      pages: formData.type === 'pdf' && formData.pages ? Number(formData.pages) : undefined,
      url: formData.url,
      level: formData.level,
    };

    try {
      const url = modalMode === 'edit' 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/tutorials/${formData.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/tutorials`;

      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        getToturials();
      } else {
        alert('Failed to save tutorial. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTutorial || !confirm('Are you sure you want to delete this tutorial?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutorials/${selectedTutorial.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsModalOpen(false);
        getToturials();
      } else {
        alert('Failed to delete tutorial.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Courses & Learning Materials</h1>
        <p className="text-gray-400 mt-2">Manage all video tutorials and PDF documents by access level</p>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex flex-wrap gap-3 bg-gray-900 p-2 rounded-3xl">
        {courseLevels.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => setActiveLevel(lvl.level)}
            className={`flex-1 px-8 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 ${
              activeLevel === lvl.level
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black shadow-xl'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            {lvl.icon}
            {lvl.level}
            <span className="text-xs opacity-75">({lvl.tutorials.length})</span>
          </button>
        ))}
      </div>

      {/* Level Header Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-5xl shrink-0`}>
            {currentLevel.level === 'Beginner' ? '🌱' : currentLevel.level === 'Intermediate' ? '📈' : '👑'}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold">{currentLevel.level} Level</h2>
              <span className="px-5 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full">
                {currentLevel.badge}
              </span>
            </div>
            <p className="text-xl text-gray-300 mt-3">{currentLevel.description}</p>
            
            <div className="mt-6 flex items-center gap-3 text-lg">
              <div className="text-yellow-500">{currentLevel.icon}</div>
              <span className="font-medium">{currentLevel.access}</span>
            </div>

            {currentLevel.level === 'Expert' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-5 py-2 rounded-2xl">
                <Crown className="w-5 h-5" /> Gold members also get 1 Month Free Signals after payment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">
          All {currentLevel.level} Materials 
          <span className="text-gray-500 text-base font-normal ml-3">
            ({currentLevel.tutorials.length} resources)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentLevel.tutorials.map((tutorial, i) => (
            <div
              key={i}
              className="group bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-yellow-500/40 transition-all duration-300"
            >
              <div className="relative h-52 bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
                {tutorial.type === 'video' ? (
                  <>
                    <div className="w-20 h-20 bg-black/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-12 h-12 text-white" fill="currentColor" />
                    </div>
                    {tutorial.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/90 px-3 py-1 text-xs rounded-full">
                        {tutorial.duration}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <FileText className="w-20 h-20 text-orange-400 mx-auto" />
                    {tutorial.pages && (
                      <p className="mt-3 text-sm text-gray-400">{tutorial.pages} pages</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[56px]">
                  {tutorial.title}
                </h4>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => openPreviewModal(tutorial)}
                    className="flex-1 text-center py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl text-sm font-medium transition"
                  >
                    Preview Resource
                  </button>
                  <button
                    onClick={() => openEditModal(tutorial)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-semibold py-3 rounded-2xl transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold px-10 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition"
        >
          + Add New {currentLevel.level} Tutorial / Document
        </button>
      </div>

      {/* Unified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-2xl font-semibold">
                {modalMode === 'add' && `Add New ${activeLevel} Material`}
                {modalMode === 'edit' && 'Edit Tutorial'}
                {modalMode === 'preview' && `Preview: ${selectedTutorial?.title}`}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Preview Mode - Enhanced Video Accessibility */}
            {modalMode === 'preview' && selectedTutorial && (
              <div className="p-6 flex-1 overflow-auto">
                <h4 className="font-semibold text-xl mb-6">{selectedTutorial.title}</h4>

                {selectedTutorial.type === 'video' ? (
                  <div className="mb-6 rounded-3xl overflow-hidden bg-black shadow-2xl">
                    {selectedTutorial.url.includes('youtube.com') || selectedTutorial.url.includes('youtu.be') ? (
                      // YouTube Embed (accessible iframe)
                      <iframe
                        src={selectedTutorial.url.replace('watch?v=', 'embed/')}
                        className="w-full aspect-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedTutorial.title}
                      />
                    ) : (
                      // Native Video Player - Better Accessibility
                      <video
                        controls
                        className="w-full aspect-video"
                        controlsList="nodownload"
                        preload="metadata"
                        aria-label={`Video: ${selectedTutorial.title}`}
                      >
                        <source src={selectedTutorial.url} type="video/mp4" />
                        <source src={selectedTutorial.url} type="video/webm" />
                        Your browser does not support the video tag.
                        <track 
                          kind="captions" 
                          src="" // Add caption file URL if available
                          label="English" 
                          default 
                        />
                      </video>
                    )}
                  </div>
                ) : (
                  // PDF Preview
                  <div className="bg-gray-800 rounded-3xl p-10 text-center">
                    <FileText className="w-20 h-20 text-orange-400 mx-auto mb-6" />
                    <p className="text-xl mb-2">PDF Document</p>
                    {selectedTutorial.pages && <p className="text-gray-400 mb-8">{selectedTutorial.pages} pages</p>}
                    <a 
                      href={selectedTutorial.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold rounded-2xl hover:scale-105 transition"
                    >
                      Open PDF in New Tab
                    </a>
                  </div>
                )}

                <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <p><strong>Type:</strong> {selectedTutorial.type.toUpperCase()}</p>
                  <p><strong>Level:</strong> {selectedTutorial.level}</p>
                  {selectedTutorial.duration && <p><strong>Duration:</strong> {selectedTutorial.duration}</p>}
                  {selectedTutorial.pages && <p><strong>Pages:</strong> {selectedTutorial.pages}</p>}
                </div>
              </div>
            )}

            {/* Add / Edit Form - Unchanged */}
            {(modalMode === 'add' || modalMode === 'edit') && (
              <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-auto">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g. Introduction to Candlestick Patterns"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF Document</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Level</label>
                    <input
                      type="text"
                      value={formData.level}
                      readOnly
                      className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Duration (optional)</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="e.g. 12:45"
                    />
                  </div>
                )}

                {formData.type === 'pdf' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Number of Pages (optional)</label>
                    <input
                      type="number"
                      name="pages"
                      value={formData.pages}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="e.g. 24"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Resource URL</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl font-medium transition"
                  >
                    Cancel
                  </button>

                  {modalMode === 'edit' && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-6 py-3 bg-red-600/80 hover:bg-red-700 text-white rounded-2xl transition flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" /> Delete
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-semibold rounded-2xl transition disabled:opacity-70"
                  >
                    {isSubmitting 
                      ? (modalMode === 'edit' ? 'Updating...' : 'Adding...') 
                      : (modalMode === 'edit' ? 'Update Tutorial' : 'Add Tutorial')
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
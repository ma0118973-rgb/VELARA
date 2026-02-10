import React, { useState } from 'react';
import { Article, AppRoute } from '../types';
import { saveArticle, uploadImageToRemote } from '../services/dbService';
import { generateNewsArticle } from '../services/geminiService';
import { Save, ArrowLeft, Wand2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface EditorProps {
  articleToEdit?: Article;
  onNavigate: (route: AppRoute) => void;
}

export const Editor: React.FC<EditorProps> = ({ articleToEdit, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [formData, setFormData] = useState<Article>(articleToEdit || {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    author: 'Admin',
    category: 'General',
    status: 'draft',
    date: new Date().toISOString(),
  });

  const handleChange = (field: keyof Article, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadImageToRemote(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'published' | 'draft') => {
    try {
      setLoading(true);
      await saveArticle({ ...formData, status, date: new Date().toISOString() });
      onNavigate(AppRoute.DASHBOARD);
    } catch (error) {
      alert("Failed to save article.");
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      setAiLoading(true);
      const result = await generateNewsArticle(aiPrompt);
      setFormData(prev => ({
        ...prev,
        title: result.title,
        content: result.content,
        excerpt: result.excerpt
      }));
      setAiPrompt('');
    } catch (error) {
      alert("AI Generation failed. Please try a different prompt.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-screen overflow-y-auto pb-32">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#f8fafc] z-10 py-4">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-medium transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('published')}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-brand-gold text-white rounded-lg hover:bg-yellow-600 font-medium transition-colors shadow-lg shadow-yellow-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{articleToEdit ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Enter a captivating headline..."
              className="w-full text-2xl font-serif font-bold p-2 border-b-2 border-gray-100 focus:border-brand-gold outline-none placeholder-gray-300"
            />
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea 
                value={formData.content}
                onChange={e => handleChange('content', e.target.value)}
                placeholder="Write your story here..."
                className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none resize-none font-serif leading-relaxed text-lg text-gray-700"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center space-x-2 mb-4">
                <Wand2 className="text-brand-gold" size={20} />
                <h3 className="font-bold text-gray-900">AI Writer Assistant</h3>
             </div>
             <p className="text-sm text-gray-500 mb-4">
               Connected to Cloudflare Worker <code>/functions/generate</code> via Gemini 3 Flash.
             </p>
             <div className="flex space-x-2">
               <input 
                 type="text" 
                 value={aiPrompt}
                 onChange={e => setAiPrompt(e.target.value)}
                 placeholder="e.g., 'Recent tech developments in renewable energy'"
                 className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                 onKeyDown={e => e.key === 'Enter' && handleAiGenerate()}
               />
               <button 
                 onClick={handleAiGenerate}
                 disabled={aiLoading || !aiPrompt}
                 className="bg-gray-900 text-white px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
               >
                 {aiLoading ? <Loader2 className="animate-spin" size={20} /> : 'Generate'}
               </button>
             </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>
            <div className="relative w-full aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors group">
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Click to replace</p>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-400">Upload Cover Image</p>
                </>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {formData.imageUrl && (
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Image synced to Database
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Meta Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Excerpt</label>
                <textarea 
                  value={formData.excerpt}
                  onChange={e => handleChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-gold"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-gold bg-white"
                >
                  <option>General</option>
                  <option>Technology</option>
                  <option>Politics</option>
                  <option>Lifestyle</option>
                  <option>Sports</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

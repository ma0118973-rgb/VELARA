import React, { useEffect, useState } from 'react';
import { Article, AppRoute } from '../types';
import { fetchArticles, deleteArticle } from '../services/dbService';
import { Edit2, Trash2, Eye, Plus, Search } from 'lucide-react';

interface DashboardProps {
  onNavigate: (route: AppRoute, articleId?: string) => void;
  onEdit: (article: Article) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onEdit }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id);
      await loadData();
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Articles</h2>
          <p className="text-gray-500 mt-1">Manage your news content and publications.</p>
        </div>
        <button 
          onClick={() => onNavigate(AppRoute.EDITOR)}
          className="flex items-center space-x-2 bg-brand-dark text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>New Article</span>
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Published</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{articles.filter(a => a.status === 'published').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Drafts</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{articles.filter(a => a.status === 'draft').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Views</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12.5K</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading articles from Neon DB...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No articles found. Create one to get started.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {article.imageUrl && (
                        <img src={article.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(article)} className="p-1 text-gray-400 hover:text-brand-gold">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

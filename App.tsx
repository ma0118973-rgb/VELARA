import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Article, AppRoute } from './types';
import { Lock } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [route, setRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '334510') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const navigateTo = (newRoute: AppRoute, articleId?: string) => {
    setRoute(newRoute);
    if (newRoute === AppRoute.EDITOR && !articleId) {
      setEditingArticle(undefined);
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setRoute(AppRoute.EDITOR);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setRoute(AppRoute.DASHBOARD);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">VELARA</h1>
            <p className="text-gray-500 text-sm tracking-widest uppercase">Admin Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all"
                  placeholder="Enter 6-digit code"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-6 text-center">
             <p className="text-xs text-gray-400">Secure connection to Neon DB</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <Sidebar currentRoute={route} onNavigate={navigateTo} onLogout={handleLogout} />
      
      <main className="flex-1 ml-64">
        {route === AppRoute.DASHBOARD && (
          <Dashboard onNavigate={navigateTo} onEdit={handleEditArticle} />
        )}
        {route === AppRoute.EDITOR && (
          <Editor articleToEdit={editingArticle} onNavigate={navigateTo} />
        )}
      </main>
    </div>
  );
}

import React, { useState, useMemo, useCallback } from 'react';
import { Search, Loader2, Bookmark, Rss, Star } from 'lucide-react';
import { NEWS_ARTICLES } from '../constants';
import type { NewsArticle, NewsCategory } from '../types';
import { summarizeArticle } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>('bookmarkedNews', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'All' | 'Bookmarked'>('All');
  const [summarizingId, setSummarizingId] = useState<number | null>(null);

  const categories: (NewsCategory | 'All' | 'Bookmarked')[] = ['All', 'JEE', 'Current Affairs', 'Education Policy', 'Bookmarked'];

  const filteredArticles = useMemo(() => {
    return articles
      .filter(article => {
        if (activeCategory === 'All') return true;
        if (activeCategory === 'Bookmarked') return bookmarkedIds.includes(article.id);
        return article.category === activeCategory;
      })
      .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [articles, activeCategory, searchTerm, bookmarkedIds]);

  const handleSummarize = useCallback(async (articleId: number) => {
    setSummarizingId(articleId);
    const article = articles.find(a => a.id === articleId);
    if (article && !article.summary) {
      const summary = await summarizeArticle(article.content);
      setArticles(prev =>
        prev.map(a => (a.id === articleId ? { ...a, summary } : a))
      );
    }
    setSummarizingId(null);
  }, [articles]);
  
  const toggleBookmark = (articleId: number) => {
    setBookmarkedIds(prev =>
        prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-secondary-100 dark:bg-secondary-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <Button variant="ghost" onClick={() => alert("Add RSS Feed feature coming soon!")}>
              <Rss size={16} className="mr-2" /> Add Source
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => (
                <Button key={cat} size="sm" variant={activeCategory === cat ? 'primary' : 'secondary'} onClick={() => setActiveCategory(cat)}>
                    {cat}
                </Button>
            ))}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.length > 0 ? filteredArticles.map(article => (
          <Card key={article.id} className="flex flex-col">
            {article.imageUrl && (
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover"/>
            )}
            <div className="p-4 md:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-2 flex-1">{article.title}</h3>
                  <Button variant="ghost" size="sm" onClick={() => toggleBookmark(article.id)} className="ml-2 -mt-2 -mr-2">
                      <Bookmark size={20} className={bookmarkedIds.includes(article.id) ? 'fill-yellow-400 text-yellow-500' : ''}/>
                  </Button>
                </div>
                <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mt-1 mb-3">
                  <span>{article.source}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                  {article.credibility && <><span className="mx-2">•</span> <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500"/> {article.credibility}/5</span></>}
                </div>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4 flex-grow">{article.content}</p>
              <div className="mt-auto">
                {article.summary && (
                  <div className="p-3 bg-primary-50 dark:bg-secondary-700 border-l-4 border-primary-500 rounded-r-lg mb-4">
                    <p className="font-semibold text-primary-800 dark:text-primary-200 text-sm">Summary:</p>
                    <p className="text-primary-700 dark:text-primary-300 italic">{article.summary}</p>
                  </div>
                )}
                {!article.summary && (
                  <Button onClick={() => handleSummarize(article.id)} size="sm" disabled={summarizingId === article.id}>
                    {summarizingId === article.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      'Summarize'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )) : (
          <Card className="p-6 text-center text-secondary-500 dark:text-secondary-400 md:col-span-2">
            No articles found matching your criteria.
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
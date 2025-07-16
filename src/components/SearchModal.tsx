import React, { useState, useEffect, useRef } from 'react';
import { X, Search, BookOpen, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPage: (page: number) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPage
}) => {
  const { searchTerm, setSearchTerm, searchResults, isSearching, clearSearch, hasResults } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      handleResultClick(searchResults[selectedIndex].verse.page);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (page: number) => {
    onNavigateToPage(page);
    onClose();
  };

  const handleClose = () => {
    clearSearch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 sm:pt-20" dir="rtl">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search size={20} className="sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-bold">البحث في القرآن الكريم</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 sm:w-5 sm:h-5" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث عن كلمة أو عبارة في القرآن الكريم... (بدون تشكيل)"
              className="w-full pr-10 pl-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base sm:text-lg"
              dir="rtl"
            />
            {isSearching && (
              <Loader2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin sm:w-5 sm:h-5" />
            )}
          </div>
          {searchTerm && searchTerm.length >= 2 && (
            <p className="text-sm text-emerald-600 mt-2">
              {isSearching ? 'جاري البحث...' : hasResults ? `تم العثور على ${searchResults.length} نتيجة${searchResults.length === 100 ? ' (أول 100 نتيجة)' : ''}` : 'لم يتم العثور على نتائج'}
            </p>
          )}
          {searchTerm && searchTerm.length < 2 && (
            <p className="text-sm text-orange-600 mt-2">
              يرجى إدخال حرفين على الأقل للبحث
            </p>
          )}
          {searchTerm.length >= 2 && (
            <p className="text-xs text-gray-500 mt-1">
              💡 يمكنك البحث بدون تشكيل - مثلاً: اكتب "الله" للعثور على "ٱللَّهِ"
            </p>
          )}
        </div>

        {/* Search Results */}
        <div ref={resultsRef} className="max-h-80 sm:max-h-96 overflow-y-auto">
          {!searchTerm || searchTerm.length < 2 ? (
            <div className="text-center py-8 sm:py-12">
              <Search size={48} className="text-gray-300 mx-auto mb-4 sm:w-16 sm:h-16" />
              <p className="text-gray-500 text-base sm:text-lg">ابدأ بكتابة كلمة للبحث في القرآن الكريم</p>
              <div className="text-gray-400 text-sm mt-2 space-y-1">
                <p>يمكنك البحث عن أي كلمة أو عبارة في النص القرآني</p>
                <p className="text-emerald-600">✨ البحث يعمل بدون تشكيل - اكتب الكلمة بشكل عادي</p>
              </div>
            </div>
          ) : searchResults.length === 0 && !isSearching ? (
            <div className="text-center py-8 sm:py-12">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4 sm:w-16 sm:h-16" />
              <p className="text-gray-500 text-base sm:text-lg">لم يتم العثور على نتائج</p>
              <div className="text-gray-400 text-sm mt-2 space-y-1">
                <p>جرب البحث بكلمات أخرى أو تأكد من الإملاء</p>
                <p className="text-blue-600">💡 تذكر: يمكنك البحث بدون تشكيل</p>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.verse.surah}-${result.verse.ayah}`}
                  onClick={() => handleResultClick(result.verse.page)}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-200 group active:scale-[0.98] ${
                    index === selectedIndex
                      ? 'bg-emerald-50 border-emerald-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Surah and Ayah Info */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                          {result.verse.surah}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-emerald-700 min-w-0">
                          <span className="font-semibold truncate">{result.surahInfo.arabicName}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="whitespace-nowrap">الآية {result.verse.ayah}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <MapPin size={10} className="sm:w-3 sm:h-3" />
                            صفحة {result.verse.page}
                          </span>
                        </div>
                      </div>
                      
                      {/* Verse Text with Highlighting */}
                      <div 
                        className="text-sm sm:text-lg leading-relaxed text-gray-800 mb-2 line-clamp-3"
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                      />
                      
                      {/* Additional Info */}
                      <div className="flex items-center gap-2 sm:gap-4 text-xs text-emerald-600">
                        <span className="truncate">{result.surahInfo.englishName}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">{result.surahInfo.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                      </div>
                    </div>
                    
                    {/* Navigation Arrow - RTL */}
                    <ArrowLeft 
                      size={16} 
                      className="text-emerald-500 group-hover:text-emerald-700 group-hover:-translate-x-1 transition-all duration-200 flex-shrink-0 mt-2 sm:w-5 sm:h-5" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              استخدم الأسهم للتنقل، Enter للانتقال إلى الصفحة، Escape للإغلاق
              {searchResults.length === 100 && ' • يتم عرض أول 100 نتيجة فقط'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
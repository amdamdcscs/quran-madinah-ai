import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Menu, X, Bookmark, BookmarkCheck, Navigation, Search, MoreHorizontal } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import BookmarkModal from './BookmarkModal';
import GoToPageModal from './GoToPageModal';
import SearchModal from './SearchModal';

interface QuranPageProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  onShowIndex: () => void;
  totalPages: number;
}

const QuranPage: React.FC<QuranPageProps> = ({ 
  currentPage, 
  onPageChange, 
  onShowIndex, 
  totalPages 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showGoToPage, setShowGoToPage] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { 
    bookmarks, 
    addBookmark, 
    removeBookmark, 
    isBookmarked, 
    getBookmarkForPage 
  } = useBookmarks();

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentPage]);

  // Auto-hide controls on mobile after 3 seconds of inactivity
  useEffect(() => {
    const resetHideTimer = () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
      
      setShowControls(true);
      
      // Only auto-hide on mobile/tablet
      if (window.innerWidth <= 1024) {
        const timeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
        setHideControlsTimeout(timeout);
      }
    };

    resetHideTimer();

    return () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
    };
  }, [currentPage]);

  // Show controls on any user interaction
  const handleUserInteraction = () => {
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
    setShowControls(true);
    
    if (window.innerWidth <= 1024) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setHideControlsTimeout(timeout);
    }
  };

  // Handle double-click to toggle controls
  const handleDoubleClick = () => {
    setShowControls(prev => !prev);
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handleNextPage();
    if (e.key === 'ArrowRight') handlePrevPage();
    if (e.key === 'Escape') onShowIndex();
    if (e.key === 'b' || e.key === 'B') handleToggleBookmark();
    if (e.key === 'g' || e.key === 'G') setShowGoToPage(true);
    if (e.key === 's' || e.key === 'S') setShowSearch(true);
    if (e.key === '/') {
      e.preventDefault();
      setShowSearch(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const handleToggleBookmark = () => {
    if (isBookmarked(currentPage)) {
      const bookmark = getBookmarkForPage(currentPage);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark(currentPage);
    }
  };

  const formatPageNumber = (page: number) => {
    return page.toString().padStart(3, '0');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    handleUserInteraction();
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col relative overflow-hidden"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onDoubleClick={handleDoubleClick}
    >
      {/* Desktop Header - Transparent overlay */}
      <header className={`hidden lg:block bg-white/60 backdrop-blur-sm border-b border-emerald-200/50 px-4 py-3 shadow-sm transition-all duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } absolute top-0 left-0 right-0 z-30`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onShowIndex}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600/90 text-white rounded-lg hover:bg-emerald-700/90 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
            >
              <Menu size={20} />
              <span>فهرس السور</span>
            </button>
            
            <button
              onClick={() => setShowBookmarks(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
            >
              <BookOpen size={20} />
              <span>العلامات</span>
              {bookmarks.length > 0 && (
                <span className="bg-blue-800/90 text-xs px-2 py-1 rounded-full">
                  {bookmarks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowGoToPage(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/90 text-white rounded-lg hover:bg-purple-700/90 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
            >
              <Navigation size={20} />
              <span>انتقال</span>
            </button>

            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600/90 text-white rounded-lg hover:bg-orange-700/90 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
            >
              <Search size={20} />
              <span>بحث</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-emerald-800 font-medium bg-white/70 px-3 py-1 rounded-lg backdrop-blur-sm">
              صفحة {currentPage} من {totalPages}
            </div>
            <div className="flex items-center gap-2 bg-emerald-100/70 px-3 py-1 rounded-full backdrop-blur-sm">
              <BookOpen size={16} className="text-emerald-600" />
              <span className="text-emerald-800 text-sm font-medium">المصحف الشريف</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Transparent overlay */}
      <header className={`lg:hidden bg-white/70 backdrop-blur-sm border-b border-emerald-200/50 shadow-lg transition-all duration-300 ease-in-out ${
        showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } absolute top-0 left-0 right-0 z-30`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleMobileMenu}
              className="p-2 bg-emerald-600/90 text-white rounded-lg shadow-md active:scale-95 transition-all duration-200 backdrop-blur-sm"
            >
              <MoreHorizontal size={20} />
            </button>
            
            <div className="flex items-center gap-2 bg-emerald-100/70 px-3 py-1 rounded-full backdrop-blur-sm">
              <BookOpen size={14} className="text-emerald-600" />
              <span className="text-emerald-800 text-sm font-medium">صفحة {currentPage}</span>
            </div>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg shadow-md transition-all duration-200 active:scale-95 backdrop-blur-sm ${
                isBookmarked(currentPage)
                  ? 'bg-yellow-500/90 text-white'
                  : 'bg-white/70 text-gray-600'
              }`}
            >
              {isBookmarked(currentPage) ? (
                <BookmarkCheck size={20} />
              ) : (
                <Bookmark size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="bg-white/80 border-t border-emerald-200/50 p-4 space-y-3 backdrop-blur-sm">
            <button
              onClick={() => {
                onShowIndex();
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600/90 text-white rounded-lg active:scale-95 transition-all duration-200 backdrop-blur-sm"
            >
              <Menu size={20} />
              <span>فهرس السور</span>
            </button>
            
            <button
              onClick={() => {
                setShowBookmarks(true);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/90 text-white rounded-lg active:scale-95 transition-all duration-200 backdrop-blur-sm"
            >
              <BookOpen size={20} />
              <span>العلامات المرجعية</span>
              {bookmarks.length > 0 && (
                <span className="bg-blue-800/90 text-xs px-2 py-1 rounded-full ml-auto">
                  {bookmarks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setShowGoToPage(true);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600/90 text-white rounded-lg active:scale-95 transition-all duration-200 backdrop-blur-sm"
            >
              <Navigation size={20} />
              <span>الانتقال إلى صفحة</span>
            </button>

            <button
              onClick={() => {
                setShowSearch(true);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600/90 text-white rounded-lg active:scale-95 transition-all duration-200 backdrop-blur-sm"
            >
              <Search size={20} />
              <span>البحث في القرآن</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-4">
        <div className="relative w-full max-w-4xl">
          {/* Page Image Container */}
          <div className="relative bg-white rounded-lg sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden border border-emerald-200">
            {!imageLoaded && !imageError && (
              <div className="aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-emerald-700 font-medium text-sm sm:text-base">جاري تحميل الصفحة...</p>
                </div>
              </div>
            )}
            
            {imageError && (
              <div className="aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-center">
                  <X size={32} className="text-red-500 mx-auto mb-4 sm:w-12 sm:h-12" />
                  <p className="text-red-700 font-medium text-sm sm:text-base">خطأ في تحميل الصفحة</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}
            
            <img
              src={`${import.meta.env.BASE_URL}quran_pages/${formatPageNumber(currentPage)}.png`}
              //src={`./quran_pages/${formatPageNumber(currentPage)}.png`}
              alt={`صفحة ${currentPage} من القرآن الكريم`}
              className={`w-full h-auto transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ display: imageError ? 'none' : 'block' }}
            />

            {/* Desktop Navigation Buttons - Transparent overlay */}



            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className={`hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-lg border border-emerald-200/50 hover:bg-emerald-50/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="الصفحة التالية"
            >
              < ChevronLeft size={24} className="text-emerald-700" />
            </button>

            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-lg border border-emerald-200/50 hover:bg-emerald-50/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="الصفحة السابقة"
            >
              <ChevronRight  size={24} className="text-emerald-700" />
            </button>

          </div>
        </div>
      </main>

      {/* Mobile Footer Navigation - Transparent overlay */}
      <footer className={`lg:hidden bg-white/70 backdrop-blur-sm border-t border-emerald-200/50 px-4 py-3 shadow-lg transition-all duration-300 ease-in-out ${
        showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } absolute bottom-0 left-0 right-0 z-30`}>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-md backdrop-blur-sm"
          >
            <ChevronRight size={16} />
            <span className="font-medium">السابقة</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/70 rounded-lg min-w-[80px] justify-center backdrop-blur-sm">
            <span className="text-emerald-800 font-medium text-sm">{currentPage}</span>
            <span className="text-emerald-600 text-sm">/</span>
            <span className="text-emerald-600 text-sm">{totalPages}</span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-md backdrop-blur-sm"
          >
            <span className="font-medium">التالية</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      </footer>

      {/* Desktop Footer Navigation - Transparent overlay */}
      <footer className={`hidden lg:block bg-white/60 backdrop-blur-sm border-t border-emerald-200/50 px-4 py-3 transition-all duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } absolute bottom-0 left-0 right-0 z-30`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/90 text-white rounded-lg hover:bg-emerald-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight size={16} />
            <span>السابقة</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/70 rounded-lg backdrop-blur-sm">
            <span className="text-emerald-800 font-medium">{currentPage}</span>
            <span className="text-emerald-600">/</span>
            <span className="text-emerald-600">{totalPages}</span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/90 text-white rounded-lg hover:bg-emerald-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
          >
            <span>التالية</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      </footer>

      {/* Modals */}
      <BookmarkModal
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        bookmarks={bookmarks}
        onBookmarkSelect={onPageChange}
        onBookmarkDelete={removeBookmark}
      />

      <GoToPageModal
        isOpen={showGoToPage}
        onClose={() => setShowGoToPage(false)}
        onPageSelect={onPageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onNavigateToPage={onPageChange}
      />
    </div>
  );
};

export default QuranPage;
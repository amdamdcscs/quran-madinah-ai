import React, { useState } from 'react';
import { X, Bookmark as BookmarkIcon, Trash2, Calendar } from 'lucide-react';
import { Bookmark } from '../types/quran';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onBookmarkSelect: (page: number) => void;
  onBookmarkDelete: (id: string) => void;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onBookmarkSelect,
  onBookmarkDelete
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookmarkIcon size={20} className="sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-bold">العلامات المرجعية</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          <p className="text-emerald-100 mt-2 text-sm sm:text-base">
            {bookmarks.length} علامة محفوظة
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-80 sm:max-h-96 overflow-y-auto">
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <BookmarkIcon size={48} className="text-gray-300 mx-auto mb-4 sm:w-16 sm:h-16" />
              <p className="text-gray-500 text-base sm:text-lg">لا توجد علامات مرجعية محفوظة</p>
              <p className="text-gray-400 text-sm mt-2">
                اضغط على أيقونة العلامة المرجعية لحفظ الصفحات المهمة
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-200 hover:border-emerald-300 transition-all duration-200 group active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div 
                      className="flex-1 cursor-pointer min-w-0"
                      onClick={() => {
                        onBookmarkSelect(bookmark.page);
                        onClose();
                      }}
                    >
                      <h3 className="font-semibold text-emerald-800 group-hover:text-emerald-900 text-sm sm:text-base truncate">
                        {bookmark.name}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-emerald-600">
                        <span className="whitespace-nowrap">صفحة {bookmark.page}</span>
                        <span className="flex items-center gap-1 truncate">
                          <Calendar size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="truncate">{formatDate(bookmark.dateAdded)}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onBookmarkDelete(bookmark.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 active:scale-95 flex-shrink-0"
                      title="حذف العلامة المرجعية"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkModal;
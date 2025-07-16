import React, { useState } from 'react';
import { X, Navigation, AlertCircle } from 'lucide-react';

interface GoToPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (page: number) => void;
  totalPages: number;
  currentPage: number;
}

const GoToPageModal: React.FC<GoToPageModalProps> = ({
  isOpen,
  onClose,
  onPageSelect,
  totalPages,
  currentPage
}) => {
  const [pageInput, setPageInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    
    if (isNaN(page)) {
      setError('يرجى إدخال رقم صحيح');
      return;
    }
    
    if (page < 1 || page > totalPages) {
      setError(`يرجى إدخال رقم بين 1 و ${totalPages}`);
      return;
    }
    
    onPageSelect(page);
    onClose();
    setPageInput('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
    setError('');
  };

  const handleClose = () => {
    onClose();
    setPageInput('');
    setError('');
  };

  const handleQuickNavigation = (page: number) => {
    onPageSelect(page);
    onClose();
    setPageInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation size={20} className="sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-bold">الانتقال إلى صفحة</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pageNumber" className="block text-sm font-medium text-gray-700 mb-2">
                رقم الصفحة (1 - {totalPages})
              </label>
              <input
                type="number"
                id="pageNumber"
                value={pageInput}
                onChange={handleInputChange}
                min="1"
                max={totalPages}
                placeholder={`الصفحة الحالية: ${currentPage}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-base sm:text-lg"
                autoFocus
                dir="ltr"
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors active:scale-95 text-sm sm:text-base"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium active:scale-95 text-sm sm:text-base"
              >
                انتقال
              </button>
            </div>
          </form>

          {/* Quick navigation suggestions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">انتقال سريع:</p>
            <div className="flex flex-wrap gap-2">
              {[1, 50, 100, 200, 300, 400, 500, 604].map((page) => (
                <button
                  key={page}
                  onClick={() => handleQuickNavigation(page)}
                  className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors active:scale-95"
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoToPageModal;
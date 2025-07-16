import React, { useState } from 'react';
import { Search, BookOpen, ArrowLeft, MapPin, X } from 'lucide-react';
import { Surah } from '../types/quran';

interface SurahIndexProps {
  surahs: Surah[];
  onSurahSelect: (startPage: number) => void;
  onClose: () => void;
}

const SurahIndex: React.FC<SurahIndexProps> = ({ surahs, onSurahSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = 
      surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.arabicName.includes(searchTerm) ||
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString().includes(searchTerm);
    
    const matchesType = selectedType === 'all' || surah.revelationType === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 px-4 py-4 sm:py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-emerald-600 sm:w-8 sm:h-8" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-emerald-800">فهرس سور القرآن الكريم</h1>
                <p className="text-emerald-600 text-sm sm:text-base">اختر السورة للانتقال إليها</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:px-6 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <X size={20} className="sm:hidden" />
              <span className="hidden sm:inline">إغلاق</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                placeholder="ابحث عن السورة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                dir="rtl"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'Meccan', 'Medinan'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                    selectedType === type
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/80 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {type === 'all' ? 'الكل' : type === 'Meccan' ? 'مكية' : 'مدنية'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Surah List */}
      <main className="max-w-6xl mx-auto p-3 sm:p-4 pb-20">
        <div className="grid gap-2 sm:gap-3 md:gap-4">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => onSurahSelect(surah.startPage)}
              className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Surah Number */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    <span className="text-sm sm:text-base">{surah.number}</span>
                  </div>
                  
                  {/* Surah Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="text-base sm:text-xl font-bold text-emerald-800 truncate">{surah.arabicName}</h3>
                      <span className="text-emerald-600 hidden sm:inline">•</span>
                      <h4 className="text-sm sm:text-lg text-emerald-700 truncate hidden sm:block">{surah.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-emerald-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                        {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                      </span>
                      <span>{surah.numberOfAyahs} آية</span>
                      <span className="hidden sm:inline">الصفحات {surah.startPage} - {surah.endPage}</span>
                    </div>
                    <p className="text-emerald-600 text-xs sm:text-sm mt-1 truncate sm:block hidden">{surah.englishName}</p>
                  </div>
                </div>
                
                {/* Arrow - RTL direction */}
                <ArrowLeft 
                  size={20} 
                  className="text-emerald-500 group-hover:text-emerald-700 group-hover:-translate-x-1 transition-all duration-200 flex-shrink-0 sm:w-6 sm:h-6" 
                />
              </div>
            </div>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-emerald-300 mx-auto mb-4 sm:w-16 sm:h-16" />
            <p className="text-emerald-600 text-base sm:text-lg">لم يتم العثور على سور تطابق البحث</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SurahIndex;
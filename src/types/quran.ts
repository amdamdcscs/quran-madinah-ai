export interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  startPage: number;
  endPage: number;
}

export interface QuranData {
  surahs: Surah[];
  totalPages: number;
}

export interface Bookmark {
  id: string;
  page: number;
  name: string;
  dateAdded: string;
  surahInfo?: {
    name: string;
    arabicName: string;
  };
}

export interface QuranVerse {
  surah: number;
  ayah: number;
  page: number;
  text: string;
}

export interface SearchResult {
  verse: QuranVerse;
  surahInfo: Surah;
  highlightedText: string;
}
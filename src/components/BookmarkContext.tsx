import { createContext, useContext, useEffect, useState } from 'react';

interface Bookmark {
  url: string;
  title: string;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  toggleBookmark: (url: string, title: string) => void;
  isBookmarked: (url: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  toggleBookmark: () => {},
  isBookmarked: () => false,
});

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  // Update localStorage when bookmarks change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (url: string, title: string) => {
    setBookmarks(prev => {
      const existingIndex = prev.findIndex(b => b.url === url);
      if (existingIndex >= 0) {
        return prev.filter(b => b.url !== url);
      } else {
        return [...prev, { url, title }];
      }
    });
  };

  const isBookmarked = (url: string) => {
    return bookmarks.some(b => b.url === url);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
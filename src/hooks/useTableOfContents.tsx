import { useEffect, useState } from 'react';

export const useTableOfContents = () => {
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const tocData = sections.map((section) => {
      const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
      return {
        id: section.id,
        text: heading?.textContent || '',
      };
    });
    setToc(tocData);
  }, []);

  return toc;
};
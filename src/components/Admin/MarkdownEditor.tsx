'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Code, Upload } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function MarkdownEditor({
  value,
  onChange,
  onImageUpload,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setUploading(true);
    try {
      const url = await onImageUpload(file);
      // Insert markdown image syntax at cursor position
      const imageMarkdown = `![${file.name}](${url})`;
      onChange(value + '\n\n' + imageMarkdown);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded ${
              activeTab === 'write'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {onImageUpload && (
          <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[400px] p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none font-mono text-sm"
            placeholder="Write your blog post in markdown..."
          />
        ) : (
          <div className="p-4 bg-white dark:bg-gray-900 min-h-[400px] overflow-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || '*Nothing to preview*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 p-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Supports Markdown syntax. Use **bold**, *italic*, # headings, - lists, [links](url), and more.
        </p>
      </div>
    </div>
  );
}

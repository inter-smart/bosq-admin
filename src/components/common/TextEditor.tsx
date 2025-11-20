import React, { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import Strike from "@tiptap/extension-strike";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  UnderlineIcon,
  AlignRight,
  X,
  Upload,
  Link2,
  Link as LinkIcon,
  ImageIcon,
  Strikethrough,
} from "lucide-react";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
  isEditing?: boolean;
}

const LinkModal: React.FC<LinkModalProps> = ({ 
  isOpen, 
  onClose, 
  onInsert, 
  initialUrl = '',
  initialText = '',
  isEditing = false
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
    }
  }, [isOpen, initialUrl, initialText]);

  const resetForm = () => {
    setUrl('');
    setText('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInsert = () => {
    if (!url.trim()) return;
    onInsert(url.trim(), text.trim() || undefined);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isEditing ? 'Edit Link' : 'Insert Link'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Text (optional)
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Link text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use the selected text
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!url.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update Link' : 'Insert Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, alt: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  onInsert, 
  onImageUpload 
}) => {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setImageUrl('');
    setAltText('');
    setSelectedFile(null);
    setImageSource('upload');
    setIsUploading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
      }
    }
  };

  const handleInsert = async () => {
    if (imageSource === 'url') {
      if (!imageUrl.trim()) return;
      onInsert(imageUrl, altText);
      handleClose();
    } else if (imageSource === 'upload' && selectedFile) {
      if (onImageUpload) {
        setIsUploading(true);
        try {
          const uploadedUrl = await onImageUpload(selectedFile);
          onInsert(uploadedUrl, altText);
          handleClose();
        } catch (error) {
          console.error('Upload failed:', error);
          setIsUploading(false);
        }
      } else {
        // Convert to base64 for local use
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          onInsert(src, altText);
          handleClose();
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const canInsert = imageSource === 'url' 
    ? imageUrl.trim() !== '' 
    : selectedFile !== null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Image source selection */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          
            <button
              type="button"
              onClick={() => setImageSource('upload')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                imageSource === 'upload'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="inline-block w-4 h-4 mr-1" />
              Upload
            </button>
              <button
              type="button"
              onClick={() => setImageSource('url')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                imageSource === 'url'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link2 className="inline-block w-4 h-4 mr-1" />
              URL
            </button>
          </div>

          {/* URL input */}
          {imageSource === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* File upload */}
          {imageSource === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                <Upload className="inline-block w-4 h-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choose file'}
              </button>
            </div>
          )}

          {/* Alt text input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Help screen readers understand what the image shows
            </p>
          </div>

          {/* Preview */}
          {((imageSource === 'url' && imageUrl) || (imageSource === 'upload' && selectedFile)) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              <div className="border border-gray-200 rounded-md p-2">
                <img
                  src={imageSource === 'url' ? imageUrl : selectedFile ? URL.createObjectURL(selectedFile) : ''}
                  alt={altText || 'Preview'}
                  className="max-w-full h-32 object-contain rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!canInsert || isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Insert Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>; // Optional custom upload handler
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder,
  onImageUpload 
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
const CustomListItem = ListItem.extend({
  content: "(paragraph | heading) block*",
});
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading to use our own configuration
        bulletList: false, // Disable default bullet list
        orderedList: false, // Disable default ordered list
        listItem: false, // Disable default list item
        strike: false, // Disable default strike to use our own configuration
        paragraph: {
          HTMLAttributes: {
            class: "mb-0",
          },
        },
        hardBreak: {
          HTMLAttributes: {
            class: "hard-break",
          },
          keepMarks: true,
        },
      }),

      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], // Enable headings from h1 to h6
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-4",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-4",
        },
      }),
      CustomListItem,
      Underline,
      Strike.configure({
        HTMLAttributes: {
          class: "line-through",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "", // Ensure we have a default value
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none outline-none",
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          // Insert hard break on single Enter press
          event.preventDefault();
          editor?.chain().focus().splitBlock().run();
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior for other keys
      },
      handleDrop: (view, event, slice, moved) => {
        const files = Array.from(event.dataTransfer?.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
          event.preventDefault();
          imageFiles.forEach(file => handleImageFile(file));
          return true;
        }
        
        return false;
      },
      handlePaste: (view, event, slice) => {
        const files = Array.from(event.clipboardData?.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
          event.preventDefault();
          imageFiles.forEach(file => handleImageFile(file));
          return true;
        }
        
        return false;
      },
    },
  });

  // Handle image file processing (for drag/drop and paste)
  const handleImageFile = useCallback(async (file: File) => {
    if (!editor) return;

    const altText = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension for alt text

    if (onImageUpload) {
      // Use custom upload handler if provided
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url, alt: altText }).run();
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    } else {
      // Convert to base64 for local use
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        editor.chain().focus().setImage({ src, alt: altText }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor, onImageUpload]);

  // Handle image insertion from modal
  const handleImageInsert = useCallback((src: string, alt: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src, alt }).run();
  }, [editor]);

  // Handle link insertion from modal
  const handleLinkInsert = useCallback((url: string, text?: string) => {
    if (!editor) return;
    
    const selection = editor.state.selection;
    const hasSelection = !selection.empty;
    
    if (hasSelection) {
      // If text is selected, just add the link to selected text
      editor.chain().focus().setLink({ href: url }).run();
    } else if (text) {
      // If no selection but text provided, insert new text with link
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      // If no selection and no text, insert the URL as both href and text
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    }
  }, [editor]);

  // Handle link button click
  const handleLinkClick = useCallback(() => {
    if (!editor) return;
    
    const selection = editor.state.selection;
    const hasSelection = !selection.empty;
    
    if (hasSelection) {
      // Check if current selection already has a link
      const isLink = editor.isActive('link');
      if (isLink) {
        // Remove link
        editor.chain().focus().unsetLink().run();
        return;
      }
    }
    
    // Open link modal
    setIsLinkModalOpen(true);
  }, [editor]);

  // Sync editor content with value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="tiptap-editor-wrapper border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-gray-300">
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 4 }) ? "bg-gray-200" : ""}`}
            title="Heading 4"
          >
            <Heading4 size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 5 }) ? "bg-gray-200" : ""}`}
            title="Heading 5"
          >
            <Heading5 size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 6 }) ? "bg-gray-200" : ""}`}
            title="Heading 6"
          >
            <Heading6 size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

          {/* Link button */}
          <button
            type="button"
            onClick={handleLinkClick}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
            title={editor.isActive("link") ? "Remove Link" : "Insert Link"}
          >
            <LinkIcon size={16} />
          </button>

          {/* Image button - now opens modal */}
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Image"
          >
            <ImageIcon size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>
        <EditorContent
          editor={editor}
          className="tiptap-editor-content prose prose-sm max-w-none p-4 min-h-[200px] focus-within:outline-none focus-within:ring-0"
        />
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleImageInsert}
        onImageUpload={onImageUpload}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleLinkInsert}
      />
    </>
  );
};

export default RichTextEditor;
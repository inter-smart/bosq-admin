import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Smile,
  Link as LinkIcon,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconSelector } from "./IconSelector";
import { ImageUploadModal } from "./ImageUploadModal";

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  maxLength?: number;
  dir?: "ltr" | "rtl";
}

export function RichTextEditor({
  label,
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
  required = false,
  maxLength,
  dir = "ltr",
}: RichTextEditorProps) {
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const textContent = editor.getText();

      if (maxLength && textContent.length > maxLength) {
        // Truncate content to maxLength
        const truncatedText = textContent.substring(0, maxLength);
        editor.commands.setContent(truncatedText);
        return;
      }

      onChange(content);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3",
          // Text styles
          "prose-p:text-foreground prose-p:leading-7 prose-p:my-2",
          "prose-strong:text-foreground prose-strong:font-bold",
          "prose-em:text-foreground prose-em:italic",
          // Headings
          "prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h1:text-4xl prose-h1:mt-6 prose-h1:mb-4",
          "prose-h2:text-3xl prose-h2:mt-5 prose-h2:mb-3",
          "prose-h3:text-2xl prose-h3:mt-4 prose-h3:mb-2",
          "prose-h4:text-xl prose-h4:mt-3 prose-h4:mb-2",
          // Lists
          "prose-ul:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-ul:my-3",
          "prose-ol:text-foreground prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-3",
          "prose-li:text-foreground prose-li:my-1 prose-li:leading-7",
          "prose-li:marker:text-foreground",
          // Blockquotes
          "prose-blockquote:text-muted-foreground prose-blockquote:border-l-4",
          "prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-blockquote:my-4 prose-blockquote:py-1",
          // Links
          "prose-a:text-primary prose-a:underline prose-a:underline-offset-4",
          "prose-a:decoration-primary/50 hover:prose-a:decoration-primary",
          "prose-a:transition-colors prose-a:cursor-pointer",
          // Images
          "prose-img:rounded-md prose-img:border prose-img:border-border",
          "prose-img:my-4 prose-img:shadow-sm prose-img:max-w-full prose-img:h-auto",
          // Code
          "prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5",
          "prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
          "prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4",
          "prose-pre:rounded-lg prose-pre:my-4 prose-pre:overflow-x-auto",
          // Horizontal rule
          "prose-hr:border-border prose-hr:my-6",
          // Fallback classes for direct elements
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3",
          "[&_li]:my-1 [&_li]:leading-7",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
          "[&_img]:rounded-md [&_img]:border [&_img]:max-w-full",
          "[&_strong]:font-bold [&_em]:italic",
          "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3",
          "[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2"
        ),
        dir: dir,
      },

      handleKeyDown: (view, event) => {
        if (maxLength) {
          const currentLength = editor?.getText().length || 0;

          // Allow backspace, delete, and navigation keys
          if (
            [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
            ].includes(event.key)
          ) {
            return false;
          }

          // Allow Ctrl/Cmd shortcuts
          if (event.ctrlKey || event.metaKey) {
            return false;
          }

          // Prevent new characters if at max length
          if (currentLength >= maxLength && event.key.length === 1) {
            event.preventDefault();
            return true;
          }
        }

        return false;
      },
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleIconSelect = (iconName: string, iconSvg: string) => {
    if (editor) {
      const iconHtml = `<span class="inline-flex items-center justify-center w-4 h-4 mx-1" data-icon="${iconName}" title="${iconName}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- ${iconName} icon placeholder -->
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </span>`;
      editor.chain().focus().insertContent(iconHtml).run();
    }
  };

  const handleImageInsert = (src: string, alt: string, title?: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src, alt, title }).run();
    }
  };

  const handleLinkToggle = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="border rounded-md">
        {/* Toolbar */}
        <div className="border-b bg-muted/50 p-2">
          <div
            className={cn(
              "flex flex-wrap gap-1",
              dir === "rtl" && "flex-row-reverse"
            )}
          >
            {/* Text Formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            {/* Text Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 relative"
                >
                  <Palette className="h-4 w-4" />
                  {editor.getAttributes("textStyle").color && (
                    <div
                      className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                      style={{
                        backgroundColor:
                          editor.getAttributes("textStyle").color,
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Color Picker
                    </Label>
                    <input
                      type="color"
                      value={
                        editor.getAttributes("textStyle").color || "#000000"
                      }
                      className="w-full h-10 rounded border border-input bg-background cursor-pointer"
                      onChange={(e) =>
                        editor.chain().focus().setColor(e.target.value).run()
                      }
                      title="Select color"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Hex Color
                    </Label>
                    <input
                      type="text"
                      placeholder="#000000"
                      defaultValue={
                        editor.getAttributes("textStyle").color || ""
                      }
                      className="w-full px-3 py-2 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      onChange={(e) => {
                        const color = e.target.value;
                        if (color.match(/^#[0-9A-F]{6}$/i)) {
                          editor.chain().focus().setColor(color).run();
                        }
                      }}
                      onBlur={(e) => {
                        const color = e.target.value;
                        if (color && !color.startsWith("#")) {
                          e.target.value = "#" + color;
                        }
                      }}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    className="w-full"
                  >
                    Reset Color
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="mx-1 h-8" />

            {/* Headings */}
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
            >
              <Type className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-8" />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-8" />

            {/* Media & Links */}
            <ToolbarButton onClick={() => setShowImageModal(true)}>
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton onClick={() => setShowIconSelector(true)}>
              <Smile className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={handleLinkToggle}
              isActive={editor.isActive("link")}
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-8" />

            {/* Undo/Redo */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor */}
        <EditorContent
          editor={editor}
          className="min-h-[120px]"
          placeholder={placeholder}
        />

        {/* Character counter */}
        {maxLength && (
          <div
            className={cn(
              "px-3 py-2 border-t bg-muted/30 text-sm text-muted-foreground",
              dir === "rtl" ? "text-left" : "text-right"
            )}
          >
            {editor?.getText().length || 0}/{maxLength} characters
          </div>
        )}
      </div>

      {/* Modals */}
      <IconSelector
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelectIcon={handleIconSelect}
      />

      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsertImage={handleImageInsert}
      />
    </div>
  );
}

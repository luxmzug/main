'use client';

import type React from 'react';
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkMark from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { InternalPostPicker } from '@/components/admin/InternalPostPicker';
import { buildLinkRel } from '@/lib/link-rel';
import type { InternalLinkPost } from '@/lib/posts';

const ToolbarButton = (props: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className={`rounded px-2 py-1 text-xs font-semibold ${
        props.active ? 'bg-gold text-navy' : 'bg-navy/5 text-navy hover:bg-navy/10'
      }`}
      onClick={props.onClick}
      type="button"
    >
      {props.children}
    </button>
  );
};

/**
 * Splits HTML tags onto separate lines for the source textarea.
 */
const toSourceHtml = (html: string) => {
  return html.replace(/></g, '>\n<').trim();
};

export const RichTextEditor = (props: {
  initialHtml: string;
  onChange: (html: string) => void;
  internalPosts: InternalLinkPost[];
}) => {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [html, setHtml] = useState(toSourceHtml(props.initialHtml));
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkMode, setLinkMode] = useState<'external' | 'internal'>('external');
  const [linkHref, setLinkHref] = useState('');
  const [linkNofollow, setLinkNofollow] = useState(true);
  const [linkNewTab, setLinkNewTab] = useState(false);
  const [linkQuery, setLinkQuery] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      LinkMark.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: 'nofollow',
        },
      }),
      Placeholder.configure({
        placeholder: 'Beitragstext schreiben…',
      }),
    ],
    content: props.initialHtml,
    onUpdate: (update) => {
      const next = update.editor.getHTML();
      setHtml(toSourceHtml(next));
      props.onChange(next);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  const showVisual = () => {
    if (mode === 'visual') {
      return;
    }
    editor?.commands.setContent(html);
    props.onChange(html);
    setMode('visual');
  };

  const showHtml = () => {
    if (mode === 'html') {
      return;
    }
    const next = toSourceHtml(editor?.getHTML() ?? html);
    setHtml(next);
    props.onChange(next);
    setMode('html');
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">
        <ToolbarButton active={mode === 'visual'} onClick={showVisual}>
          Editor
        </ToolbarButton>
        <ToolbarButton active={mode === 'html'} onClick={showHtml}>
          {'</>'} HTML
        </ToolbarButton>
      </div>

      {mode === 'html' ? (
        <div>
          <textarea
            aria-label="HTML-Quelltext"
            className="admin-html-source"
            onChange={(event) => {
              const next = event.target.value;
              setHtml(next);
              props.onChange(next);
            }}
            spellCheck={false}
            value={html}
          />
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Vollständiges HTML des Beitragstextes inklusive Links. Bilder über das Titelbild-Feld
            hochladen. Schema Markup nicht hier einfügen, sondern im eigenen Feld darunter.
          </p>
        </div>
      ) : null}

      <div className={mode === 'visual' ? undefined : 'hidden'}>
        <div className="mb-2 flex flex-wrap gap-1">
            <ToolbarButton
              active={editor?.isActive('bold')}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              Fett
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('italic')}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              Kursiv
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('heading', { level: 2 })}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('heading', { level: 3 })}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('bulletList')}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              Liste
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('orderedList')}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              Nummeriert
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('blockquote')}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              Zitat
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('link')}
              onClick={() => {
                const attrs = editor?.getAttributes('link') ?? {};
                const href = typeof attrs.href === 'string' ? attrs.href : '';
                const rel = typeof attrs.rel === 'string' ? attrs.rel : '';
                const isInternal = href.startsWith('/blog/');
                setLinkHref(href);
                setLinkMode(isInternal ? 'internal' : 'external');
                setLinkNofollow(isInternal ? false : rel === '' ? true : /\bnofollow\b/i.test(rel));
                setLinkNewTab(isInternal ? false : attrs.target === '_blank');
                setLinkQuery('');
                setLinkOpen(true);
              }}
            >
              Link
            </ToolbarButton>
          </div>

          {linkOpen ? (
            <div className="mb-3 rounded-lg border border-navy/15 bg-cream p-4">
              <p className="admin-label">Link einfügen</p>
              <div className="mt-2 flex gap-2">
                <button
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    linkMode === 'external' ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'
                  }`}
                  onClick={() => {
                    setLinkMode('external');
                    setLinkNofollow(true);
                  }}
                  type="button"
                >
                  Externer Link
                </button>
                <button
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    linkMode === 'internal' ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'
                  }`}
                  onClick={() => {
                    setLinkMode('internal');
                    setLinkNofollow(false);
                    setLinkNewTab(false);
                  }}
                  type="button"
                >
                  Interner Link
                </button>
              </div>

              <fieldset className="mt-3">
                <legend className="mb-2 text-xs text-muted">SEO-Attribut</legend>
                <div className="flex flex-wrap gap-4 text-sm text-navy">
                  <label className="flex items-center gap-2">
                    <input
                      checked={!linkNofollow}
                      name="link-follow"
                      onChange={() => setLinkNofollow(false)}
                      type="radio"
                    />
                    Dofollow
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      checked={linkNofollow}
                      name="link-follow"
                      onChange={() => setLinkNofollow(true)}
                      type="radio"
                    />
                    Nofollow
                  </label>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Interne Links sind standardmäßig Dofollow. Externe Links standardmäßig Nofollow.
                </p>
              </fieldset>
              <label className="mt-3 flex items-center gap-2 text-sm text-navy">
                <input
                  checked={linkNewTab}
                  onChange={(event) => setLinkNewTab(event.target.checked)}
                  type="checkbox"
                />
                In neuem Tab öffnen
              </label>

              {linkMode === 'external' ? (
                <label className="mt-3 block">
                  <span className="mb-1 block text-xs text-muted">URL (andere Blogs, Websites)</span>
                  <input
                    className="admin-input"
                    onChange={(event) => setLinkHref(event.target.value)}
                    placeholder="https://"
                    type="url"
                    value={linkHref}
                  />
                </label>
              ) : (
                <InternalPostPicker
                  onQuery={setLinkQuery}
                  onSelect={(post) => {
                    const href = `/blog/${post.slug}/`;
                    const rel = buildLinkRel({ nofollow: linkNofollow, newTab: linkNewTab });
                    const selectionEmpty = editor?.state.selection.empty ?? true;
                    if (selectionEmpty) {
                      editor
                        ?.chain()
                        .focus()
                        .insertContent({
                          type: 'text',
                          text: post.title,
                          marks: [
                            {
                              type: 'link',
                              attrs: {
                                href,
                                target: linkNewTab ? '_blank' : null,
                                rel: rel || null,
                              },
                            },
                          ],
                        })
                        .run();
                    } else {
                      editor
                        ?.chain()
                        .focus()
                        .extendMarkRange('link')
                        .setLink({
                          href,
                          target: linkNewTab ? '_blank' : null,
                          rel: rel || null,
                        })
                        .run();
                    }
                    setLinkOpen(false);
                  }}
                  posts={props.internalPosts}
                  query={linkQuery}
                />
              )}

              {linkMode === 'external' ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="btn-gold !px-3 !py-2"
                    onClick={() => {
                      const href = linkHref.trim();
                      if (!href) {
                        return;
                      }
                      const rel = buildLinkRel({ nofollow: linkNofollow, newTab: linkNewTab });
                      editor
                        ?.chain()
                        .focus()
                        .extendMarkRange('link')
                        .setLink({
                          href,
                          target: linkNewTab ? '_blank' : null,
                          rel: rel || null,
                        })
                        .run();
                      setLinkOpen(false);
                    }}
                    type="button"
                  >
                    Link setzen
                  </button>
                  {editor?.isActive('link') ? (
                    <button
                      className="btn-gold-outline !px-3 !py-2 !text-navy"
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setLinkOpen(false);
                      }}
                      type="button"
                    >
                      Link entfernen
                    </button>
                  ) : null}
                  <button
                    className="rounded-md px-3 py-2 text-sm text-muted hover:text-navy"
                    onClick={() => setLinkOpen(false)}
                    type="button"
                  >
                    Abbrechen
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {editor?.isActive('link') ? (
                    <button
                      className="btn-gold-outline !px-3 !py-2 !text-navy"
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setLinkOpen(false);
                      }}
                      type="button"
                    >
                      Link entfernen
                    </button>
                  ) : null}
                  <button
                    className="rounded-md px-3 py-2 text-sm text-muted hover:text-navy"
                    onClick={() => setLinkOpen(false)}
                    type="button"
                  >
                    Abbrechen
                  </button>
                </div>
              )}
            </div>
          ) : null}

          <EditorContent editor={editor} />
      </div>
    </div>
  );
};

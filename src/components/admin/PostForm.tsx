'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { COVER_MAX_MB, COVER_RECOMMENDED_KB, coverImageError } from '@/lib/cover-image';
import type { Category, InternalLinkPost, PostRecord } from '@/lib/posts';
import { slugify } from '@/lib/slug';
import type { PostStatus } from '@/lib/post-status';
import { toDateTimeLocalVienna } from '@/lib/vienna-time';

export const PostForm = (props: {
  post?: PostRecord;
  categories: Category[];
  internalPosts: InternalLinkPost[];
}) => {
  const router = useRouter();
  const isNew = !props.post;
  const [title, setTitle] = useState(props.post?.title ?? '');
  const [slug, setSlug] = useState(props.post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(props.post));
  const [description, setDescription] = useState(props.post?.description ?? '');
  const [content, setContent] = useState(props.post?.content ?? '');
  const [categoryId, setCategoryId] = useState(
    props.post?.categoryId ? String(props.post.categoryId) : String(props.categories[0]?.id ?? ''),
  );
  const [categories, setCategories] = useState(props.categories);
  const [newCategory, setNewCategory] = useState('');
  const [schemaJson, setSchemaJson] = useState(props.post?.schemaJson ?? '');
  const [publishedAt, setPublishedAt] = useState(
    props.post?.publishedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  );
  const [publishedAtTime, setPublishedAtTime] = useState(
    props.post ? toDateTimeLocalVienna(props.post.publishedAt).split('T')[1] ?? '09:00' : '09:00',
  );
  const [publishMode, setPublishMode] = useState<'auto' | 'manual'>(isNew ? 'auto' : 'manual');
  const [status, setStatus] = useState<PostStatus>(props.post?.status ?? 'scheduled');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [showCoverOnDetail, setShowCoverOnDetail] = useState(props.post?.showCoverOnDetail ?? true);
  const [coverAlt, setCoverAlt] = useState(props.post?.coverAlt ?? '');

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const coverInput = form.elements.namedItem('cover');
        const coverFile =
          coverInput instanceof HTMLInputElement && coverInput.files?.[0]
            ? coverInput.files[0]
            : null;

        if (isNew && !coverFile) {
          setError('Ein Titelbild ist für neue Beiträge Pflicht.');
          return;
        }

        if (coverFile) {
          const coverError = coverImageError(coverFile);
          if (coverError) {
            setError(coverError);
            return;
          }
        }

        if ((isNew || coverFile) && coverAlt.trim().length < 3) {
          setError('Bitte einen Alt-Text für das Titelbild angeben.');
          return;
        }

        const body = new FormData();
        body.set('title', title);
        body.set('slug', slug);
        body.set('description', description);
        body.set('content', content);
        body.set('categoryId', categoryId);
        body.set('publishMode', publishMode);
        body.set('status', status);
        body.set('publishedAt', publishedAt);
        body.set('publishedAtTime', publishedAtTime);
        body.set('schemaJson', schemaJson);
        body.set('showCoverOnDetail', showCoverOnDetail ? '1' : '0');
        body.set('coverAlt', coverAlt);
        if (coverFile) {
          body.set('cover', coverFile);
        }

        setPending(true);
        setError('');
        const endpoint = isNew ? '/api/admin/posts/' : `/api/admin/posts/${props.post?.id}/`;
        void fetch(endpoint, { method: isNew ? 'POST' : 'PUT', body, credentials: 'include' })
          .then(async (response) => {
            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
              setError(payload.error ?? 'Speichern fehlgeschlagen.');
              return;
            }
            router.push('/admin/');
            router.refresh();
          })
          .catch(() => {
            setError('Speichern fehlgeschlagen.');
          })
          .finally(() => {
            setPending(false);
          });
      }}
    >
      <label className="block">
        <span className="admin-label">Titel</span>
        <input
          className="admin-input"
          name="title"
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!slugTouched) {
              setSlug(slugify(next));
            }
          }}
          required
          value={title}
        />
      </label>

      <label className="block">
        <span className="admin-label">Slug</span>
        <input
          className="admin-input font-mono text-sm"
          name="slug"
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          required
          value={slug}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="admin-label">Kategorie</span>
          <select
            className="admin-input"
            name="categoryId"
            onChange={(event) => setCategoryId(event.target.value)}
            required
            value={categoryId}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span className="admin-label">Neue Kategorie</span>
          <div className="flex gap-2">
            <input
              className="admin-input"
              onChange={(event) => setNewCategory(event.target.value)}
              value={newCategory}
            />
            <button
              className="btn-gold-outline shrink-0 !px-3 !py-2 !text-navy"
              onClick={() => {
                if (newCategory.trim().length < 2) {
                  return;
                }
                void fetch('/api/admin/categories/', {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: newCategory }),
                })
                  .then(async (response) => {
                    const payload = (await response.json()) as Category & { error?: string };
                    if (!response.ok) {
                      setError(payload.error ?? 'Kategorie konnte nicht angelegt werden.');
                      return;
                    }
                    setCategories((current) => {
                      if (current.some((entry) => entry.id === payload.id)) {
                        return current;
                      }
                      return [...current, payload].sort((a, b) => a.name.localeCompare(b.name, 'de'));
                    });
                    setCategoryId(String(payload.id));
                    setNewCategory('');
                  })
                  .catch(() => {
                    setError('Kategorie konnte nicht angelegt werden.');
                  });
              }}
              type="button"
            >
              Anlegen
            </button>
          </div>
        </div>
      </div>

      <label className="block">
        <span className="admin-label">Meta Description</span>
        <textarea
          className="admin-input min-h-24"
          maxLength={320}
          name="description"
          onChange={(event) => setDescription(event.target.value)}
          required
          value={description}
        />
        <span className="mt-1 block text-xs text-muted">{description.length}/320 Zeichen</span>
      </label>

      <div>
        <span className="admin-label">
          Titelbild {isNew ? '(Pflicht, nur WebP)' : '(optional – bestehendes Bild bleibt)'}
        </span>
        <input
          accept="image/webp,.webp"
          className="admin-input"
          name="cover"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            const coverError = coverImageError(file);
            setError(coverError ?? '');
          }}
          type="file"
        />
        <p className="mt-2 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-xs leading-relaxed text-navy">
          Nur <strong>.webp</strong>. Bitte eine Datei ohne Wasserzeichen verwenden
          (unter {COVER_RECOMMENDED_KB} KB empfohlen, höchstens {COVER_MAX_MB} MB).
        </p>
        <label className="mt-3 block">
          <span className="admin-label">Bild-Alt-Text</span>
          <input
            className="admin-input"
            maxLength={180}
            onChange={(event) => setCoverAlt(event.target.value)}
            placeholder="Kurze Beschreibung des Bildes"
            type="text"
            value={coverAlt}
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm text-navy">
          <input
            checked={showCoverOnDetail}
            onChange={(event) => setShowCoverOnDetail(event.target.checked)}
            type="checkbox"
          />
          Titelbild auf der Beitragsseite anzeigen
        </label>
        {props.post?.coverImage ? (
          <img
            alt={coverAlt || 'Aktuelles Titelbild'}
            className="mt-3 max-h-40 rounded-md object-cover"
            src={props.post.coverImage}
          />
        ) : (
          <p className="mt-2 text-xs text-muted">
            Bestehende Beiträge ohne eigenes Titelbild behalten die Kategorie-Grafik.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-navy/10 bg-cream/50 p-4">
        <span className="admin-label">Veröffentlichung</span>
        {isNew ? (
          <div className="mt-2 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                checked={publishMode === 'auto'}
                name="publishMode"
                onChange={() => setPublishMode('auto')}
                type="radio"
                value="auto"
              />
              Automatisch in Warteschlange (7/Tag)
            </label>
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                checked={publishMode === 'manual'}
                name="publishMode"
                onChange={() => setPublishMode('manual')}
                type="radio"
                value="manual"
              />
              Manuelles Datum / Status
            </label>
          </div>
        ) : (
          <input name="publishMode" type="hidden" value="manual" />
        )}

        {isNew && publishMode === 'auto' ? (
          <p className="mt-3 text-sm text-muted">
            Der Beitrag wird automatisch in die Veröffentlichungs-Warteschlange eingereiht.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="admin-label">Status</span>
              <select
                className="admin-input"
                name="status"
                onChange={(event) => setStatus(event.target.value as PostStatus)}
                value={status}
              >
                <option value="draft">Entwurf</option>
                <option value="scheduled">Geplant</option>
                <option value="published">Veröffentlicht</option>
              </select>
            </label>
            <label className="block">
              <span className="admin-label">Datum</span>
              <input
                className="admin-input"
                name="publishedAt"
                onChange={(event) => setPublishedAt(event.target.value)}
                type="date"
                value={publishedAt}
              />
            </label>
            <label className="block">
              <span className="admin-label">Uhrzeit (Wien)</span>
              <input
                className="admin-input"
                name="publishedAtTime"
                onChange={(event) => setPublishedAtTime(event.target.value)}
                type="time"
                value={publishedAtTime}
              />
            </label>
          </div>
        )}
      </div>

      <div>
        <span className="admin-label">Inhalt (HTML)</span>
        <RichTextEditor
          initialHtml={props.post?.content ?? '<p></p>'}
          internalPosts={props.internalPosts.filter((post) => post.id !== props.post?.id)}
          onChange={setContent}
        />
      </div>

      <label className="block">
        <span className="admin-label">Schema Markup (JSON-LD, optional, separat)</span>
        <textarea
          className="admin-input min-h-40 font-mono text-xs"
          name="schemaJson"
          onChange={(event) => setSchemaJson(event.target.value)}
          placeholder='{"@context":"https://schema.org","@type":"FAQPage"}'
          value={schemaJson}
        />
        <span className="mt-1 block text-xs text-muted">
          JSON-LD hier einfügen, nicht in den HTML-Inhalt.
        </span>
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex gap-3">
        <button className="btn-gold" disabled={pending} type="submit">
          {pending ? 'Speichern…' : 'Speichern'}
        </button>
        <button
          className="btn-gold-outline !text-navy"
          onClick={() => router.push('/admin/')}
          type="button"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
};

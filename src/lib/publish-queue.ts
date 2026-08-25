import { and, asc, desc, eq, gt, lte, sql } from 'drizzle-orm';
import type { PostStatus } from '@/lib/post-status';
import { getDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import {
  POSTS_PER_DAY,
  addViennaDays,
  firstAvailableSlotFrom,
  normalizePublishedAt,
  slotIndexFromIso,
  slotIsoOnDay,
  viennaYmd,
} from '@/lib/vienna-time';

export {
  formatPublishAtVienna,
  formatPublishCountdown,
  normalizePublishedAt,
  toDateTimeLocalVienna,
  fromDateTimeLocalVienna,
} from '@/lib/vienna-time';

export type QueueAssignment = {
  postId: number;
  publishedAt: string;
  queuePosition: number;
};

const nowIso = () => new Date().toISOString();

/**
 * Promotes scheduled posts whose publish time has passed.
 */
export const releaseDueScheduledPosts = () => {
  const now = nowIso();
  getDb()
    .update(posts)
    .set({
      status: 'published',
      updatedAt: now,
    })
    .where(and(eq(posts.status, 'scheduled'), lte(posts.publishedAt, now)))
    .run();
};

/**
 * Returns the next free queue slot after the latest scheduled post.
 */
export const computeNextQueueSlot = () => {
  const last = getDb()
    .select({
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, 'scheduled'))
    .orderBy(desc(posts.publishedAt))
    .get();

  if (!last) {
    return firstAvailableSlotFrom(new Date());
  }

  const normalized = normalizePublishedAt(last.publishedAt);
  const slotIndex = slotIndexFromIso(normalized);
  const day = viennaYmd(new Date(normalized));

  if (slotIndex < POSTS_PER_DAY - 1) {
    return {
      publishedAt: slotIsoOnDay(day, slotIndex + 1),
      queuePosition: slotIndex + 1,
    };
  }

  const nextDay = addViennaDays(day, 1);
  return {
    publishedAt: slotIsoOnDay(nextDay, 0),
    queuePosition: 0,
  };
};

const nextGlobalQueuePosition = () => {
  const row = getDb()
    .select({ value: sql<number>`coalesce(max(${posts.queuePosition}), 0)` })
    .from(posts)
    .where(eq(posts.status, 'scheduled'))
    .get();

  return (row?.value ?? 0) + 1;
};

/**
 * Resolves publish fields for a newly created post in auto-queue mode.
 */
export const resolveAutoQueuePublish = () => {
  const slot = computeNextQueueSlot();
  return {
    status: 'scheduled' as const,
    publishedAt: slot.publishedAt,
    queuePosition: nextGlobalQueuePosition(),
  };
};

/**
 * Assigns sequential queue slots to post ids.
 */
export const buildQueueAssignments = (postIds: number[], startFrom?: Date) => {
  const assignments: QueueAssignment[] = [];
  if (postIds.length === 0) {
    return assignments;
  }

  let cursor = firstAvailableSlotFrom(startFrom ?? new Date());
  let globalPosition = 1;

  for (const postId of postIds) {
    assignments.push({
      postId,
      publishedAt: cursor.publishedAt,
      queuePosition: globalPosition,
    });

    globalPosition += 1;
    const day = viennaYmd(new Date(cursor.publishedAt));
    if (cursor.queuePosition < POSTS_PER_DAY - 1) {
      cursor = {
        publishedAt: slotIsoOnDay(day, cursor.queuePosition + 1),
        queuePosition: cursor.queuePosition + 1,
      };
    } else {
      const nextDay = addViennaDays(day, 1);
      cursor = {
        publishedAt: slotIsoOnDay(nextDay, 0),
        queuePosition: 0,
      };
    }
  }

  return assignments;
};

/**
 * Schedules multiple posts into the drip queue.
 */
export const applyQueueAssignments = (assignments: QueueAssignment[]) => {
  const now = nowIso();
  for (const assignment of assignments) {
    getDb()
      .update(posts)
      .set({
        status: 'scheduled',
        publishedAt: assignment.publishedAt,
        queuePosition: assignment.queuePosition,
        updatedAt: now,
      })
      .where(eq(posts.id, assignment.postId))
      .run();
  }
};

/**
 * Publishes a post immediately.
 */
export const publishPostNow = (id: number) => {
  const now = nowIso();
  return getDb()
    .update(posts)
    .set({
      status: 'published',
      publishedAt: now,
      queuePosition: null,
      updatedAt: now,
    })
    .where(eq(posts.id, id))
    .returning()
    .get();
};

/**
 * Reschedules a post to a new publish time.
 */
export const reschedulePost = (id: number, publishedAt: string, status: PostStatus = 'scheduled') => {
  const now = nowIso();
  const normalized = normalizePublishedAt(publishedAt);
  const nextStatus =
    status === 'published' || (status === 'scheduled' && normalized <= now) ? 'published' : status;

  return getDb()
    .update(posts)
    .set({
      status: nextStatus,
      publishedAt: nextStatus === 'published' && normalized > now ? now : normalized,
      queuePosition: nextStatus === 'scheduled' ? null : null,
      updatedAt: now,
    })
    .where(eq(posts.id, id))
    .returning()
    .get();
};

/**
 * Returns scheduled posts ordered by publish time ascending.
 */
export const listScheduledPostsOrdered = () => {
  return getDb()
    .select()
    .from(posts)
    .where(eq(posts.status, 'scheduled'))
    .orderBy(asc(posts.publishedAt))
    .all();
};

/**
 * SQL fragment: post is publicly visible right now.
 */
export const isPubliclyVisible = () => {
  releaseDueScheduledPosts();
  const now = nowIso();
  return and(eq(posts.status, 'published'), lte(posts.publishedAt, now));
};

/**
 * Counts scheduled posts on the same Vienna calendar day as the given ISO timestamp.
 */
export const scheduledCountOnDay = (iso: string) => {
  const day = viennaYmd(new Date(normalizePublishedAt(iso)));
  const dayStart = slotIsoOnDay(day, 0);
  const nextDay = addViennaDays(day, 1);
  const dayEnd = slotIsoOnDay(nextDay, 0);

  const row = getDb()
    .select({ value: sql<number>`count(*)` })
    .from(posts)
    .where(
      and(
        eq(posts.status, 'scheduled'),
        gt(posts.publishedAt, dayStart),
        lte(posts.publishedAt, dayEnd),
      ),
    )
    .get();

  return row?.value ?? 0;
};

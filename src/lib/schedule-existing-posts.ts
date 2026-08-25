import { applyQueueAssignments, buildQueueAssignments } from '@/lib/publish-queue';
import { listAllPostIds } from '@/lib/posts';
import { getDb } from '@/lib/db';

/** Post IDs that must stay published immediately. */
export const EXCLUDED_IDS: number[] = [];

/**
 * Google-indexed blog slugs that must remain published.
 * Static site pages are not in the posts table.
 */
export const EXCLUDED_SLUGS = [
  'halteverbotszone-luxusumzug-wien',
  'weinkeller-umzug-wien-doebling',
  'relocation-service-wien-diplomaten',
  'smart-home-it-umzug-wien',
  'kunst-antiquitaeten-transport-wien-1-bezirk',
] as const;

export type ScheduleMigrationResult = {
  total: number;
  excluded: { id: number; slug: string; title: string }[];
  scheduled: {
    postId: number;
    slug: string;
    title: string;
    publishedAt: string;
    queuePosition: number;
  }[];
};

const isExcluded = (post: { id: number; slug: string }) => {
  if (EXCLUDED_IDS.includes(post.id)) {
    return true;
  }
  return EXCLUDED_SLUGS.includes(post.slug as (typeof EXCLUDED_SLUGS)[number]);
};

/**
 * Queues all published posts except excluded slugs/ids into the drip schedule.
 */
export const runScheduleExistingPostsMigration = (): ScheduleMigrationResult => {
  getDb();
  const all = listAllPostIds();
  const excluded = all.filter((post) => isExcluded(post));
  const toSchedule = all
    .filter((post) => !isExcluded(post) && post.status === 'published')
    .map((post) => post.id);

  if (toSchedule.length === 0) {
    return {
      total: all.length,
      excluded: excluded.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
      })),
      scheduled: [],
    };
  }

  const assignments = buildQueueAssignments(toSchedule, new Date());
  applyQueueAssignments(assignments);

  const scheduled = assignments.map((assignment) => {
    const post = all.find((entry) => entry.id === assignment.postId);
    return {
      postId: assignment.postId,
      slug: post?.slug ?? '',
      title: post?.title ?? '',
      publishedAt: assignment.publishedAt,
      queuePosition: assignment.queuePosition,
    };
  });

  return {
    total: all.length,
    excluded: excluded.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
    })),
    scheduled,
  };
};

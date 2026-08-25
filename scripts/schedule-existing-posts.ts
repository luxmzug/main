/**
 * One-time migration: spreads existing posts into the drip queue.
 *
 * Run: npm run schedule:posts
 */
import { getDb } from '@/lib/db';
import { applyQueueAssignments, buildQueueAssignments } from '@/lib/publish-queue';
import { listAllPostIds } from '@/lib/posts';

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

const isExcluded = (post: { id: number; slug: string }) => {
  if (EXCLUDED_IDS.includes(post.id)) {
    return true;
  }
  return EXCLUDED_SLUGS.includes(post.slug as (typeof EXCLUDED_SLUGS)[number]);
};

const run = () => {
  getDb();
  const all = listAllPostIds();
  const toSchedule = all
    .filter((post) => !isExcluded(post) && post.status === 'published')
    .map((post) => post.id);
  const excluded = all.filter((post) => isExcluded(post));

  console.log(`Total posts: ${all.length}`);
  console.log(`Excluded (stay published): ${excluded.length}`);
  excluded.forEach((post) => {
    console.log(`  ✓ [${post.id}] ${post.slug}`);
  });
  console.log(`To schedule: ${toSchedule.length}`);

  if (toSchedule.length === 0) {
    console.log('Nothing to schedule.');
    return;
  }

  const assignments = buildQueueAssignments(toSchedule, new Date());
  applyQueueAssignments(assignments);

  console.log('\nQueue assignments:');
  for (const assignment of assignments) {
    const post = all.find((entry) => entry.id === assignment.postId);
    console.log(
      `  #${assignment.queuePosition} [${assignment.postId}] ${post?.slug} → ${assignment.publishedAt}`,
    );
  }

  console.log('\nDone.');
};

run();

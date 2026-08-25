/**
 * One-time migration: spreads existing posts into the drip queue.
 *
 * Local: npm run schedule:posts
 * Docker: docker compose --profile tools run --rm schedule-posts
 */
import { runScheduleExistingPostsMigration } from '@/lib/schedule-existing-posts';

const result = runScheduleExistingPostsMigration();

console.log(`Total posts: ${result.total}`);
console.log(`Excluded (stay published): ${result.excluded.length}`);
result.excluded.forEach((post) => {
  console.log(`  ✓ [${post.id}] ${post.slug}`);
});
console.log(`To schedule: ${result.scheduled.length}`);

if (result.scheduled.length === 0) {
  console.log('Nothing to schedule.');
} else {
  console.log('\nQueue assignments:');
  for (const entry of result.scheduled) {
    console.log(
      `  #${entry.queuePosition} [${entry.postId}] ${entry.slug} → ${entry.publishedAt}`,
    );
  }
  console.log('\nDone.');
}

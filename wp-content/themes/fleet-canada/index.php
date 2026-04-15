<?php
/**
 * Main index template.
 *
 * @package FleetCanada
 */

get_header();
?>

<main class="relative pt-28 pb-16">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
		<?php if ( have_posts() ) : ?>
			<div class="space-y-10">
				<?php while ( have_posts() ) : the_post(); ?>
					<article <?php post_class( 'border-b border-outline-variant/20 pb-10' ); ?>>
						<h2 class="text-3xl sm:text-4xl font-black font-headline uppercase mb-4 leading-tight">
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</h2>
						<div class="fleet-entry-content text-base sm:text-lg leading-relaxed text-on-surface/80">
							<?php the_excerpt(); ?>
						</div>
					</article>
				<?php endwhile; ?>
			</div>
		<?php else : ?>
			<article class="text-base sm:text-lg text-on-surface/80">
				<?php esc_html_e( 'No content found.', 'fleet-canada' ); ?>
			</article>
		<?php endif; ?>
	</div>
</main>

<?php get_footer(); ?>

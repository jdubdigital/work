<?php
/**
 * Generic page template.
 *
 * @package FleetCanada
 */

get_header();
?>

<?php if ( have_posts() ) : ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<?php if ( fleet_canada_is_elementor_page( get_the_ID() ) ) : ?>
			<main class="relative">
				<?php the_content(); ?>
			</main>
		<?php else : ?>
			<main class="relative pt-28 pb-16">
				<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-black font-headline uppercase mb-8 leading-tight">
						<?php the_title(); ?>
					</h1>
					<div class="fleet-entry-content text-base sm:text-lg leading-relaxed text-on-surface/80">
						<?php the_content(); ?>
					</div>
				</article>
			</main>
		<?php endif; ?>
	<?php endwhile; ?>
<?php endif; ?>

<?php get_footer(); ?>

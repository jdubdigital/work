<?php
/**
 * Front page template.
 *
 * @package FleetCanada
 */

get_header();
?>

<?php if ( have_posts() ) : ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<?php if ( ( class_exists( '\Elementor\Plugin' ) && fleet_canada_has_elementor_content( get_the_ID() ) ) || fleet_canada_has_page_content( get_the_ID() ) ) : ?>
			<main class="relative">
				<?php the_content(); ?>
			</main>
		<?php else : ?>
			<?php get_template_part( 'template-parts/home', 'static' ); ?>
		<?php endif; ?>
	<?php endwhile; ?>
<?php else : ?>
	<?php get_template_part( 'template-parts/home', 'static' ); ?>
<?php endif; ?>

<?php get_footer(); ?>

<?php
/**
 * Site header.
 *
 * @package FleetCanada
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="dark">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>"/>
	<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
	<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
	<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&amp;family=Inter:wght@300;400;500;600;700&amp;family=Bai+Jamjuree:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
	<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
	<script id="tailwind-config">
		tailwind.config = {
		  darkMode: "class",
		  theme: {
		    extend: {
		      "colors": {
		              "on-error": "#690005",
		              "on-primary-fixed": "#410005",
		              "error-container": "#93000a",
		              "tertiary-container": "#007da1",
		              "on-primary": "#68000c",
		              "surface-container-high": "#2a2a2a",
		              "background": "#131313",
		              "on-surface-variant": "#e7bdb9",
		              "surface-container-low": "#1c1b1b",
		              "on-tertiary-fixed-variant": "#004d65",
		              "secondary-fixed-dim": "#c8c6c5",
		              "primary-fixed": "#ffdad7",
		              "surface-container": "#201f1f",
		              "surface-variant": "#353534",
		              "on-primary-fixed-variant": "#930015",
		              "inverse-on-surface": "#313030",
		              "secondary-fixed": "#e4e2e1",
		              "on-surface": "#e5e2e1",
		              "inverse-surface": "#e5e2e1",
		              "tertiary-fixed": "#bee9ff",
		              "primary-fixed-dim": "#e03723",
		              "outline-variant": "#5d3f3d",
		              "surface": "#131313",
		              "secondary": "#c8c6c5",
		              "primary": "#e03723",
		              "on-error-container": "#ffdad6",
		              "on-secondary": "#303030",
		              "on-secondary-fixed": "#1b1c1c",
		              "surface-container-highest": "#353534",
		              "on-primary-container": "#fff9f8",
		              "on-background": "#e5e2e1",
		              "on-secondary-container": "#b6b5b4",
		              "surface-tint": "#e03723",
		              "tertiary": "#79d1f9",
		              "error": "#ffb4ab",
		              "primary-container": "#e03723",
		              "on-tertiary-fixed": "#001f2a",
		              "tertiary-fixed-dim": "#79d1f9",
		              "on-tertiary-container": "#f7fbff",
		              "surface-container-lowest": "#0e0e0e",
		              "secondary-container": "#474747",
		              "inverse-primary": "#e03723",
		              "outline": "#ad8885",
		              "surface-dim": "#131313",
		              "on-tertiary": "#003546",
		              "surface-bright": "#3a3939",
		              "on-secondary-fixed-variant": "#474747"
		      },
		      "borderRadius": {
		              "DEFAULT": "0px",
		              "lg": "0px",
		              "xl": "0px",
		              "full": "9999px"
		      },
		      "fontFamily": {
		              "headline": ["Space Grotesk"],
		              "body": ["Inter"],
		              "label": ["Space Grotesk"],
		              "mono": ["Bai Jamjuree"]
		      }
		    },
		  }
		}
	</script>
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'dark bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container' ); ?>>
<?php wp_body_open(); ?>
<div class="fixed inset-0 grain-overlay z-[100]" aria-hidden="true"></div>
<?php if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'header' ) ) : ?>
<?php else : ?>
	<header class="site-header fixed top-0 left-0 right-0 z-50 flex justify-between items-center gap-4 w-full px-4 py-3 sm:px-6 sm:py-4 max-w-[100vw]">
		<div class="flex items-center gap-4 sm:gap-8 min-w-0">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a class="text-lg sm:text-2xl font-black tracking-tighter text-[#e5e2e1] font-headline" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php bloginfo( 'name' ); ?>
				</a>
			<?php endif; ?>

			<nav class="hidden md:flex gap-6" aria-label="<?php esc_attr_e( 'Primary navigation', 'fleet-canada' ); ?>">
				<?php
				fleet_canada_render_menu_links(
					'primary',
					'text-sm font-mono uppercase tracking-widest text-[#e5e2e1] hover:text-[#E03723] transition-colors active:scale-95',
					'text-[#E03723] border-b-2 border-[#E03723] pb-1'
				);
				?>
			</nav>
		</div>

		<a class="shrink-0 bg-primary-container text-on-primary-container px-3 py-2 sm:px-6 text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] uppercase hover:bg-opacity-90 transition-all active:scale-95" href="<?php echo esc_url( fleet_canada_get_contact_url() ); ?>">
			<?php esc_html_e( 'Get in Touch', 'fleet-canada' ); ?>
		</a>
	</header>
<?php endif; ?>

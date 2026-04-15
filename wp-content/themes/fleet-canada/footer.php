<?php
/**
 * Site footer.
 *
 * @package FleetCanada
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'footer' ) ) : ?>
<?php else : ?>
	<footer class="bg-[#131313] border-t-2 border-[#E03723] w-full px-4 sm:px-6 lg:px-12 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12" id="contact">
		<div class="col-span-1 md:col-span-2">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a class="text-2xl sm:text-3xl font-black text-[#e5e2e1] font-headline mb-6 sm:mb-8 block" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php bloginfo( 'name' ); ?>
				</a>
			<?php endif; ?>
			<p class="text-[10px] font-mono tracking-widest text-on-surface/40 max-w-sm">
				<?php esc_html_e( 'MANUFACTURING THE NEXT CENTURY OF AEROSPACE INTEGRITY. BUILT TO SPEC. OPERATED WITHOUT COMPROMISE.', 'fleet-canada' ); ?>
			</p>
		</div>
		<div>
			<span class="text-[10px] font-mono tracking-widest text-[#E03723] mb-6 block uppercase"><?php esc_html_e( '// Navigate', 'fleet-canada' ); ?></span>
			<div class="space-y-3 flex flex-col items-start">
				<?php
				fleet_canada_render_menu_links(
					'primary',
					'text-sm font-mono text-[#e5e2e1]/60 hover:text-[#e5e2e1] hover:translate-x-1 transition-transform inline-block'
				);
				?>
				<a class="text-sm font-mono text-[#e5e2e1]/60 hover:text-[#e5e2e1] hover:translate-x-1 transition-transform inline-block" href="<?php echo esc_url( fleet_canada_get_contact_url() ); ?>">
					<?php esc_html_e( 'GET IN TOUCH', 'fleet-canada' ); ?>
				</a>
			</div>
		</div>
		<div>
			<span class="text-[10px] font-mono tracking-widest text-[#E03723] mb-6 block uppercase"><?php esc_html_e( '// Utility', 'fleet-canada' ); ?></span>
			<div class="space-y-3 flex flex-col items-start">
				<?php
				fleet_canada_render_menu_links(
					'utility',
					'text-sm font-mono text-[#e5e2e1]/60 hover:text-[#e5e2e1] hover:translate-x-1 transition-transform inline-block'
				);
				?>
			</div>
		</div>
		<div class="col-span-1 md:col-span-4 border-t border-outline-variant/10 pt-10 sm:pt-12 mt-2 sm:mt-8">
			<span class="text-[10px] font-mono tracking-widest text-on-surface/40">
				<?php
				echo esc_html(
					sprintf(
						/* translators: %1$s: current year, %2$s: site name */
						__( '© %1$s %2$s // MANUFACTURE SPEC: 9021-X // STATUS: OPTIMAL', 'fleet-canada' ),
						wp_date( 'Y' ),
						get_bloginfo( 'name' )
					)
				);
				?>
			</span>
		</div>
	</footer>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>

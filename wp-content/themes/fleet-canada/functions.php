<?php
/**
 * Theme bootstrap for Fleet Canada.
 *
 * @package FleetCanada
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function fleet_canada_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'fleet-canada' ),
			'utility' => __( 'Utility Menu', 'fleet-canada' ),
		)
	);
}
add_action( 'after_setup_theme', 'fleet_canada_setup' );

function fleet_canada_seed_front_page() {
	$front_page_id = (int) get_option( 'page_on_front' );

	if ( $front_page_id > 0 && 'page' === get_option( 'show_on_front' ) ) {
		update_option( 'fleet_canada_seeded_front_page', $front_page_id );
		return;
	}

	$home_page = get_page_by_path( 'home' );

	if ( ! $home_page instanceof WP_Post ) {
		$home_page_id = wp_insert_post(
			array(
				'post_title'   => __( 'Home', 'fleet-canada' ),
				'post_name'    => 'home',
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_content' => '',
			),
			true
		);

		if ( is_wp_error( $home_page_id ) ) {
			return;
		}

		$front_page_id = (int) $home_page_id;
	} else {
		$front_page_id = (int) $home_page->ID;
	}

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $front_page_id );
	update_option( 'fleet_canada_seeded_front_page', $front_page_id );
}

function fleet_canada_maybe_seed_front_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$front_page_id = (int) get_option( 'page_on_front' );
	$seeded_id     = (int) get_option( 'fleet_canada_seeded_front_page' );

	if ( $front_page_id > 0 && 'page' === get_option( 'show_on_front' ) ) {
		if ( $seeded_id !== $front_page_id ) {
			update_option( 'fleet_canada_seeded_front_page', $front_page_id );
		}

		return;
	}

	fleet_canada_seed_front_page();
}
add_action( 'after_switch_theme', 'fleet_canada_seed_front_page' );
add_action( 'admin_init', 'fleet_canada_maybe_seed_front_page' );

function fleet_canada_build_elementor_html_section( $slug, $html ) {
	return array(
		'id'      => substr( md5( $slug . '-section' ), 0, 8 ),
		'elType'  => 'section',
		'settings'=> array(
			'layout'          => 'full_width',
			'content_width'   => 'full',
			'stretch_section' => 'section-stretched',
			'gap'             => 'no',
			'padding'         => array(
				'unit'     => 'px',
				'top'      => '0',
				'right'    => '0',
				'bottom'   => '0',
				'left'     => '0',
				'isLinked' => false,
			),
		),
		'elements'=> array(
			array(
				'id'       => substr( md5( $slug . '-column' ), 0, 8 ),
				'elType'   => 'column',
				'settings' => array(
					'_column_size' => 100,
					'padding'      => array(
						'unit'     => 'px',
						'top'      => '0',
						'right'    => '0',
						'bottom'   => '0',
						'left'     => '0',
						'isLinked' => false,
					),
				),
				'elements' => array(
					array(
						'id'         => substr( md5( $slug . '-widget' ), 0, 8 ),
						'elType'     => 'widget',
						'widgetType' => 'html',
						'settings'   => array(
							'html' => trim( $html ),
						),
						'elements'   => array(),
					),
				),
				'isInner'  => false,
			),
		),
		'isInner' => false,
	);
}

function fleet_canada_get_homepage_elementor_sections() {
	return array(
		'hero'         => <<<'HTML'
<section class="relative hero-shell w-full overflow-hidden blueprint-grid border-b border-outline-variant/20" id="top">
<div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
<img class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" data-alt="Aerospace technician working on aircraft components in a high-tech facility" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV0byWiHAEjvDK9jsndseUVp_NoIXyQUlhUZXS0KyR6o1yiZUlzMvw2erDLW9gUrSxQdAo_957iHfGfUUDqhadVWB_iCrzWfljafxc_WLYwfCHn1UAdTIjtATiR2JoMWbBtl_eZFqrmNkK9nw36-nk96QdqyjmlDEtgUg-ORNeTgAWxIoFSX7dTq1vptyiileU3Qn0TxC_OV8nyqiC7LU5HPrlS4efyCkO9jiO4DxH5Gs5A5vTmXfxtp3ezJLqVYrcVGDc1t7IUvw" alt=""/>
<div class="relative z-20 hero-shell w-full flex flex-col items-start justify-end px-4 pt-24 pb-8 text-left sm:px-6 sm:pt-28 sm:pb-10 lg:px-10 lg:pt-32 lg:pb-16 xl:px-12 xl:pb-24">
<div class="mb-4 sm:mb-5">
<span class="bg-primary-container text-on-primary-container px-3 py-1 text-[10px] font-mono tracking-[0.3em] font-bold">CAPABLE_FOCUSED_COMMITTED</span>
</div>
<h1 class="w-full text-[clamp(2.2rem,11vw,9rem)] font-black font-headline leading-[0.86] sm:leading-[0.82] tracking-[-0.06em] text-[#e5e2e1] mb-6 sm:mb-8">
                    BUILD-TO-PRINT<br/><span class="text-primary-container">AEROSTRUCTURES</span>
</h1>
<div class="grid w-full max-w-6xl grid-cols-1 gap-6 border-t border-outline-variant/30 pt-6 sm:grid-cols-2 sm:gap-8 sm:pt-8 lg:grid-cols-3 lg:gap-12">
<div class="flex flex-col">
<span class="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">// COORD_LNK</span>
<span class="text-xs sm:text-sm font-mono uppercase">42.9231&deg; N, 78.9329&deg; W</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">// STATUS</span>
<span class="text-xs sm:text-sm font-mono uppercase text-primary">OPERATIONAL_EXCELLENCE</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">// PHILOSOPHY</span>
<span class="text-xs sm:text-sm font-mono uppercase">CAPABLE. CUSTOMER-FOCUSED. COMMITTED.</span>
</div>
</div>
</div>
<div class="hidden sm:block absolute top-1/4 left-6 lg:left-12 w-8 h-8 border-l border-t border-primary/40"></div>
<div class="hidden sm:block absolute top-1/4 right-6 lg:right-12 w-8 h-8 border-r border-t border-primary/40"></div>
<div class="hidden sm:block absolute bottom-1/4 left-6 lg:left-12 w-8 h-8 border-l border-b border-primary/40"></div>
<div class="hidden sm:block absolute bottom-1/4 right-6 lg:right-12 w-8 h-8 border-r border-b border-primary/40"></div>
</section>
HTML,
		'logos'        => <<<'HTML'
<section class="py-10 sm:py-12 bg-surface-container border-b border-outline-variant/20">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 overflow-hidden">
<div class="flex items-center justify-start md:justify-between opacity-50 grayscale hover:grayscale-0 transition-all gap-6 sm:gap-8 flex-wrap md:flex-nowrap">
<span class="text-lg sm:text-xl font-bold font-headline tracking-tighter text-on-surface">Gulfstream</span>
<span class="text-lg sm:text-xl font-bold font-headline tracking-tighter text-on-surface">DE HAVILLAND</span>
<span class="text-lg sm:text-xl font-bold font-headline tracking-tighter text-on-surface">Collins Aerospace</span>
<span class="text-lg sm:text-xl font-bold font-headline tracking-tighter text-on-surface">MHICA</span>
<span class="text-lg sm:text-xl font-bold font-headline tracking-tighter text-on-surface">lmi aerospace</span>
</div>
</div>
</section>
HTML,
		'capabilities' => <<<'HTML'
<section class="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-outline-variant/20" id="capabilities">
<div class="bg-primary-container p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-start relative overflow-hidden group">
<div class="absolute top-0 right-0 p-5 sm:p-8 text-[56px] sm:text-[80px] font-black text-on-primary/10 select-none">85+</div>
<div class="relative z-10">
<h2 class="text-3xl sm:text-4xl lg:text-6xl font-black font-headline text-on-primary-container leading-tight mb-6 sm:mb-8 uppercase">
                        Serving the Aerospace Industry for 85+ Years.
                    </h2>
<p class="text-on-primary-container/90 font-body mb-8 text-base sm:text-lg lg:text-xl max-w-lg">
                        Fleet Canada Inc. fabricates and assembles aircraft parts and components made from aluminum, composite materials and more.
                    </p>
<button class="flex w-full sm:w-auto items-center justify-between gap-4 bg-surface text-on-surface px-6 sm:px-8 py-4 text-xs font-bold tracking-widest uppercase hover:translate-x-2 transition-transform group">
                        VIEW OUR CAPABILITIES
                        <span class="material-symbols-outlined text-sm">arrow_forward_ios</span>
</button>
</div>
</div>
<div class="grid grid-cols-2 gap-0 h-full">
<div class="aspect-square relative overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Technical aircraft structural components" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARvYlP7BQEK0WZUFdLhQttbtYRabh8mMPROx5LACt06a4wnT74ci5Iut4ejAfniTbl0mc8Y7SshGQANd1bLtKHHHJe_DMqLBSh7u5OkqY6q4v8z0flBrK5rX9MTGWb_VFeDW3oyint-cKzxUNcQUQt2h8nRA7mt7h_W9vn1x1ZvopstmU46T1itOXLbiO5xgOcBvH64Oc0-m4J6Eo7u65PBFgoS5cia-59HS3v_p5YYBfuIiMtR5D-7vWAXvVS9XDRNTG2TAU4kiA" alt=""/>
<div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
</div>
<div class="aspect-square relative overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Industrial manufacturing process for aerospace parts" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-HhIqSd9lUP5NFjtoJ7mj8EMdVf5gvp8-LJ15hceYVAkFGfU-jS9rASHK1jDAuoM-qiAMkZkdzmjC-eyrcyZaRsrOkWmoFKWDaBN-zeIm_k22FahcpxV0u49x37ZXNsDkqgkZGEK_nU8aa0NZ0T6nG1dfhq9lUed7HJgI9iokGrbuSCrZpJT1SjCC2yjXS6yTBtnfm7t6CIVdVieU5oKOBabwFGusl3HBO19O-3mZHKfbkTLFKkvE543XZi1sWg3M8kuI1mXXCXs" alt=""/>
<div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
</div>
<div class="aspect-square relative overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Close up of aircraft rivets and metal skin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfch6hpmM246FaRm10MII0jD9UJElQ8oeKn94a04_Ww3ouVf8wbAcLwV9TvqKKf865gmB9wDjh8JNxcgIbwGum5HBloEleQA6-tHnfFHaYAwdqzG7987-IbxxEGIWrxORB6mGcre9-whJpUx5CToHWHTtOO54R8Y0xZ5Fcrx5_JJogXBzuCQA13Izggf0M1ZgXjNehLgahUKi2gW89yf-hOwcyuP48R57bsUDB6WIvQNipNZn95lju0Wd3zIPuKx94d2f2iBTeF1k" alt=""/>
<div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
</div>
<div class="aspect-square relative overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Historical aircraft drawings and blueprints" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATEQ1ewjEtdGsuhJRXT0QJoxFQNfQZC_9qA8oyR3jaDoBEuYSAl5yXIG0GDGaVFwf3dL0uhBinQv1tF0m8MPNVCM_Tr1QZNR7yDa3pwm0hCup-kEA5QpawgCOhaXHu9Xzs18TPTrTSuwZWpnUQFEBgjNgeHJ15lqTRv5jQ4AssnRiejrC5_QYSS47pMyqKyx4GwhLR1Q_Rew1tftxglfyDg5UcHUN-xkfDNpU2amllLOIlLUsxm5mikISvqHIimUjbZWUB3aEOsPQ" alt=""/>
<div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
</div>
</div>
</section>
HTML,
		'company'      => <<<'HTML'
<section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-surface" id="company">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-10 lg:gap-16">
<div class="flex-1">
<span class="text-[10px] font-mono text-primary tracking-[0.3em] font-bold uppercase mb-4 block">// MISSION_STATEMENT</span>
<h2 class="text-3xl sm:text-4xl lg:text-5xl font-black font-headline uppercase mb-6 sm:mb-8 leading-tight">Passion That Drives Quality.</h2>
<p class="text-on-surface/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-2xl">
                        We are a build-to-print aerostructure manufacturer with a rich history and a bright future.
                    </p>
<button class="w-full sm:w-auto bg-primary-container text-on-primary-container px-6 sm:px-8 py-4 text-xs font-bold tracking-widest uppercase hover:translate-x-2 transition-transform">
                        ABOUT US
                    </button>
</div>
<div class="flex-1 relative aspect-video w-full border border-outline-variant/30 overflow-hidden bg-surface-container-low">
<div class="absolute inset-0 flex items-center justify-center z-10">
<div class="w-16 h-16 bg-primary-container text-on-primary-container flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-3xl">play_arrow</span>
</div>
</div>
<img class="w-full h-full object-cover grayscale opacity-40" data-alt="Video thumbnail of Fleet Canada factory floor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2XIbalzeCEiNaL1XiDoyfBnLBPAxIFdf_digU5mtmGP2gwKXu_lvezpKGfhy0ahCNs68_sv5pzZLtTXwZJnan1TenqQMIfrYryrGfLd2WZQoh7dvp3QsTRZPhqMZwLR_2AJ-rdLbOPo_JXlUPK00_ht1pgTu_fzePP9I6i7GAAcNU3-UGtryUK6igC2hRT7q5lhYQJsONj-LCfmCQXQNlDDui8j5bNBXVZtmDXfH1vkFufrSMfs77DVbLmwMI5cUmXWYJuDi5b_Q" alt=""/>
</div>
</div>
</section>
HTML,
		'approvals'    => <<<'HTML'
<section class="py-16 sm:py-24 bg-primary-container text-on-primary-container relative overflow-hidden" id="approvals">
<div class="blueprint-grid absolute inset-0 opacity-10"></div>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
<h2 class="text-3xl sm:text-4xl lg:text-6xl font-black font-headline uppercase mb-5 sm:mb-6">Trusted By The Industry.</h2>
<p class="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto opacity-90">
                    A broad base of approvals to meet the needs of OEMs worldwide.
                </p>
<button class="w-full sm:w-auto bg-surface text-on-surface px-6 sm:px-8 py-4 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">
                    VIEW CUSTOMERS &amp; PROGRAMS
                </button>
</div>
</section>
HTML,
		'testimonial'  => <<<'HTML'
<section class="py-16 sm:py-24 bg-surface-container-low border-b border-outline-variant/20" id="services">
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
<span class="material-symbols-outlined text-primary-container text-4xl sm:text-5xl mb-6 sm:mb-8">format_quote</span>
<blockquote class="text-xl sm:text-2xl md:text-3xl font-medium font-body leading-relaxed mb-10 sm:mb-12 text-on-surface/90 italic">
                    "The Fleet Canada team went above and beyond to support processing of an Upper Longeron in which on-time completion as crucial to our schedule [...]. As always, we thank you for being a key strategic Supplier to Erickson's S64 needs. We look forward to continuing our relationship for years to come."
                </blockquote>
<div class="flex flex-col items-center">
<span class="text-primary font-mono text-sm uppercase tracking-widest mb-1">Erickson</span>
<div class="w-12 h-0.5 bg-primary-container mt-4"></div>
</div>
</div>
</section>
HTML,
		'branding'     => <<<'HTML'
<section class="py-12 sm:py-20 border-t border-outline-variant/30 overflow-hidden bg-surface">
<h2 class="text-[22vw] sm:text-[18vw] font-black font-headline leading-none text-on-surface/5 whitespace-nowrap tracking-tighter -ml-2 sm:-ml-8 select-none">
                FLEET CANADA
            </h2>
</section>
HTML,
	);
}

function fleet_canada_get_homepage_elementor_data() {
	$sections = fleet_canada_get_homepage_elementor_sections();
	$data     = array();

	foreach ( $sections as $slug => $html ) {
		$data[] = fleet_canada_build_elementor_html_section( $slug, $html );
	}

	return $data;
}

function fleet_canada_seed_elementor_homepage() {
	if ( ! class_exists( '\Elementor\Plugin' ) ) {
		return;
	}

	$front_page_id = (int) get_option( 'page_on_front' );
	$seeded_id     = (int) get_option( 'fleet_canada_seeded_elementor_homepage' );

	if ( $front_page_id <= 0 || 'page' !== get_option( 'show_on_front' ) ) {
		return;
	}

	if ( $seeded_id === $front_page_id ) {
		return;
	}

	if ( fleet_canada_has_elementor_content( $front_page_id ) || fleet_canada_has_page_content( $front_page_id ) ) {
		update_option( 'fleet_canada_seeded_elementor_homepage', $front_page_id );
		return;
	}

	update_post_meta( $front_page_id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $front_page_id, '_elementor_template_type', 'wp-page' );
	update_post_meta( $front_page_id, '_elementor_version', defined( 'ELEMENTOR_VERSION' ) ? ELEMENTOR_VERSION : '3.0.0' );
	update_post_meta( $front_page_id, '_elementor_page_settings', array() );
	update_post_meta( $front_page_id, '_elementor_data', wp_slash( wp_json_encode( fleet_canada_get_homepage_elementor_data() ) ) );
	update_option( 'fleet_canada_seeded_elementor_homepage', $front_page_id );
}

function fleet_canada_maybe_seed_elementor_homepage() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	fleet_canada_seed_elementor_homepage();
}
add_action( 'admin_init', 'fleet_canada_maybe_seed_elementor_homepage' );

function fleet_canada_enqueue_assets() {
	$theme = wp_get_theme();

	wp_enqueue_style(
		'fleet-canada-style',
		get_stylesheet_uri(),
		array(),
		$theme->get( 'Version' )
	);

	wp_enqueue_script(
		'fleet-canada-theme',
		get_template_directory_uri() . '/assets/js/theme.js',
		array(),
		$theme->get( 'Version' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'fleet_canada_enqueue_assets' );

function fleet_canada_register_elementor_locations( $elementor_theme_manager ) {
	$elementor_theme_manager->register_all_core_location();
}
add_action( 'elementor/theme/register_locations', 'fleet_canada_register_elementor_locations' );

function fleet_canada_get_contact_url() {
	$contact_page = get_page_by_path( 'contact' );

	if ( $contact_page instanceof WP_Post ) {
		return get_permalink( $contact_page );
	}

	return home_url( '/#contact' );
}

function fleet_canada_default_menu_items( $location ) {
	$home = home_url( '/' );

	$menus = array(
		'primary' => array(
			array(
				'label' => __( 'Capabilities', 'fleet-canada' ),
				'url'   => $home . '#capabilities',
			),
			array(
				'label' => __( 'Integrated Services', 'fleet-canada' ),
				'url'   => $home . '#services',
			),
			array(
				'label' => __( 'Customers & Approvals', 'fleet-canada' ),
				'url'   => $home . '#approvals',
			),
			array(
				'label' => __( 'Company', 'fleet-canada' ),
				'url'   => $home . '#company',
			),
		),
		'utility' => array(
			array(
				'label' => __( 'Privacy Policy', 'fleet-canada' ),
				'url'   => home_url( '/privacy-policy/' ),
			),
			array(
				'label' => __( 'System Logs', 'fleet-canada' ),
				'url'   => '#',
			),
		),
	);

	return isset( $menus[ $location ] ) ? $menus[ $location ] : array();
}

function fleet_canada_render_menu_links( $location, $link_class, $active_class = '' ) {
	$locations = get_nav_menu_locations();
	$items     = array();

	if ( isset( $locations[ $location ] ) ) {
		$items = wp_get_nav_menu_items( $locations[ $location ] );
	}

	if ( empty( $items ) ) {
		$items = fleet_canada_default_menu_items( $location );

		foreach ( $items as $item ) {
			printf(
				'<a class="%1$s" href="%2$s">%3$s</a>',
				esc_attr( $link_class ),
				esc_url( $item['url'] ),
				esc_html( $item['label'] )
			);
		}

		return;
	}

	foreach ( $items as $item ) {
		if ( ! empty( $item->menu_item_parent ) ) {
			continue;
		}

		$classes = $link_class;

		if ( ! empty( $active_class ) && ! empty( $item->classes ) ) {
			$current_classes = array(
				'current-menu-item',
				'current-menu-ancestor',
				'current_page_item',
				'current_page_parent',
			);

			if ( array_intersect( $current_classes, $item->classes ) ) {
				$classes .= ' ' . $active_class;
			}
		}

		printf(
			'<a class="%1$s" href="%2$s">%3$s</a>',
			esc_attr( trim( $classes ) ),
			esc_url( $item->url ),
			esc_html( $item->title )
		);
	}
}

function fleet_canada_is_elementor_page( $post_id ) {
	if ( ! class_exists( '\Elementor\Plugin' ) ) {
		return false;
	}

	$document = \Elementor\Plugin::$instance->documents->get( $post_id );

	if ( ! $document || ! method_exists( $document, 'is_built_with_elementor' ) ) {
		return false;
	}

	return $document->is_built_with_elementor();
}

function fleet_canada_has_elementor_content( $post_id ) {
	$data = get_post_meta( $post_id, '_elementor_data', true );

	return ! empty( $data ) && '[]' !== trim( $data );
}

function fleet_canada_has_page_content( $post_id ) {
	$content = (string) get_post_field( 'post_content', $post_id );

	return '' !== trim( wp_strip_all_tags( $content ) );
}

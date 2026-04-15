Fleet Canada Theme

Install:
- Copy `fleet-canada` into `wp-content/themes/`
- Activate the theme in WordPress
- The theme will create or assign a `Home` page as the front page if one is not already set
- Assign menus to the `Primary Menu` and `Utility Menu` locations

Elementor behavior:
- If Elementor is active and the `Home` page is empty, the theme seeds it with prebuilt Elementor homepage sections
- The seeded homepage uses Elementor HTML widgets so the original static design can be edited inside Elementor without changing the look first
- If the homepage is built with Elementor, the theme will render the Elementor content instead of the hardcoded fallback homepage
- If the homepage has regular WordPress page content, the theme will render that content too
- If Elementor Pro Theme Builder is used, the theme registers Elementor theme locations and will let Elementor replace the header and footer

Menus:
- Menu structure is controlled in WordPress under `Appearance > Menus`
- In Elementor, the header/footer should use the Nav Menu widget and point to the `Primary Menu` or `Utility Menu`

Fallback behavior:
- If the homepage has not been built in Elementor yet, the original prototype layout is rendered from `template-parts/home-static.php`

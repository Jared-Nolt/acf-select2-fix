<?php
/**
 * Plugin Name: ACF Field Groups Select2 Fix
 * Plugin URI: https://github.com/Jared-Nolt/acf-select2-fix
 * If you are unable to edit ACF Fields in Field Groups when Ultimate Member plugin is installed, this plugin re-initializes Select2 dropdowns on the ACF Field Groups page to fix conflicts with other plugins. Ultimate member support topic - https://docs.ultimatemember.com/article/1764-fix-dropdown-field-functionality
 * Version: 1.0.0
 * Author: Jared Nolt
 * License: GPL2
 * Text Domain: acf-select2-fix
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class ACFFieldGroupsSelect2Fix - Handles enqueuing the JavaScript fix only on ACF Field Groups pages.
 */
class ACFFieldGroupsSelect2Fix {

    /**
     * Constructor. Registers the necessary WordPress hooks.
     */
    public function __construct() {
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    /**
     * Enqueues the JavaScript file.
     * @param string $hook_suffix The current admin page hook suffix.
     */
    public function enqueue_scripts( $hook_suffix ) {
        $screen = get_current_screen();

        // Check if we are on the ACF Field Groups page (edit or list screen).
        // The screen ID for editing a field group is 'acf-field-group'.
        // The screen ID for the list of field groups is 'edit-acf-field-group'.
        if ( $screen && ( $screen->id === 'acf-field-group' || $screen->id === 'edit-acf-field-group' ) ) {
            wp_enqueue_script(
                'acf-select2-fix',
                plugin_dir_url( __FILE__ ) . 'js/acf-select2-fix.js',
                array( 'jquery', 'select2' ),
                '1.0.0',
                true
            );
        }
    }
}

new ACFFieldGroupsSelect2Fix();
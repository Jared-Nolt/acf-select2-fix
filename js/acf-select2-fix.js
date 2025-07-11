/**
 * Re-initialize dropdown functionality for Ultimate Member (UM) Select2 fields.
 * This script is intended to be loaded only on ACF Field Groups pages
 * to resolve potential conflicts with other plugins using Select2.
 */
jQuery( function () {
    /**
     * Verifies that there is no empty value selected when multiple options are selected.
     * If an empty option ('') is selected along with other options, it unselects the empty one.
     * @param {Event} e The change event object.
     */
    function unselectEmptyOption( e ) {
        var $element = jQuery( e.currentTarget );
        var $selected = $element.find( ':selected' );

        // Check if more than one option is selected.
        if ( $selected.length > 1 ) {
            $selected.each( function ( i, option ) {
                // If an empty value option is found, unselect it and trigger a change.
                if ( option.value === '' ) {
                    option.selected = false;
                    $element.trigger( 'change' ); // Trigger change to update Select2 display.
                }
            } );
        }
    }

    /**
     * Re-initializes dropdown functionality for UM Select2 fields.
     * This function destroys existing Select2 instances and re-initializes them
     * with specific configurations for different UM Select2 classes (.um-s1, .um-s2, .um-s3).
     */
    function reInitializeDropdownFields() {
        // Check if Select2 function exists before proceeding.
        if ( 'function' === typeof jQuery.fn.select2 ) {
            // Remove old dropdowns to prevent duplicate instances or conflicts.
            // Targets specific UM Select2 classes that are already initialized by Select2.
            jQuery( '.um-s1, .um-s2, .um-s3', '.um-form' )
                .filter( '.select2-hidden-accessible' ) // Filter for elements already managed by Select2.
                .select2( 'destroy' ) // Destroy the existing Select2 instance.
                .off( 'select2:select' ) // Remove event listeners.
                .siblings( 'span.select2' ) // Select the generated Select2 span.
                .remove(); // Remove the visual Select2 elements.

            // Initialize new dropdowns for .um-s1 class.
            jQuery( '.um-s1' ).each( function () {
                var obj = jQuery( this );
                obj.select2( {
                    allowClear: true, // Allow clearing the selection.
                    dropdownParent: obj.parent() // Append dropdown to the parent element for correct positioning.
                } ).on( 'change', unselectEmptyOption ); // Attach change event listener.
            } );

            // Initialize new dropdowns for .um-s2 class.
            jQuery( '.um-s2' ).each( function () {
                var obj = jQuery( this );
                var atts;

                // Conditional attributes based on parent element for specific UM contexts.
                if ( obj.parents( '.um-custom-shortcode-tab' ).length ) {
                    atts = {
                        allowClear: false // Do not allow clearing for this specific context.
                    };
                } else {
                    atts = {
                        allowClear: false,
                        minimumResultsForSearch: 10, // Show search box only if 10 or more results.
                        dropdownParent: obj.parent()
                    };
                }
                obj.select2( atts ).on( 'change', unselectEmptyOption );
            } );

            // Initialize new dropdowns for .um-s3 class.
            jQuery( '.um-s3' ).each( function () {
                var obj = jQuery( this );
                obj.select2( {
                    allowClear: false,
                    minimumResultsForSearch: -1, // Never show search box.
                    dropdownParent: obj.parent()
                } ).on( 'change', unselectEmptyOption );
            } );
        }
    }

    /**
     * Re-initializes dropdown functionality on page load with a small timeout.
     * The timeout is crucial to ensure all other scripts (including conflicting ones)
     * have had a chance to run, allowing this script to re-initialize correctly.
     * Advice: If issues persist, try increasing the timeout value (e.g., 250 or 500).
     */
    setTimeout( reInitializeDropdownFields, 99 );

    /**
     * Re-initializes dropdown functionality when an Elementor popup is opened.
     * This is specifically for compatibility with Elementor popups, as they can
     * often cause rendering issues with Select2 due to their dynamic loading.
     * Triggering a window resize can also help with layout recalculations.
     */
    jQuery( document ).on( 'elementor/popup/show', function () {
        jQuery( window ).trigger( 'resize' ); // Trigger resize to help with layout recalculations.
        reInitializeDropdownFields(); // Re-initialize dropdowns within the popup.
    } );
} );
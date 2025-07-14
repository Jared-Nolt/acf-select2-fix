/**
 * Re-initialize dropdown functionality for Ultimate Member (UM) Select2 fields.
 * This script is intended to be loaded only on ACF Field Groups pages to resolve potential conflicts with other plugins using Select2.
 */
jQuery( function () {
    /**
     * Verifies that there is no empty value selected when multiple options are selected.
     * @param {Event} e The change event object.
     */
    function unselectEmptyOption( e ) {
        var $element = jQuery( e.currentTarget );
        var $selected = $element.find( ':selected' );

        if ( $selected.length > 1 ) {
            $selected.each( function ( i, option ) {
                if ( option.value === '' ) {
                    option.selected = false;
                    $element.trigger( 'change' );
                }
            } );
        }
    }

    /**
     * Re-initializes dropdown functionality for UM Select2 fields.
     * This function destroys existing Select2 instances and re-initializes them with specific configurations for different UM Select2 classes (.um-s1, .um-s2, .um-s3).
     */
    function reInitializeDropdownFields() {
        if ( 'function' === typeof jQuery.fn.select2 ) {
            jQuery( '.um-s1, .um-s2, .um-s3', '.um-form' )
                .filter( '.select2-hidden-accessible' )
                .select2( 'destroy' )
                .off( 'select2:select' )
                .siblings( 'span.select2' )
                .remove();

            jQuery( '.um-s1' ).each( function () {
                var obj = jQuery( this );
                obj.select2( {
                    allowClear: true,
                    dropdownParent: obj.parent()
                } ).on( 'change', unselectEmptyOption );
            } );

            jQuery( '.um-s2' ).each( function () {
                var obj = jQuery( this );
                var atts;

                if ( obj.parents( '.um-custom-shortcode-tab' ).length ) {
                    atts = {
                        allowClear: false
                    };
                } else {
                    atts = {
                        allowClear: false,
                        minimumResultsForSearch: 10,
                        dropdownParent: obj.parent()
                    };
                }
                obj.select2( atts ).on( 'change', unselectEmptyOption );
            } );

            jQuery( '.um-s3' ).each( function () {
                var obj = jQuery( this );
                obj.select2( {
                    allowClear: false,
                    minimumResultsForSearch: -1,
                    dropdownParent: obj.parent()
                } ).on( 'change', unselectEmptyOption );
            } );
        }
    }

    /**
     * Re-initializes dropdown functionality on page load with a small timeout.
     * The timeout is crucial to ensure all other scripts (including conflicting ones) have had a chance to run, allowing this script to re-initialize correctly.
     */
    setTimeout( reInitializeDropdownFields, 99 );

    /**
     * Re-initializes dropdown functionality when an Elementor popup is opened.
     * This is specifically for compatibility with Elementor popups, as they can often cause rendering issues with Select2 due to their dynamic loading.
     * Triggering a window resize can also help with layout recalculations.
     */
    jQuery( document ).on( 'elementor/popup/show', function () {
        jQuery( window ).trigger( 'resize' );
        reInitializeDropdownFields();
    } );
} );
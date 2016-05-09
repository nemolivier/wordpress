<?php

namespace NuitDebout\Wordpress\Widget;

// Creating the widget
class Agenda extends \WP_Widget {

	function __construct() {
		parent::__construct(
			// Base ID of your widget
			'nuitdebout_openagenda',

			// Widget name will appear in UI
			__('NuitDebout Agenda'),

			// Widget description
			array( 'description' => __( 'Widget agenda avec OpenAgenda'), )
		);
	}

	// Creating widget front-end
	// This is where the action happens
	public function widget( $args, $instance ) {
		// $title = apply_filters( 'widget_title', $instance['title'] );
		// // before and after widget arguments are defined by themes
		// echo $args['before_widget'];
		// if ( ! empty( $title ) )
		// echo $args['before_title'] . $title . $args['after_title'];

		// // This is where you run the code and display the output
		// echo __( 'Hello, World!', 'wpb_widget_domain' );
		// echo $args['after_widget'];

		echo $instance['date'];
	}

	// Widget Backend
	public function form( $instance ) {
		if ( isset( $instance[ 'date' ] ) ) {
			$date = $instance[ 'date' ];
		}
		else {
			$date = __( 'Date' );
		}
		// Widget admin form
		?>
		<p>
		<label for="<?php echo $this->get_field_id( 'date' ); ?>"><?php _e( 'Date:' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'date' ); ?>" name="<?php echo $this->get_field_name( 'date' ); ?>" type="text" value="<?php echo esc_attr( $date ); ?>" />
		</p>
		<?php
	}

	// Updating widget replacing old instances with new
	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['date'] = ( ! empty( $new_instance['date'] ) ) ? strip_tags( $new_instance['date'] ) : '';
		return $instance;
	}
} // Class wpb_widget ends here
<?php
	if ( get_field('homepage_screen', 'option') ) {
		// Temporary
		$homepage_bg = get_field('homepage_screen', 'option');
		?>
		<div class="homepagescreen container-fluid" style="
			background: url(<?= $homepage_bg['url'] ?>);
  			background-size: cover !important;
			background-position: center center;">
			<div class="row">
				<div class="col-xs-12">
					<div class="text-center">
						Message
					</div>
				</div>
			</div>
		</div>
		<?php
	}
?>
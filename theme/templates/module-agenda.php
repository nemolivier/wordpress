<section id="agenda" class="section">
    <h2 class="section__title">Agenda</h2>
    <div class="section__content text-center">
        <?php // $agenda_ID = get_field('homepage_agenda_ID', 'option'); ?>
        <p>
        Retrouvez les horaires de réunion des commissions, des AG, ainsi que les actions en cours.
        <br>
        Vous pouvez filtrer les évènements en utilisant la carte ou le calendrier ci-dessous.
        </p>
        <p>
        <strong>Cet agenda est ouvert et collaboratif, tout le monde peut y contribuer.</strong>
        <br>
        <span class="glyphicon glyphicon-hand-right"></span>
        <a href="https://openagenda.com/nuitdebout" target="_blank">Ajouter un évènement à l'agenda Nuit Debout.</a>
        <span class="glyphicon glyphicon-hand-left"></span>
        </p>
    </div>
</section>
<div class="container">
	<div class="row">
	  <div class="col-md-3">
	      	<!-- <div class="cbpgcl cibulCalendar" data-oacl data-cbctl="27805494/8131954|fr" data-lang="fr"></div> -->
	      	<!-- <div class="cbpgmp cibulMap hidden-sm hidden-xs" data-oamp data-cbctl="27805494/8131954" data-lang="fr" ></div> -->
	      	<ul class="list-unstyled">
	     	<?php foreach (openagenda_get_cities() as $city) : ?>
				<li><?php echo $city ?></li>
			<?php endforeach; ?>
			</ul>
	  </div>
	  <div class="col-md-9">
	  		<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
	  			<?php foreach (openagenda_get_events() as $event) : ?>
	  			<?php if ($event['city'] !== 'Paris') : continue; endif; ?>
	  			<div class="panel panel-default">
	  				<div class="panel-heading" role="tab" id="headingOne">
				      	<div class="panel-title">
					        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#oa-event-<?php echo $event['uid'] ?>" aria-expanded="true" aria-controls="collapseOne">
					          	<strong><?php echo $event['firstTimeStart'] ?></strong> <?php echo $event['title']['fr'] ?>
					        </a>
					        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#oa-event-<?php echo $event['uid'] ?>" aria-expanded="true" aria-controls="collapseOne">
					        	<span class="glyphicon glyphicon-chevron-down pull-right"></span>
					        </a>
				      	</div>
				    </div>
				    <div id="oa-event-<?php echo $event['uid'] ?>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
				      	<div class="panel-body">
				        <?php echo $event['description']['fr']  ?>
				        <hr>
				        <a href="<?php echo $event['canonicalUrl'] ?>" target="_blank">
					    	En savoir plus
						</a>
						</div>
				    </div>
				</div>
				<?php endforeach; ?>
			</div>
	      <!-- <iframe style="width:100%;" frameborder="0" scrolling="no" allowtransparency="allowtransparency" class="cibulFrame cbpgbdy" data-oabdy src="//openagenda.com/agendas/27805494/embeds/8131954/events?oaq[from]=<?php echo date('Y-m-d') ?>&oaq[to]=<?php echo date('Y-m-d') ?>"></iframe>-->
	  </div>
	</div>
</div>
<script type="text/javascript" src="//openagenda.com/js/embed/cibulCalendarWidget.js"></script>
<script type="text/javascript" src="//openagenda.com/js/embed/cibulBodyWidget.js"></script>
<script type="text/javascript" src="//openagenda.com/js/embed/cibulMapWidget.js"></script>

<?php

require_once __DIR__.'/../vendor/autoload.php';

use Goutte\Client;

function nd_get_revolutionary_date()
{


	$days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

	$start = new \DateTime('2016-03-31');
	$now = new \DateTime();
	$diff = $now->diff($start);
	$diffDays = $diff->format('%a');
	$dayNumber = $diffDays + 31;

	return sprintf('%s %s Mars', $days[$now->format('w')], $dayNumber);
}


function get_iframe($nid){
	$output = '';
	$prefix = 'homepage_module_free_iframe_';
	if ( get_field($prefix.$nid, 'option') ) :
		$iframe = array(
	    		'url' 	 => get_field($prefix.$nid, 'option'),
	   			'title'  => get_field($prefix.$nid.'_title', 'option'),
	   			'height' => get_field($prefix.$nid.'_height', 'option'),
	   			'id'     => get_field($prefix.$nid.'_id', 'option'),
	   			'class'  => get_field($prefix.$nid.'_class', 'option')
	    );
		$output .= '<div class="section iframe-module iframe-module--'.$nid.'">';
		$output .= 		'<h2 class="section__title">'.$iframe['title'].'</h2>';
		$output .=  	'<iframe src="'.$iframe['url'].'"  height="'.$iframe['height'].'" class="'.$iframe['class'].'" id="'.$iframe['id'].'" allowTransparency="true" frameborder="0" scrolling="no"></iframe>';
		$output .='</div>';
	endif;
    return $output;
}
function getAttachmentThumb($id) {
	$thumb =  get_post_thumbnail_id( $id );
	$url = wp_get_attachment_image_src($thumb , [330, 180])[0];
	return $url;
}

function openagenda_get_cities()
{
	$events = openagenda_get_events();

	$cities = [];
	foreach ($events as $event) {
		$city = $event['city'];
		$cities[] = $city;
	}

	return array_values(array_unique($cities));
}

function openagenda_get_events()
{
	if (!is_home()) {
		return [];
	}

	static $openagenda_events;

	if (!empty($openagenda_events)) {

		return $openagenda_events;
	}

	$client = new Client();

	$agenda_id = '27805494';

	$client->request('GET', "https://openagenda.com/agendas/{$agenda_id}/events.json?oaq[from]=2016-05-06&oaq[to]=2016-05-06");

	$content = $client->getResponse()->getContent();

	$data = json_decode($content, true);

	$openagenda_events = $data['events'];

	return $openagenda_events;
}

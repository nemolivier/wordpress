<?php

require __DIR__.'/../vendor/autoload.php';

use Goutte\Client;

$client = new Client();

$agenda_id = '27805494';

// https://openagenda.com/agendas/27805494/events.json?oaq[from]=2016-05-06&oaq[to]=2016-05-06

// oaq[from]=2016-05-06&oaq[to]=2016-05-06

$client->request('GET', "https://openagenda.com/agendas/{$agenda_id}/events.json?oaq[from]=2016-05-06&oaq[to]=2016-05-06");

$content = $client->getResponse()->getContent();

$data = json_decode($content, true);

$events = $data['events'];

echo '<pre>';
$cities = [];
foreach ($events as $event) {
	print_r($event);
}



=== Plugin Name ===
Contributors: jaapjansma
Donate link: https://civicoop.org/
Tags: contact form 7, cf7, civicrm
Requires at least: 4.3
Tested up to: 4.3
Stable tag: 1.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Contact form 7 CIVICRM integration.

== Description ==

This plugin adds integration for CiviCRM to contact form 7. With this plugin it is possible to submit a contact for to an external CiviCRM.

Per contact form you could enable CiviCRM integration. The submission of the contact form is then submitted to the CiviCRM REST api. That is why you should also enter an CiviCRM entity and an CiviCRM action. The data in the form should then match the data for the api. E.g. if you push a first_name to the api your field should be called first_name.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress
1. Use the Settings->CiviCRM screen to configure the plugin
1. Enable CiviCRM on per form basis.


== Screenshots ==

1. This screenshot shows the settings screen
2. This screenshot shows the screen for enabling and setting up CiviCRM integration at a contact form.

== Changelog ==

= 1.5 =
* Updated readme
= 1.4 =
* Updated text domain
= 1.3 =
* Updated data handling and added a path for the civicrm installation
= 1.2 =
* Updated readme
= 1.1 =
* Changed text domain
= 1.0 =
* Initial commit



var ExpressCurateTopSources = (function ($) {
    var isSetup = false;
    var ADD_RSS_FROM_TOP_SOURCES_URL = '?action=expresscurate_feed_add';

    function addFeed(el, url) {
        ExpressCurateUtils.track('/top-sources/subscribe-rss');

        $.ajax({
            type: 'POST',
            url: ajaxurl + ADD_RSS_FROM_TOP_SOURCES_URL,
            data: {url: url}
        }).done(function (res) {
            var data = $.parseJSON(res),
                $statusButton = el.parent().find('.rssStatus'),
                $tooltip = $statusButton.find('.tooltip');
            if (data.status === 'success') {
                $statusButton.removeClass('rssStatusAdd').addClass('rssStatusYes');
                $tooltip.html('Subscribed');
            } else {
                if (data.status === 'nofeed') {
                    $statusButton.removeClass('rssStatusAdd').addClass('rssStatusNo');
                    $tooltip.html('N/A');
                }
            }
        });
    }

    function setupDom() {

    }

    function setupEvents() {
        /*add rss from top sources*/
        $('.expresscurate_URL').on('click', '.rssStatusAdd', function () {
            var $this = $(this);
            addFeed($this, $this.parent().find('.expresscurate_topCuratedURL').text());
        });

        isSetup = true;
    }

    return {
        setup: function () {
            if (!isSetup) {
                $(document).ready(function () {
                    $.when(setupDom()).then(function () {
                        setupEvents();
                    });
                });
            }
        }
    }
})(window.jQuery);
ExpressCurateTopSources.setup();
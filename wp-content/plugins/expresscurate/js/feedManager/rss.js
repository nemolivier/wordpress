var ExpressCurateRss = (function ($) {
    var $input, $elemToRotate, $rssSettings, $notDefMessage, $feedList, $addFeed, $errorMessage;
    var ADD_RSS_URL = '?action=expresscurate_feed_add',
        REMOVE_RSS_URL = '?action=expresscurate_feed_delete';

    function addFeed() {
        ExpressCurateUtils.track('/rss-feeds/add');
        var message = '',
            link = $input.val(),
            liHTML = '',
            $lastLi;

        ExpressCurateUtils.startLoading($input, $elemToRotate);

        $.ajax({
            type: 'POST',
            url: ajaxurl + ADD_RSS_URL,
            data: {url: link}
        }).done(function (res) {
            var data = $.parseJSON(res);
            if (data.status === 'success') {
                liHTML = ExpressCurateUtils.getTemplate('rssfeedItem', data);
                $('.expresscurate_feedSettingsList').append(liHTML);
                ExpressCurateUtils.notDefinedMessage($notDefMessage, $feedList.find(' > li'));
                $lastLi = $feedList.find(' > li').last();
                ExpressCurateUtils.highlight($lastLi,'expresscurate_highlight');
                $input.val('');
            } else {
                message = data.status;
                ExpressCurateUtils.validationMessages(message, $errorMessage, $input);
            }
        }).always(function () {
            ExpressCurateUtils.endLoading($input, $elemToRotate);
        });
    }

    function deleteFeed(el) {
        ExpressCurateUtils.track('/rss-feeds/delete');

        var link = el.parents('li').find('input').val(),
            $element;

        $.ajax({
            type: 'POST',
            url: ajaxurl + REMOVE_RSS_URL, data: {url: link}
        }).done(function (res) {
            var data = $.parseJSON(res);

            if (data.status === 'success') {
                $element = el.parents('li');
                $.when(ExpressCurateUtils.highlight($element,'expresscurate_highlight')).done(function(){
                    $element.remove();
                });
                ExpressCurateUtils.notDefinedMessage($notDefMessage, $feedList.find(' > li'));
            }
        });
    }

    function setupDom() {
        $rssSettings = $('.expresscurate_feed_dashboard');
        $addFeed = $rssSettings.find('.addFeed');
        $input = $addFeed.find('input');
        $elemToRotate = $addFeed.find('span span');
        $notDefMessage = $rssSettings.find('.expresscurate_notDefined');
        $feedList = $rssSettings.find('.expresscurate_feedSettingsList');
        $errorMessage = $rssSettings.find('.expresscurate_errorMessage');

        if ($rssSettings.length) {
            ExpressCurateUtils.notDefinedMessage($notDefMessage, $feedList.find(' > li'));
        }
    }

    function setupEvents() {
        /*add*/
        $input.on("keyup", function (e) {
            if (e.keyCode === 13) {
                addFeed();
            }
        });
        $elemToRotate.on('click', function () {
            addFeed();
        });

        /*delete*/
        $feedList.on('click', 'li span.close', function () {
            var $this = $(this);
            deleteFeed($this);
        });

        isSetup = true;
    }

    var isSetup = false;

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

ExpressCurateRss.setup();

var ExpressCurateFeedWall = (function ($) {
    var $notDefFeed, $feedControls, $masonryWrap, $feedBoxes, $deleteDialog, $removeDialog, $restoreDialog, $blogFilter, $keywordFilter, $feedList;
    var ADD_BOKMARK_FROM_FEED_URL = '?action=expresscurate_bookmarks_add',
        REMOVE_ARCHIVE_ITEMS_URL = '?action=expresscurate_remove_feed_archive_items',
        REMOVE_CONTENT_FEED_ITEMS_URL = '?action=expresscurate_delete_feed_content_items',
        RESTORE_ARCHIVED_ITEMS_URL = '?action=expresscurate_restore_deleted_items',
        PULL_FEED_MANUALY_URL = '?action=expresscurate_manual_pull_feed',
        SHOW_PULLED_CONTENT_URL = '?action=expresscurate_show_content_feed_items';

    function bookmarkAdd(els) {
        ExpressCurateUtils.track('/content-feed/bookmark');

        var items = [];
        $.each(els, function (index, el) {
            items.push($(el).find('.expresscurate_feedData').text());
        });
        $.ajax({
            type: 'POST',
            url: ajaxurl + ADD_BOKMARK_FROM_FEED_URL,
            data: {items: items}
        });
    }

    function deleteFeedItems(els) {
        ExpressCurateUtils.track('/content-feed/delete');

        var items = [],
            page = location.search.replace('?page=', ''),
            url,
            item;
        if (page == "expresscurate_content_feed_archive") {
            url = ajaxurl + REMOVE_ARCHIVE_ITEMS_URL;
        } else if (page == "expresscurate_feed_list") {
            url = ajaxurl + REMOVE_CONTENT_FEED_ITEMS_URL;
        }
        $.each(els, function (index, el) {
            if (page == "expresscurate_content_feed_archive") {
                item = $(el).find('a.postTitle').data('link');
            } else {
                item = $(el).find('textarea').val();
            }
            items.push(item);
        });
        $.ajax({
            type: 'POST',
            url: url,
            data: {items: items}
        }).done(function (res) {
            var data = $.parseJSON(res);

            if (data.status === 'success') {
                $.when(ExpressCurateUtils.highlight($(els), 'expresscurate_transparent')).done(function () {
                    $(els).remove();
                    $masonryWrap.masonry();
                    ExpressCurateUtils.checkControls($feedControls);
                    ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
                });
            }
        });
    }

    function restoreFeedItems(els) {
        ExpressCurateUtils.track('/content-feed/restore');

        var items = [];

        $.each(els, function (index, el) {
            var item = $(el).find('textarea').val();
            items.push(item);
        });
        $.ajax({
            type: 'POST',
            url: ajaxurl + RESTORE_ARCHIVED_ITEMS_URL,
            data: {items: items}
        }).done(function (res) {
            var data = $.parseJSON(res);
            if (data.status === 'success') {
                $.when(ExpressCurateUtils.highlight($(els), 'expresscurate_transparent')).done(function () {
                    $(els).remove();
                    $masonryWrap.masonry();
                    ExpressCurateUtils.checkControls($feedControls);
                    ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
                })
            }
        });
    }

    function pullFeedManualy() {
        var $loading = $feedControls.find('.loading'),
            $control = $('.feedListControls li.pull');
        ExpressCurateUtils.startLoading(null, $loading);
        $control.addClass('disabled');
        $.ajax({
            type: 'POST',
            url: ajaxurl + PULL_FEED_MANUALY_URL
        }).done(function (res) {
            var data = $.parseJSON(res);
            if (data) {
                $("#expresscurate_feedBoxes").load(ajaxurl + SHOW_PULLED_CONTENT_URL + ' #expresscurate_feedBoxes > li', function () {
                    $('.pullTime p').text('in ' + data.minutes_to_next_pull);
                    $masonryWrap.masonry('destroy').masonry({
                        itemSelector: '.expresscurate_masonryItem',
                        isResizable: true,
                        isAnimated: true,
                        columnWidth: '.expresscurate_masonryItem',
                        gutter: 10
                    });
                    ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
                });
            }
        }).always(function () {
            ExpressCurateUtils.endLoading(null, $loading);
            $control.removeClass('disabled');
        });
    }

    function filterContent(keyword, domain) {
        var $wrap = $('.expresscurate_masonryWrap'),
            $items = $wrap.find(' > li');
        $wrap.masonry('destroy');

        $items.addClass('expresscurate_displayNone').removeClass('expresscurate_masonryItem');

        $.each($items, function (index, value) {
            var $block = $(value),
                $keywords,
                $domain,
                matchKeyword = keyword == 'none',
                matchDomain = domain == 'none';

            $keywords = $block.find('.keywords li.expresscurate_keyword');
            if ($keywords.length) {
                $.each($keywords, function (index, value) {
                    var text = ExpressCurateKeywordUtils.justText($(value));
                    if (text.trim() == keyword.trim()) {
                        matchKeyword = true;
                    }
                });
            }

            $domain = $block.find('.url').text();
            if ($domain.length) {
                if ($domain.trim() == domain.trim()) {
                    matchDomain = true;
                }
            }

            if (matchDomain && matchKeyword) {
                $block.removeClass('expresscurate_displayNone').addClass('expresscurate_masonryItem');
            }

        });
        $wrap.masonry({
            itemSelector: '.expresscurate_masonryItem',
            isResizable: true,
            isAnimated: true,
            columnWidth: '.expresscurate_masonryItem',
            gutter: 10
        });
    }

    function openDeleteConfirm(items, itemChoose) {
        var $deleteDialog = $("#expresscurate_delete_dialog");
        var text = "",
            title = '';
        if (itemChoose == "clicked") {
            title = $(items).find('a.postTitle').text();
            text = 'This post will be deleted: '
        }
        else if (itemChoose == "checked") {
            text = items.length + ' post(s) will be deleted';
        }
        var data = {
            title: title,
            text: text
        };

        $deleteDialog.dialog({
            'dialogClass': 'wp-dialog expresscurate_confirmbox',
            'modal': true,
            'autoOpen': false,
            'closeOnEscape': true,
            'width': '500px',
            'height': 'auto',
            'resizable': false,
            'buttons': {
                'Confirm': function () {
                    deleteFeedItems(items);
                    ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
                    $(this).dialog("close");
                },
                'Cancel': function () {
                    $(this).dialog("close");
                }
            },
            'open': function () {
                var $this = $(this),
                    $buttons = $('.ui-dialog-buttonpane');
                $this.html(ExpressCurateUtils.getTemplate('confirmDialog', data));
                $buttons.find('button:contains("Cancel")').addClass('expresscurate_cancel');
                $buttons.find('button:contains("Confirm")').addClass('expresscurate_confirm');
            }
        });
        $deleteDialog.dialog('open');
    }

    function setupDom() {
        $feedList = $('.expresscurate_feed_list');
        $blogFilter = $('#expresscurate_blogFilter');
        $keywordFilter = $('#expresscurate_keywordFilter');
        $notDefFeed = $feedList.find('.expresscurate_notDefined');
        $feedControls = $('.feedListControls li');
        $masonryWrap = $('.expresscurate_masonryWrap');
        $feedBoxes = $('.expresscurate_feedBoxes');
        $removeDialog = $("#expresscurate_remove_dialog");
        $restoreDialog = $("#expresscurate_restore_dialog");
        $deleteDialog = $("#expresscurate_delete_dialog");
        $masonryWrap.masonry({
            itemSelector: '.expresscurate_masonryItem',
            isResizable: true,
            isAnimated: true,
            columnWidth: '.expresscurate_masonryItem',
            gutter: 10
        });

        if ($feedList.length) {
            ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
        }
        $feedBoxes.find('li input:checkbox').prop('checked', false);
    }

    function setupEvents() {

        /*checkboxes*/
        $feedBoxes.on('change', '.checkInput', function () {
            ExpressCurateUtils.checkControls($feedControls);
        });
        $('.expresscurate_feed_list .check').on('click', function () {
            ExpressCurateUtils.checkControlsWork($feedControls,$feedBoxes)
        });
        /*pull*/
        $('.expresscurate_feed_list .pull').on('click', function () {
            pullFeedManualy();
        });
        /*delete*/
        $('.expresscurate_feed_list .remove').on('click', function () {
            var $checked = $feedBoxes.find('li input:checkbox:checked').parents('.expresscurate_feedBoxes > li');
            openDeleteConfirm($checked, "checked");
        });
        $feedBoxes.on('click', '.controls .hide', function () {
            var $checked = $(this).parents('.expresscurate_feedBoxes > li');
            openDeleteConfirm($checked, "clicked");
        });

        /*bookmark*/
        $feedBoxes.on('click', '.controls .bookmark', function () {
            var $elem = $(this).parents('.expresscurate_feedBoxes > li');
            bookmarkAdd($elem);
            deleteFeedItems($elem);
        });
        $('.feedListControls').on('click', '.bookmark', function () {
            var $checked = $feedBoxes.find('li input:checkbox:checked'),
                $elems = $checked.parents('.expresscurate_feedBoxes > li');
            bookmarkAdd($elems);
            deleteFeedItems($elems);
        });

        $feedBoxes.on('click', '.permanent_remove', function () {
            var $elem = $(this).parents('.expresscurate_feedBoxes > li');
            deleteFeedItems($elem);
            ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
        });
        // confirm feeds' permanent delete
        $feedList.on('click', '.controlsWrap .removePermanently.active', function () {
            var elems = $feedBoxes.find('input:checkbox:checked').parent();
            deleteFeedItems(elems, true);
            ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
        });
        // restore feeds
        $feedList.on('click', '.controlsWrap .restore.active', function () {
            var elems = $feedBoxes.find('input:checkbox:checked').parent();
            restoreFeedItems(elems);
            ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
        });

        $feedBoxes.on('click', '.controls .restore', function () {
            var $elem = $(this).parents('.expresscurate_feedBoxes > li');
            restoreFeedItems($elem);
            ExpressCurateUtils.notDefinedMessage($notDefFeed, $feedBoxes.find(' > li'));
        });

        /*share*/
        $feedBoxes.on('click', '.controls .share', function () {
            var $elem = $(this).parents('.expresscurate_feedBoxes > li'),
                url = $elem.find('a.url').data('encodedurl');
            $.when(deleteFeedItems($elem)).done(function () {
                window.location.href = $('#adminUrl').val() + 'post-new.php?post_type=expresscurate_spost&expresscurate_load_source=' + url;
            });
        });
        /*curate*/
        $('.expresscurate_feed_list .quotes').on('click', function () {
            ExpressCurateUtils.track('/content-feed/curate');

            var $checked = $feedBoxes.find('li input:checkbox:checked');
            if ($checked.length === 1) {
                var $elem = $($checked[0]).parent().find('a'),
                    title = $elem.html(),
                    url = $($checked[0]).parent().find('a.url').data('encodedurl');
                window.location.href = $('#adminUrl').val() + 'post-new.php?expresscurate_load_source=' + url + '&expresscurate_load_title=' + title;
            } else if ($checked.length > 1) {
                ExpressCurateUtils.addSources($checked.parents('.expresscurate_feedBoxes > li'), '.expresscurate_feedData');
                return false;
            }
        });

        /*filters*/
        $keywordFilter.on('change', function () {
            filterContent($(this).val(), $blogFilter.val());
        });

        $blogFilter.on('change', function () {
            filterContent($keywordFilter.val(), $(this).val());
        });

        /*layout*/
        $(window).on('load', function () {
            $masonryWrap.masonry();
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
})
(window.jQuery);

ExpressCurateFeedWall.setup();

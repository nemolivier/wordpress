var ExpressCurateBookmarks = (function ($) {
    var isSetup = false, $input, $elemToRotate, $bookmarkBoxes, $notDefMessage, $controls, $controlsWrap, $addBookmark;
    var UPDATE_BOOKMARK_URL = '?action=expresscurate_bookmark_set',
        DELETE_BOOKMARK_URL = '?action=expresscurate_bookmarks_delete';


    function addComment(elem) {
        var $commentWrap = elem.parent('.comment'),
            $label = $commentWrap.find('label'),
            $close = $commentWrap.find('span'),
            $input = elem,
            link = elem.parents('.expresscurate_bookmarkBoxes > li').find('a.url').attr('href'),
            comment = $input.val().trim();
        $label.removeClass('expresscurate_displayNone');
        $input.add($close).addClass('expresscurate_displayNone');

        $.ajax({
            type: 'POST',
            url: ajaxurl + UPDATE_BOOKMARK_URL,
            data: {
                url: link,
                comment: comment
            }
        }).done(function (res) {
            if (!comment.match(/\S/)) {
                $label.text('add comment').removeClass('active');
            } else {
                var data = $.parseJSON(res);
                if (data.status === 'success') {
                    $label.text($input.val()).addClass('active');
                    $bookmarkBoxes.masonry();
                }
            }
        });

        ExpressCurateUtils.track('/bookmarks/comment');
    }

    function editComment(label) {
        var $commentWrap = label.parent('.comment'),
            $input = $commentWrap.find('input'),
            $close = $commentWrap.find('span');
        label.addClass('expresscurate_displayNone');
        $input.add($close).removeClass('expresscurate_displayNone').addClass('expresscurate_displayInlineBlock');
        $bookmarkBoxes.masonry();
        if (label.text() !== 'add comment') {
            $input.val(label.text());
        } else {
            $input.val('');
        }
    }

    function closeComment(close) {
        var $commentWrap = close.parent('.comment'),
            $label = $commentWrap.find('label'),
            $input = $commentWrap.find('input');
        $label.removeClass('expresscurate_displayNone');
        $input.add(close).addClass('expresscurate_displayNone');
        $label.text('add comment').removeClass('active');
        $bookmarkBoxes.masonry();
    }

    function openDeleteBookmark(items, itemChoose) {
        var $deleteDialog = $("#expresscurate_delete_dialog"),
            text = "",
            title = '';
        if (itemChoose == "clicked") {
            title = $(items).find('a.postTitle').text();
            text = 'This bookmark will be deleted: '
        }
        else if (itemChoose == "checked") {
            text = items.length + ' bookmark(s) will be deleted';
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
                    bookmarkDelete(items);
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

    function addBookmark() {
        //validate url
        var myRegExp = new RegExp('(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)', 'gi'),
            link = $input.val(),
            liHTML = '',
            message = '',
            $errorMessage = $(".addNewBookmark .expresscurate_errorMessage");

        if (!link.match(myRegExp)) {
            message = 'Invalid URL';
            ExpressCurateUtils.validationMessages(message, $errorMessage, $input);
        } else {
            ExpressCurateUtils.startLoading($input, $elemToRotate);
            $.ajax({
                type: 'POST',
                url: ajaxurl + UPDATE_BOOKMARK_URL,
                data: {url: link}
            }).done(function (res) {
                var data = $.parseJSON(res);
                if (data.status === 'success') {
                    $.extend(data.result, {
                        'id': $bookmarkBoxes.find('> li').length
                    });
                    liHTML = ExpressCurateUtils.getTemplate('bookmarksItem', data.result);
                    $bookmarkBoxes.append(liHTML);

                    var $lastLi = $bookmarkBoxes.find('> li').last();
                    $bookmarkBoxes.find('.addNewBookmark').after($lastLi);
                    $bookmarkBoxes.masonry('destroy').masonry({
                        itemSelector: '.expresscurate_masonryItem',
                        isResizable: true,
                        isAnimated: true,
                        columnWidth: '.expresscurate_masonryItem',
                        gutter: 10
                    });

                    ExpressCurateUtils.notDefinedMessage($notDefMessage, $bookmarkBoxes.find(' > li'));
                    $input.val('');
                    ExpressCurateUtils.highlight($lastLi, 'expresscurate_transparent');

                } else if (data.status === 'error' && data.msg !== null) {
                    message = data.msg;
                }
                if (message !== '') {
                    ExpressCurateUtils.validationMessages(message, $errorMessage, $input);
                }
            }).always(function () {
                ExpressCurateUtils.endLoading($input, $elemToRotate);
            });
        }
        ExpressCurateUtils.track('/bookmarks/add');
    }

    function bookmarkDelete(els) {
        var items = [],
            item = {};
        $.each(els, function (index, el) {
            item['link'] = $(el).find('.url').attr('href');
            items.push(item);
            item = {};
        });

        $.ajax({
            type: 'POST',
            url: ajaxurl + DELETE_BOOKMARK_URL,
            data: {items: JSON.stringify(items)}
        }).done(function (res) {
            var data = $.parseJSON(res);
            if (data.status === 'success') {
                $.when(ExpressCurateUtils.highlight($(els), 'expresscurate_transparent')).done(function () {
                    $(els).remove();
                    $bookmarkBoxes.masonry();
                    ExpressCurateUtils.notDefinedMessage($notDefMessage, $bookmarkBoxes.find(' > li'));
                    ExpressCurateUtils.checkControls($controls);
                });
            }
        });

        ExpressCurateUtils.track('/bookmarks/delete');
    }

    function setupDom() {
        $addBookmark = $('.addBookmark');
        $input = $addBookmark.find('input');
        $elemToRotate = $addBookmark.find('span span');
        $bookmarkBoxes = $('.expresscurate_bookmarkBoxes');
        $notDefMessage = $('.expresscurate_bookmarks .expresscurate_notDefined');
        $controls = $('.bookmarkListControls li');
        $controlsWrap = $('.expresscurate_controls');

        if ($('.expresscurate_bookmarks').length) {
            ExpressCurateUtils.notDefinedMessage($notDefMessage, $bookmarkBoxes.find(' > li'));
        }
    }

    function setupEvents() {
        /*scroll*/
        if ($controlsWrap.length) {
            $(window).on('load', function () {
                if (!$('#wpadminbar').length) {
                    $controlsWrap.css('top', 0);
                }
                ExpressCurateUtils.fixedMenu();
            });
            $(window).on('resize, scroll', function () {
                ExpressCurateUtils.fixedMenu();
            });
        }

        /*copy URL*/
        $bookmarkBoxes.on('click', 'li .copyURL', function () {
            var text = $(this).parents('.expresscurate_bookmarkBoxes > li').find('.url').attr('href');
            window.prompt("Copy to clipboard: Ctrl+C, Enter", text);

            ExpressCurateUtils.track('/bookmarks/copy-url');
        });

        /*comment*/
        $bookmarkBoxes.on('click', '.comment label', function () {
            var $this = $(this);
            editComment($this);
        });
        $bookmarkBoxes.on('keyup', '.comment input', function (e) {
            if (e.keyCode === 13) {
                addComment($(this));
            }
        });
        $bookmarkBoxes.on('blur', '.comment input', function () {
            addComment($(this));
        });

        $bookmarkBoxes.on('click touchend', '.comment span', function () {
            var $this = $(this);
            closeComment($this);
        });

        /*checkboxes*/
        $bookmarkBoxes.find('li input:checkbox').prop('checked', false);
        $bookmarkBoxes.on('change', '.checkInput', function () {
            ExpressCurateUtils.checkControls($controls);
        });
        $('.expresscurate_bookmarks .check').on('click', function () {
            ExpressCurateUtils.checkControlsWork($controls, $bookmarkBoxes)
        });

        /*share*/
        $bookmarkBoxes.on('click', '.controls .share', function () {
            var $elem = $(this).parents('.expresscurate_masonryItem'),
                url = $elem.find('a.url').data('encodedurl');
            $.when(bookmarkDelete($elem)).done(function () {
                window.location.href = $('#adminUrl').val() + 'post-new.php?post_type=expresscurate_spost&expresscurate_load_source=' + url;
            });
        });

        /*curate*/
        $('.expresscurate_bookmarks .quotes').on('click', function () {
            ExpressCurateUtils.track('/bookmarks/curate');

            var $checked = $(".expresscurate_bookmarkBoxes li input:checkbox:checked");
            if ($checked.length === 1) {
                var $elem = $($checked[0]).parent().find('a'),
                    title = $elem.html(),
                    url = $($checked[0]).parent().find('a.url').data('encodedurl');
                window.location.href = $('#adminUrl').val() + 'post-new.php?expresscurate_load_source=' + url + '&expresscurate_load_title=' + title;
            } else if ($checked.length > 1) {
                ExpressCurateSourcesWidget.addSources($checked.parents('.expresscurate_bookmarkBoxes > li'), '.expresscurate_bookmarkData');
            }
            return false;
        });

        //delete bookmark
        $('.expresscurate_bookmarks .remove').on('click', function () {
            var $checked = $bookmarkBoxes.find('li input:checkbox:checked').parents('.expresscurate_bookmarkBoxes > li');
            openDeleteBookmark($checked, "checked");
        });
        $bookmarkBoxes.on('click', '.controls .hide', function () {
            var $elem = $(this).parents('.expresscurate_bookmarkBoxes > li');
            openDeleteBookmark($elem, "clicked");
        });

        /*add*/
        $input.on("keyup", function (e) {
            if (e.keyCode === 13) {
                addBookmark();
            }
        });
        $elemToRotate.on('click', function () {
            addBookmark();
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
        },
        bookmarkDelete: bookmarkDelete
    }
})(window.jQuery);
ExpressCurateBookmarks.setup();
var ExpressCurateUtils = (function ($) {
    var isSetup = false, controlsTop;
    var CHANGE_TAB_URL = '?action=expresscurate_change_tab_event',
        CHANGE_LAYOUT_URL = 'expresscurate_change_layout_event';

    function track(action, curate) {
        if (!siteSendAnalytics) {
            ga('expresscurate.send', 'pageview', {
                'page': '/site/' + expresscurate_track_hash
            });
        }
        if (!siteWpSendAnalytics) {
            ga('expresscurate.send', 'pageview', {
                'page': '/site/wp/' + expresscurate_track_hash
            });
        }
        if (curate) {
            ga('expresscurate.send', 'pageview', {
                'page': '/site/curate/' + expresscurate_track_hash
            });
        }
        ga('expresscurate.send', 'pageview', {
            'page': '/action/wp' + action
        });
    }

    /*message for empty lists*/
    function notDefinedMessage(message, list) {
        var pageWithControls = $('.expresscurate_controls').length ? true : false;

        if (list.length > 0) {
            message.addClass('expresscurate_displayNone');
        } else {
            message.removeClass('expresscurate_displayNone');
        }
        if (pageWithControls) {
            emptyListControls(list);
        }
    }

    function emptyListControls(list) {
        var $controls = $('.expresscurate_controls');
        if (list.length > 0) {
            $('.expresscurate_controls li.check').removeClass('disabled');
            fixedMenu();
        } else {
            $controls.removeClass('active');
            $('.expresscurate_controls li.check').addClass('disabled');
            $('.expresscurate_controls li.pull').add($('.expresscurate_controls li.pullTime')).addClass('active');
        }
    }

    /*top fixed menu*/
    function fixedMenu() {
        var top = $(document).scrollTop(),
            $controlsWrap = $('.controlsWrap'),
            $masonryWrap = $('.expresscurate_masonryWrap');
        if ($controlsWrap.length) {
            if (top > controlsTop && !$controlsWrap.hasClass('fixedControls') && $controlsWrap.offset().top > 0) {
                controlsTop = $controlsWrap.offset().top - 30;
                $controlsWrap.addClass('fixedControls');
                $masonryWrap.addClass('expresscurate_marginTop50');
            } else if ($controlsWrap.hasClass('fixedControls') && top <= controlsTop) {
                $controlsWrap.removeClass('fixedControls');
                $masonryWrap.removeClass('expresscurate_marginTop50');
            }
            $('.expresscurate_controls').width($masonryWrap.width());
        }
    }

    /*show/hide controls*/
    function checkControls(controls) {
        var $checkboxes = $('.checkInput'),
            atLeastOneIsChecked = $checkboxes.is(':checked'),
            allIsChecked = $checkboxes.find(':checked').length === $checkboxes.length,
            $checkControl = controls.find('.check');
        if (atLeastOneIsChecked) {
            controls.addClass('active');
        } else {
            controls.removeClass('active');
        }
        if (allIsChecked) {
            $checkControl.addClass('active');
        } else {
            $checkControl.removeClass('active');
        }
    }

    function checkControlsWork(controls, items) {
        var checked = items.find('li input:checkbox:checked').length,
            liCount = items.find(' > li.expresscurate_masonryItem').length,
            $checkboxes = items.find('li.expresscurate_masonryItem input:checkbox');
        if (checked === liCount) {
            $checkboxes.prop('checked', false);
        } else {
            $checkboxes.prop('checked', true);
        }
        ExpressCurateUtils.checkControls(controls);
    }

    /*loading element rotation*/
    function startLoading(input, elemToRotate) {
        if (input) {
            input.prop('disabled', true);
        }
        elemToRotate.addClass('expresscurate_startRotate');
    }

    function endLoading(input, elemToRotate) {
        if (input) {
            input.removeAttr('disabled');
        }
        elemToRotate.removeClass('expresscurate_startRotate');
    }

    /*get html template*/
    function getTemplate(templateName, data) {
        var template = wp.template(templateName);
        return template(data);
    }

    /*highlight element(s)*/
    function highlight(items, style) {
        items.addClass(style);
        setTimeout(function () {
            items.removeClass(style);
        }, 2000);
    }

    /*validation*/
    function validationMessages(messageText, message, input) {
        $(message).text(messageText).addClass('errorActive');
        $(input).prop('disabled', true).blur().addClass('expresscurate_errorMessageInput');
        setTimeout(function () {
            $(message).removeClass('errorActive');
            setTimeout(function () {
                $(message).text('');
                $(input).removeClass('expresscurate_errorMessageInput').removeAttr('disabled').focus();
            }, 300);
        }, 3000);
    }

    /*animate scrolling */
    function animateScroll(target) {
        $('html, body').animate({
            scrollTop: target.offset().top - 40
        }, 700);
    }

    function tabChangeStatus(control) {
        var tabID = control.attr('data-tab');
        if (!control.hasClass('disabled')) {
            $('ul.tabs li').add($('.tab-content')).removeClass('current');
            control.add($("#" + tabID)).addClass('current');

            $.ajax({
                type: "POST",
                url: ajaxurl + CHANGE_TAB_URL,
                data: {tab: tabID}
            });
        }
    }

    function changePageLayout() {
        var $wrap = $('.expresscurate_Styles.wrap'),
            page = ($wrap.hasClass('expresscurate_feed_list')) ? 'expresscurate_feed_layout' : 'expresscurate_bookmark_layout',
            layout = '',
            $layoutTooltip = $('.expresscurate_controls li.layout .tooltip'),
            $masonryWrap = $('.expresscurate_masonryWrap');
        if ($wrap.hasClass('expresscurate_singleColumn')) {
            layout = 'grid';
            $wrap.removeClass('expresscurate_singleColumn');
            $layoutTooltip.text('view as list');
        } else {
            layout = 'single';
            $wrap.addClass('expresscurate_singleColumn');
            $layoutTooltip.text('view as grid');
        }
        $.ajax({
            type: 'POST',
            url: ajaxurl + CHANGE_LAYOUT_URL,
            data: {
                page: page,
                layout: layout
            }
        });
        $('.expresscurate_controls').width($masonryWrap.width());
        $masonryWrap.masonry();
    }

    function setupDom() {
        /*settings page tabs*/
        if ($('.expresscurate_settings').length) {
            var $tabs = $('.tabs'),
                tabID = $tabs.attr('data-currenttab'),
                currentTab;
            if (tabID.length < 1) {
                tabID = 'tab-1';
            }
            currentTab = $tabs.find('li[data-tab=' + tabID + ']');
            if (tabID && !currentTab.hasClass('disabled')) {
                $('ul.tabs li').add($('.tab-content')).removeClass('current');
                currentTab.add($("#" + tabID)).addClass('current');
            }
        }
        /*fixed menu*/
        var $controlsTop = $('.controlsWrap');
        if ($controlsTop.length) {
            controlsTop = $controlsTop.offset().top - 30;
        }
    }

    function setupEvents() {
        $('.expresscurate_advancedSEO_widget ul.tabs li,.expresscurate ul.tabs li').click(function () {
            var $this = $(this);
            tabChangeStatus($this);
        });

        /*layout*/
        $('.expresscurate_controls .layout').on('click', function () {
            changePageLayout();
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
        track: track,
        notDefinedMessage: notDefinedMessage,
        startLoading: startLoading,
        endLoading: endLoading,
        getTemplate: getTemplate,
        highlight: highlight,
        validationMessages: validationMessages,
        fixedMenu: fixedMenu,
        checkControls: checkControls,
        checkControlsWork: checkControlsWork,
        animateScroll: animateScroll
    }
})(window.jQuery);
ExpressCurateUtils.setup();
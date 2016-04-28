var ExpressCurateKeywords = (function ($) {
    var $input,
        $elemToRotate,
        $notDefKeywordsMessage,
        $notDefWordsMessage,
        $keywordsPart,
        $settingsPage,
        $autoComplete,
        $addKeywordInput;
    var ADD_KEYWORD_URL = '?action=expresscurate_keywords_add_keyword',
        DELETE_KEYWORD_URL = '?action=expresscurate_keywords_delete_keyword';

    function addKeyword(keywords, $beforeElem) {
        var keywordsToHighlight = keywords,
            $errorMessage = $('.addNewKeyword .expresscurate_errorMessage');
        keywords = keywords.join(',');
        var keywordHtml = '',
            errorMessage = '';

        ExpressCurateUtils.startLoading($input, $elemToRotate);
        $errorMessage.text('');

        if (keywords.length > 2) {
            $.ajax({
                type: 'POST',
                url: ajaxurl + ADD_KEYWORD_URL,
                data: {
                    keywords: keywords,
                    get_stats: true
                }
            }).done(function (res) {
                var data = $.parseJSON(res);
                if (data.status === 'success') {
                    $beforeElem.html('');
                    $.each(data.stats, function (key, value) {
                        $.extend(value, {
                            'keyword': key,
                            'url': 'post-new.php?post_title=' + encodeURIComponent("TODO: define post title using " + key) + '&content=' + encodeURIComponent("TODO: write content using " + key) + '&expresscurate_keyword=' + key + '""post-new.php?post_title=' + encodeURIComponent("TODO: define post title using " + key) + '&content=' + encodeURIComponent("TODO: write content using " + key) + '&expresscurate_keyword=' + key
                        });
                        keywordHtml = ExpressCurateUtils.getTemplate('keywordsSettings', value);
                        $beforeElem.append(keywordHtml);
                        $autoComplete.find('li').remove();
                        notDefinedMessage($notDefKeywordsMessage, $keywordsPart.find(' ul li'));
                    });
                } else if (data.msg === 'Something went wrong') {
                    errorMessage = 'Calculation Error. Please try refreshing this web page.  If the problem persists, <a href="admin.php?page=expresscurate&type=keywords">contact us</a> at support@expresscurate.com'
                }
            }).always(function () {

                ExpressCurateUtils.endLoading($input, $elemToRotate);
                $(keywordsToHighlight).each(function (index, value) {
                    ExpressCurateKeywordUtils.highlight(value, $beforeElem.find('li'));
                });

            });
        } else {
            errorMessage = 'This keyword is too short.  We recommend keywords with at least 3 characters.';
            ExpressCurateUtils.endLoading($input, $elemToRotate);
        }
        if (errorMessage !== '') {
            $errorMessage.text(errorMessage);
        }

        ExpressCurateUtils.track('/keywords/add');
    }

    function insertKeywordInKeywordsSettings(keyword, $beforeElem) {
        if (keyword.length > 0) {
            $autoComplete.find('li').remove();
            addKeyword(keyword, $beforeElem);
            notDefinedMessage($notDefKeywordsMessage, $keywordsPart.find(' ul li'));
        }
    }

    function notDefinedMessage(message, list) {
        if (list.length > 0) {
            message.addClass('expresscurate_displayNone');
            message.parent().removeClass('expresscurate_notDefinedWrap');
        } else {
            message.removeClass('expresscurate_displayNone');
            message.parent().addClass('expresscurate_notDefinedWrap');
        }
    }

    function setupDom() {
        $settingsPage = $('.expresscurate_keywords_settings');
        $keywordsPart = $('.keywordsPart');
        $autoComplete = $keywordsPart.find('.suggestion');
        $input = $('.addKeywords input');
        $elemToRotate = $('.addKeywords span span');
        $notDefKeywordsMessage = $keywordsPart.find('.expresscurate_notDefined');
        $notDefWordsMessage = $('.usedWordsPart .expresscurate_notDefined');
        $addKeywordInput = $settingsPage.find('.addKeywords input');

        notDefinedMessage($notDefKeywordsMessage, $keywordsPart.find('ul li'));
        notDefinedMessage($notDefWordsMessage, $('.usedWordsPart ul li'));
    }

    function setupEvents() {
        /*keywords alert*/
        $('html').on('click', '#expresscurate_keyword_dialog a.button-primary, #expresscurate_keyword_dialog a.cancel', function () {
            tinymce.activeEditor.windowManager.close();
            $addKeywordInput.focus();
        });

        /*autoComplete*/
        $addKeywordInput.on("keyup", function (e) {
            if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 27) {
                e.preventDefault();
                return;
            }
            var list = $autoComplete.find('li');
            list.remove();

            if (e.keyCode === 13) {
                insertKeywordInKeywordsSettings(ExpressCurateKeywordUtils.multipleKeywords($('.addKeywords input'), $keywordsPart), $keywordsPart.find('div > ul'));
            } else {
                ExpressCurateKeywordUtils.keywordsSuggestions($(this));
            }

        });

        ExpressCurateKeywordUtils.suggestionsKeyboardNav($addKeywordInput.eq(0));

        $settingsPage.on('click', function (e) {
            var $this = $(this);
            if ($(e.target).is('.suggestion li')) {
                var newKeyword = $(e.target).text();
                $addKeywordInput.val(newKeyword);
                insertKeywordInKeywordsSettings(ExpressCurateKeywordUtils.multipleKeywords($addKeywordInput, $keywordsPart), $keywordsPart.find(' div > ul'));
            }
        });

        /*add keywords*/
        $settingsPage.find('.addKeywords span').on('click', function () {
            $autoComplete.find('li').remove();
            insertKeywordInKeywordsSettings(ExpressCurateKeywordUtils.multipleKeywords($addKeywordInput, $keywordsPart), $keywordsPart.find(' div > ul'));
        });

        $('.usedWordsPart ul').on('click', '.add', function () {
            $(this).parents('li').addClass('expresscurate_highlight');
            $autoComplete.find('li').remove();
            insertKeywordInKeywordsSettings(ExpressCurateKeywordUtils.multipleKeywords($(this).parent().find('.word'), $keywordsPart), $keywordsPart.find(' div> ul'));
            $(this).parents('li').fadeOut(1000).remove();
            notDefinedMessage($notDefWordsMessage, $('.usedWordsPart ul li'));
        });

        /*delete keywords*/
        $keywordsPart.find(' ul').on('click', '.remove', function () {
            var $obj = $(this),
                keyword = ExpressCurateKeywordUtils.justText($(this).parent().find('.word'));
            $.ajax({
                type: 'POST',
                url: ajaxurl + DELETE_KEYWORD_URL,
                data: {keyword: keyword}
            }).done(function (res) {
                var data = $.parseJSON(res);
                if (data.status === 'success') {
                    $.when(ExpressCurateUtils.highlight($obj.parent('li'),'expresscurate_highlight')).done(function(){
                        ExpressCurateKeywordUtils.close(ExpressCurateKeywordUtils.justText($obj.parent().find('.word')), $obj.parent('li'));
                        notDefinedMessage($notDefKeywordsMessage, $keywordsPart.find(' ul li'));
                    });
                }
            });

            ExpressCurateUtils.track('/keywords/delete');
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
ExpressCurateKeywords.setup();

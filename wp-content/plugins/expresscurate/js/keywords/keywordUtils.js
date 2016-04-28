var ExpressCurateKeywordUtils = (function ($) {
    var autoCompleteRequest, activeMarkButton = false,
        colors = ['Red', 'Blue', 'Green', 'Orange', 'LightBlue', 'Yellow', 'LightGreen'];
    var GET_KEYWORDS_SUGGESTIONS = '?action=expresscurate_keywords_get_suggestions';

    function checkKeyword(text, listName, defElem) {
        if (text !== '') {
            text = text.replace(/[,.;:?!]+/g, '').trim();
            var $defTags = defElem ? defElem : $('textarea[name=expresscurate_defined_tags]'),
                defVal = justText($defTags).replace(/\s{2,}/g, ' '),
                $widget = $('#expresscurate_widget'),
                $errorMessage = $widget.find('.expresscurate_errorMessage'),
                defValArr = defVal.split(', ');
            $errorMessage.remove();
            if (text.length < 3 && $widget.length) {
                $errorMessage.text('This keyword is too short.  We recommend keywords with at least 3 characters.');
            } else {
                for (var i = 0; i < defValArr.length; i++) {
                    if (defValArr[i].toLowerCase() === text.toLowerCase()) {
                        if ($widget.length > 0) {
                            highlight(text, $widget.find(' .statisticsTitle'));
                        } else if (listName !== undefined) {
                            highlight(text, listName.find('div > ul li'));
                        }
                        text = '';
                        break;
                    }
                }
                if (!/^\s+$/.test(text) && text.length > 2) {
                    var s;
                    if (defVal === '') {
                        s = text;
                    } else {
                        s = defVal + ', ' + text;
                    }

                    $defTags.val(s);
                    $defTags.text(s);
                    if (listName) {
                        listName.find('.expresscurate_notDefined').addClass('expresscurate_displayNone');
                    }
                }
            }
        }
        return text;
    }

    function multipleKeywords(el, listName, defElem) {
        var keywords = '',
            arr,
            result = [];

        if (el.is('span')) {
            keywords = justText(el);
        } else {
            keywords = el.val();
            el.val('');
        }

        arr = keywords.split(/,|:|;|[\\.]/);
        for (var i = 0; i < arr.length; i++) {
            var checkedKeyword = checkKeyword(arr[i], listName, defElem);
            if (checkedKeyword.length > 0) {
                result.push(checkedKeyword);
            }
        }
        return result;
    }

    function close(keyword, elemToRemove, defElem) {
        keyword = escapeRegExp(keyword);
        var $defTags = defElem ? defElem : $('textarea[name=expresscurate_defined_tags]'),
            newVal = justText($defTags).toLocaleLowerCase().trim(),
            lastChar = '',
            myRegExp = new RegExp('(, |^)' + keyword.toLocaleLowerCase() + '(,|$)', 'gmi');

        newVal = newVal.replace(myRegExp, '');
        lastChar = newVal.slice(-2);
        if (lastChar === ', ') {
            newVal = newVal.slice(0, -2);
        }
        if (newVal.match(/^, /)) {
            newVal = newVal.slice(2);
        }

        $defTags.val(newVal);
        $defTags.html(newVal);
        elemToRemove.remove();
    }

    function highlight(text, li) {
        var keyword = text,
            $elem, i;

        li.each(function (index, value) {
            if ($(value).is('#expresscurate_widget .statisticsTitle')) {
                if ($(value).find('span').text().toLowerCase() === text.toLowerCase()) {
                    $elem = $(this).closest('.expresscurate_background_wrap');
                    i = $elem.closest('.expresscurate_widget_wrapper').find('.expresscurate_background_wrap').index($elem);
                    ExpressCurateUtils.highlight($elem, 'highlight');
                }
            } else if (justText($(value).find('.word')).toLowerCase().trim() === keyword.toLowerCase()) {
                $elem = $(value);
                ExpressCurateUtils.highlight($elem, 'expresscurate_highlight');
            }
        });
    }

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function justText(elem) {
        if (elem.clone().children().length > 0) {
            return elem.clone()
                .children()
                .remove()
                .end()
                .text();
        } else {
            return elem.text();
        }
    }

    function keywordsSuggestions(input) {
        if (input.val().length > 1) {
            var liHTML = '',
                text = input.val(),
                $autoComplete = $('.suggestion');
            if (autoCompleteRequest && autoCompleteRequest.readystate !== 4) {
                autoCompleteRequest.abort();
                $autoComplete.find('li').remove();
            }

            autoCompleteRequest = $.ajax({
                type: 'GET',
                url: ajaxurl + GET_KEYWORDS_SUGGESTIONS,
                data: {
                    term: text
                }
            }).done(function (res) {
                var data = $.parseJSON(res);
                $.each(data.slice(0, 3), function (key, value) {
                    liHTML += '<li>' + value + '</li>';
                });
                if (liHTML.length > 0) {
                    $autoComplete.find('li').remove();
                    $autoComplete.append(liHTML);
                }
            });
        }
    }

    function suggestionsKeyboardNav(input) {
        // keyboard navigation start
        var $input = $(input);

        var getKey = function (e) {
            if (window.event) {
                return e.keyCode;
            }  // IE
            else if (e.which) {
                return e.which;
            }    // Netscape/Firefox/Opera
        };

        var pressed = false;
        var curText = '';

        var moveUp = function (suggestions, e) {
            e.preventDefault();
            if (!pressed) {
                pressed = true;
                var $listItems = suggestions.children('li');
                var i = $listItems.index(suggestions.children('li.express_curate_selected_list_item')) - 1;
                if (i === -1) {
                    $listItems.removeClass('express_curate_selected_list_item');
                    $input.val(curText);
                } else if (i >= 0) {
                    $listItems.removeClass('express_curate_selected_list_item');
                    $listItems.eq(i).addClass('express_curate_selected_list_item');
                    $input.eq(0).val($listItems.eq(i).text());
                }
                pressed = false;
            }
        };

        var moveDown = function (suggestions, e) {
            e.preventDefault();
            if (!pressed) {
                pressed = true;
                var $listItems = suggestions.children('li');
                var i = $listItems.index(suggestions.children('li.express_curate_selected_list_item')) + 1;
                if (i > $listItems.length - 1) {
                    i = $listItems.length - 1;
                }
                $listItems.removeClass('express_curate_selected_list_item');
                $listItems.eq(i).addClass('express_curate_selected_list_item');
                $input.eq(0).val($listItems.eq(i).text());
                pressed = false;
            }
        };

        $input.on('keyup', function (e) {
            if (!(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 27 || e.keyCode === 13)) {
                if (curText !== $input.eq(0).val()) {
                    curText = $input.eq(0).val();
                }
            }
            if ($input.siblings('.suggestion').eq(0).is(':visible')) {
                switch (getKey(e)) {
                    case 38:    // UP
                        moveUp($input.siblings('.suggestion').eq(0), e);
                        break;
                    case 40:    // DOWN
                        moveDown($input.siblings('.suggestion').eq(0), e);
                        break;
                    case 27:    // ESC
                        $input.siblings('.suggestion').hide();
                        break;
                    default:
                }
            }
        });

        $input.on('keydown', function (e) {
            if (e.keyCode === 38) {
                e.preventDefault();
            }
        });
        // keyboard navigation end
    }

    function markKeywords(ed, keywords) {
        var $highlightedElems = $(ed.getBody()).find('span.expresscurate_keywordsHighlight');

        if (keywords) {
            var bookmark = ed.selection.getBookmark();
            $highlightedElems.each(function (index, val) {
                $(val).replaceWith(this.childNodes);
            });
            var matches = ed.getBody(),
                i = 0;

            keywords = keywords.sort(function (a, b) {
                return b.length > a.length
            });

            keywords.forEach(function (val) {
                $(matches).html(function (index, oldHTML) {
                    return oldHTML.replace(new RegExp('((^|\\s|>|))(' + val + ')(?=[^>]*(<|$))(?=(&nbsp;|\\s|,|\\.|:|!|\\?|\'|\"|\\;|.?<|$))', 'gmi'), '$2<span class="expresscurate_keywordsHighlight expresscurate_highlight' + colors[i % 7] + '">$3</span>');
                });
                i++;
            });

            $(ed.getBody()).find('span.expresscurate_keywordsHighlight').each(function (index, val) {
                if ($(val).parent().hasClass('expresscurate_keywordsHighlight')) {
                    $(val).replaceWith(this.childNodes);
                }
            });
            if ($(ed.getBody()).find('span.expresscurate_keywordsHighlight').length > 0) {
                ed.controlManager.setActive('markKeywords', true);
            }
            ed.selection.moveToBookmark(bookmark);
        }
    }

    function markEditorKeywords() {
        var definedKeywords = $('#expresscurate_defined_tags').val();

        if (typeof(tinyMCE) === "object" && typeof(tinyMCE.execCommand) === "function" && $('.expresscurate_widget').length > 0) {
            var ed = tinyMCE.get('content'),
                keywords = ((definedKeywords !== '') ? definedKeywords.split(', ') : null),
                $highlightedElems = $(ed.getBody()).find('span.expresscurate_keywordsHighlight');

            if (!keywords) {
                ed.controlManager.setActive('markKeywords', false);
                $highlightedElems.each(function (index, val) {
                    $(val).replaceWith(this.childNodes);
                });
                var dialog = tinyMCE.activeEditor.windowManager.open({
                    title: 'Mark keywords',
                    id: 'expresscurate_keyword_dialog',
                    width: 450,
                    height: 80,
                    html: '<label class="expresscurate_keywordMessage">Currently you don&#39;t have any defined keywords.</label>',
                    buttons: [{
                        text: 'Start adding now',
                        classes: 'expresscurate_socialInsertButton',
                        disabled: false,
                        onclick: function () {
                            ExpressCurateUtils.animateScroll($("#expresscurate"));
                            dialog.close();
                            $('.expresscurate_widget .addKeywords input').focus();
                        }
                    }]
                });
            } else if (ed) {
                if (!activeMarkButton) {
                    ed.controlManager.setActive('markKeywords', true);
                    activeMarkButton = true;
                    markKeywords(ed, keywords);
                } else {
                    $highlightedElems.each(function (index, val) {
                        $(val).replaceWith(this.childNodes);
                    });
                    ed.controlManager.setActive('markKeywords', false);
                    activeMarkButton = false;
                }
            }
        }

        ExpressCurateUtils.track('/post/content/keywords/mark');
    }

    function markCuratedKeywords() {
        var ed = tinyMCE.activeEditor,
            $highlightedElems = $(ed.getBody()).find('span.expresscurate_keywordsHighlight'),
            keywords = [];

        $('#curated_tags').find('li').each(function (index, value) {
            keywords.push($(value).text().trim());
        });
        keywords.pop();

        if ($(ed.getBody()).find('span.expresscurate_keywordsHighlight').length <= 0) {
            ExpressCurateKeywordUtils.markKeywords(ed, keywords);
        } else {
            $highlightedElems.each(function (index, val) {
                $(val).replaceWith(this.childNodes);
            });
        }

        ExpressCurateUtils.track('/post/content-dialog/content/keywords/mark');
    }

    return {
        checkKeyword: checkKeyword,
        multipleKeywords: multipleKeywords,
        close: close,
        highlight: highlight,
        justText: justText,
        keywordsSuggestions: keywordsSuggestions,
        suggestionsKeyboardNav: suggestionsKeyboardNav,
        markEditorKeywords: markEditorKeywords,
        markCuratedKeywords: markCuratedKeywords,
        markKeywords: markKeywords
    }
})(window.jQuery);
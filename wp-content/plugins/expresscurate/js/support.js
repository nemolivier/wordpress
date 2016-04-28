var ExpressCurateTopSources = (function ($) {
    var isSetup = false;

    /*validation for support and FAQ*/
    function expresscurateSupportSubmit() {
        var $form = $('#expresscurate_support_form'),
            validMsg = true,
            $supportMessage = $("#expresscurate_support_message"),
            msg = $supportMessage.val(),
            $supportMail = $("#expresscurate_support_email"),
            email = $supportMail.val(),
            regularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            validEmail = regularExpression.test(email),
            $messageError = $('#expresscurate_support_message_validation'),
            $mailError = $('#expresscurate_support_email_validation');

        $form.find('.expresscurate_errorMessage').text('');

        if (msg === "" || !msg) {
            validMsg = false;
            ExpressCurateUtils.validationMessages('Please enter the message', $messageError, $supportMessage);
        } else if (msg.length < 3) {
            validMsg = false;
            ExpressCurateUtils.validationMessages('Message is too short', $messageError, $supportMessage);
        }

        if (email === "" || !email) {
            validEmail = false;
            ExpressCurateUtils.validationMessages('Please enter the email', $mailError, $supportMail);
        } else if (!validEmail) {
            ExpressCurateUtils.validationMessages('Email is not valid', $mailError, $supportMail);
        }
        if (validEmail && validMsg) {
            $form.submit();
        }
        return false;
    }

    function setupDom() {

    }

    function setupEvents() {
        /*support submit*/
        $('#expresscurate_support_form').on('click', '.feedbackButton, .askButton', function () {
            expresscurateSupportSubmit();
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
        expresscurateSupportSubmit: expresscurateSupportSubmit
    }
})(window.jQuery);
ExpressCurateTopSources.setup();
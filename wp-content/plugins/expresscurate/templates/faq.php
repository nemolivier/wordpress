<?php
global $current_user;
get_currentuserinfo();
$user_email = '';
if ($current_user->user_email) {
    $user_email = $current_user->user_email;
}
$sent = false;
if ($_POST) {
    if ($_POST['expresscurate_support_email'] && $_POST['expresscurate_support_message']) {
        $expressCurateEmail = new ExpressCurate_Email();
        $sent = $expressCurateEmail->sendSupportEmail($_POST['expresscurate_support_email'], 'Expresscurate FAQ', stripslashes($_POST['expresscurate_support_message']));
        unset($_POST);
    }
}
$feed = ExpressCurate_Actions::getCurationNews('http://news.expresscurate.com/category/faq/feed/');
$limit = 3;
?>


<div class="expresscurate_faq wrap">
    <div class="expresscurate_headBorderBottom expresscurate_OpenSansRegular">
        <h2><?php _e('FAQ'); ?></h2>
    </div>
    <h2 class="expresscurate_displayNone"><?php _e('FAQ'); ?></h2>

    <div>
        <div class="block questions">
            <?php
            if (!empty($feed)) {
                $i = 0;
                foreach ($feed as $item) {
                    if ($i == $limit) {
                        break;
                    }
                    $i++;
                    $title = str_replace(' & ', ' &amp; ', $item['title']);
                    $link = $item['link'];
                    ?>
                    <div class="inlineBlock">
                        <a class="questionBox" href="<?php echo $link ?>"
                           target="_blank"><span><?php echo $title ?></span></a>
                    </div>
                    <?php
                }
                ?>
                <div class="inlineBlock">
                    <a class="questionBox moreQuestions" href="http://news.expresscurate.com/category/faq/"
                       target="_blank"><span><?php _e('More questions'); ?></span></a>
                </div>
            <?php } else {
                ?>
                <div class="inlineBlock">
                    <a class="questionBox moreQuestions" href="http://news.expresscurate.com/category/faq/"
                       target="_blank"><span><?php _e('Visit our faq blog'); ?></span></a>
                </div>
            <?php }
            ?>
        </div>
        <div class="block">
            <?php if (!$sent) { ?>
                <label for="expresscurate_support_email"><?php _e('Ask a question'); ?></label>
                <?php
            } else {
                ?>
                <label for="expresscurate_support_email"><?php _e('Your question has been sent'); ?></label>
                <?php
            }
            ?>
            <form method="post" action="" id="expresscurate_support_form">
                <div class="errorMessageWrap">
                    <input id="expresscurate_support_email" name="expresscurate_support_email" class="inputStyle"
                           placeholder="Email"
                           value="<?php echo $user_email ?>"/>
                    <span><?php _e('Please make sure to provide a working email address so that we can respond back to your support issue.'); ?></span>
                    <span id="expresscurate_support_email_validation" class="expresscurate_errorMessage"></span>
                </div>
                <div class="errorMessageWrap">
        <textarea class="inputStyle" name="expresscurate_support_message" id="expresscurate_support_message"
                  placeholder="Question"></textarea>
                    <span id="expresscurate_support_message_validation" class="expresscurate_errorMessage"></span>
                </div>
                <a class="askButton send greenBackground" href="#"><?php _e('Ask'); ?></a>
            </form>
        </div>
    </div>
</div>

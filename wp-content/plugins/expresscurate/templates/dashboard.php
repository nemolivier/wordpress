<?php
global $current_user;
get_currentuserinfo();
$user_email = '';
if ($current_user->user_email) {
    $user_email = $current_user->user_email;
}
if (isset($_GET['type']) && $_GET['type'] == 'keywords') {
    $msg_placeholder = 'Please, write your suggestions here ...';
}
$sent = false;
if ($_POST) {
    if ($_POST['expresscurate_support_email'] && $_POST['expresscurate_support_message']) {
        wp_mail('support@expresscurate.com', 'Plugin feedback', $_POST['expresscurate_support_message']);
        $sent = true;
        unset($_POST);
    }
}
?>
<div class="expresscurate_blocks expresscurate_Styles wrap">
    <div class="expresscurate_headBorderBottom expresscurate_OpenSansRegular">
        <a href="admin.php?page=expresscurate_support" class="expresscurate_writeUs"><?php _e('Suggestions?
            '); ?><span><?php _e('Submit here!'); ?></span></a>

        <h2><?php _e('ExpressCurate'); ?></h2>
    </div>
    <div class="expresscurate_blocksContainer expresscurate_masonryWrap">
        <?php
        $dashboard_order = get_option('dashboard_items_order') ? get_option('dashboard_items_order') : array();
        $allWidgets = array('welcome', 'keyWords', 'keyWordsIntOverTime', 'keyWordsRelTopics', 'smartPublish', 'socialPublish', 'feedWidget', 'bookmarks', 'support');
        foreach ($allWidgets as $item) {
            if (!in_array($item, $dashboard_order)) {
                $dashboard_order[] = $item;
            }
        }
        if (!empty($dashboard_order)) {
            foreach ($dashboard_order as $ordered_item):
                if ($ordered_item == "welcome"):
                    echo '<div id="welcome" class="expresscurate_welcomeBlock expresscurate_masonryItem">
                                            <label class="label">' . __('Welcome to ExpressCurate!') . '</label>';
                    $this->welcome_widget();
                    echo '</div>';
                endif;
                if ($ordered_item == "keyWords"):
                    echo '<div id="keyWords" class="expresscurate_keywordsBlock expresscurate_masonryItem">
                                            <label class="label">' . __('Keywords Summary') . '</label>';
                    $this->keywords_widget();
                    echo '</div>';
                endif;
                if ($ordered_item == "keyWordsIntOverTime"):
                    echo '<div id="keyWordsIntOverTime" class="expresscurate_keywordsBlock expresscurate_masonryItem">
                                        <label class="label">' . __('Keywords Interest Over Time') . '</label>';
                    $this->keywords_interest_over_time_widget();
                    echo '</div>';
                endif;
                if ($ordered_item == "keyWordsRelTopics"):
                    echo '<div id="keyWordsRelTopics" class="expresscurate_keywordsBlock expresscurate_masonryItem">
                                        <label class="label">' . __('Keywords Related Topics') . '</label>';
                    $this->keywords_related_topics_widget();
                    echo '</div>';
                endif;
                if ($ordered_item == "smartPublish"):
                    if (get_option('expresscurate_publish', '') == "on") {
                        echo '<div id="smartPublish" class="expresscurate_smartPublishBlock expresscurate_masonryItem">
                                            <label class="label">' . __('Smart Publishing Overview') . '</label>';
                        $this->smart_publishing_widget();
                        echo '</div>';
                    }
                endif;
                if ($ordered_item == "socialPublish"):
                    if (get_option('expresscurate_social_publishing', '') == "on" && strlen(get_option('expresscurate_buffer_access_token')) > 2) {
                        echo '<div id="socialPublish" class="expresscurate_socialPublishBlock expresscurate_masonryItem">
                                            <label class="label">' . __('Social Publishing Overview') . '</label>';
                        $this->social_publishing_widget();
                        echo '</div>';
                    }
                endif;
                if ($ordered_item == "feedWidget"):
                    echo '<div id="feedWidget" class="expresscurate_feedBlock expresscurate_masonryItem">
                                            <label class="label">' . __('Feed') . '</label>';
                    $this->feed_widget();
                    echo '</div>';
                endif;
                if ($ordered_item == "bookmarks"):
                    echo '<div id="bookmarks" class="expresscurate_bookmarksBlock expresscurate_masonryItem">
                                            <label class="label">' . __('Bookmarks') . '</label>';
                    $this->bookmarks_widget();
                    echo '</div>';
                endif;
                if ($ordered_item == "support"):
                    echo '<div id="support" class="expresscurate_supportBlock expresscurate_masonryItem">
                                        <label class="label">' . __('Support') . '</label><div>';
                    if (!$sent) {
                        echo '<label for="expresscurate_support_email">' . __('Leave your feedback') . '</label>';
                    } else {
                        echo '<label for="expresscurate_support_email">' . __('Thanks for your feedback') . '</label>';
                    }
                    echo '<form method="post" action="' . get_admin_url() . 'admin.php?page=expresscurate"
                                                  id="expresscurate_support_form">
                                                <div class="errorMessageWrap">
                    <input id="expresscurate_support_email" name="expresscurate_support_email" class="inputStyle"
                           placeholder="Email"
                           value="' . $user_email . '"/>
                    <span id="expresscurate_support_email_validation" class="expresscurate_errorMessage"></span>
                </div>
                                       <div class="errorMessageWrap">
               <textarea class="inputStyle" name="expresscurate_support_message" id="expresscurate_support_message"
                         placeholder="' . $msg_placeholder . '"></textarea>
                    <span class="expresscurate_errorMessage" id="expresscurate_support_message_validation"></span>
                </div>
                                                <a class="feedbackButton send greenBackground" href="#">Send</a>
                                            </form>
                                        </div>
                                    </div>';
                endif;
            endforeach;
        } ?>
    </div>
</div>

<?php
$feedManager = new ExpressCurate_FeedManager();
$feed_list = $feedManager->get_rss_list();
$nextPullTime = human_time_diff(time(),wp_next_scheduled('expresscurate_pull_feeds'));
?>

<div class="expresscurate_feed_dashboard expresscurate_Styles wrap">
    <div class="expresscurate_headBorderBottom expresscurate_headerPart expresscurate_OpenSansRegular">
        <a href="admin.php?page=expresscurate_support" class="expresscurate_writeUs"><?php _e('Suggestions? '); ?><span><?php _e('Submit here!'); ?></span></a>

        <h2><?php _e('RSS Feeds'); ?></h2>

        <div class="pageDesc">
<?php _e('Manage RSS feeds to customize the content that gets delivered to your ExpressCurate Content Feed.'); ?>
        </div>
    </div>
    <div class="expresscurate_content_wrapper whiteWrap">
        <ul class="expresscurate_columnsName">
            <li class="mainTitle"><?php _e('RSS feeds'); ?></li>
            <li class="title expresscurate_floatRight"><?php _e('# of curated posts'); ?></li>
        </ul>
        <label class="expresscurate_displayNone expresscurate_notDefined"><?php _e('There is no enough data'); ?></label>
        <ul class="expresscurate_feedSettingsList">
            <?php
                if(!empty($feed_list)){
                    foreach ($feed_list as $url => $feed_url) { ?>
                        <li>
                            <a href="<?php echo $feed_url['feed_url'] ?>"
                               target="_newtab"><?php echo $feed_url['feed_title']; ?><br /><small><?php echo $url; ?></small></a>
                            <span class="postsCount expresscurate_floatRight">
                                <?php echo $feed_url['post_count']; ?>
                                <input type="hidden" name="expresscurate_feed_url" value="<?php echo $url ?>"/>
                            </span>
                            <span class="close"></span>
                        </li>
                    <?php }
                }
            ?>
        </ul>
        <div class="addNewFeed">
            <label for="addFeed "><?php _e('Add RSS feed'); ?></label>

            <div class="addFeed">
                <input id="addFeed" type="text" placeholder="Feed Address" class="expresscurate_disableInputStyle"/>
                <span class="plus expresscurate_preventTextSelection"><span></span></span>
                <span class="expresscurate_errorMessage"></span>
            </div>
            <div class="expresscurate_clear"></div>
        </div>
    </div>
    <script type="text/html" id="tmpl-rssfeedItem">
        <li>
            <a target="_newtab" href="{{data.feed_url}}">{{data.feed_title}}<br/><small>{{data.link}}</small></a>
                        <span class="postsCount expresscurate_floatRight">{{data.post_count}}
                        <input type="hidden" name="expresscurate_feed_url" value="{{data.feed_url}}"/>
                        </span>
            <span class="close">&#215</span>
        </li>
    </script>
</div>
<?php
$content_list = array();
$feedManager = new ExpressCurate_FeedManager();
$deleted_feeds = $feedManager->get_deleted_feeds();
$sorted_feeds = array();
function array_sort_by_column(&$arr, $col, $dir = SORT_DESC)
{
    $sort_col = array();
    foreach ($arr as $key => $row) {
        $sort_col[$key] = date("Y-m-d H:i:s", strtotime($row[$col]));
    }
    array_multisort($sort_col, $dir, $arr);
}

if (!empty($deleted_feeds)) {
    $domains = array();
    $keywords = array();
    foreach ($deleted_feeds as $content) {
        if (is_array($content) && count($content) > 0) {
            $content['domain'] = parse_url($content['link'], PHP_URL_SCHEME) . "://" . parse_url($content['link'], PHP_URL_HOST);
            $content['desc'] = str_replace("&quot;", "'", $content['desc']);
            $content['title'] = str_replace("&quot;", "'", $content['title']);
            array_push($sorted_feeds, $content);

            //filter data
            array_push($domains, $content['domain']);
            if (!empty($content['keywords'])) {
                foreach ($content['keywords'] as $keyword => $stats) {
                    array_push($keywords, $keyword);
                }
            }
        }
    }
    $domains = array_unique($domains);
    $keywords = array_unique($keywords);

    array_sort_by_column($sorted_feeds, 'date');
}

?>
<input id="adminUrl" type="hidden" value="<?php echo get_admin_url(); ?>"/>
<div
    class="expresscurate_feed_list expresscurate_Styles wrap <?php if (get_option('expresscurate_feed_layout', '') == 'single') {
        echo 'expresscurate_singleColumn';
    } ?>">
    <div class="expresscurate_headBorderBottom expresscurate_OpenSansRegular">
        <a href="admin.php?page=expresscurate_support" class="expresscurate_writeUs"><?php _e('Suggestions? '); ?>
            <span><?php _e('Submit here!'); ?></span></a>

        <h2><?php _e('Content Feed Archive'); ?></h2>

        <div class="pageDesc">
            <?php _e('This page contains all posts were deleted from Content feed page which you can be restore or delete permanently.'); ?>
        </div>
        <div class="controlsWrap">
            <ul class="feedListControls expresscurate_preventTextSelection expresscurate_controls ">
                <li class="check">
                    <span class="tooltip"><?php _e('select / deselect'); ?></span>
                </li>
                <br class="first"/>
                <li class="removePermanently expresscurate_floatRight">
                    <span class="tooltip"><?php _e('remove'); ?></span>
                </li>
                <li class="bookmark expresscurate_floatRight">
                    <span class="tooltip"><?php _e('bookmark'); ?></span>
                </li>
                <li class="restore expresscurate_floatRight">
                    <span class="tooltip"><?php _e('restore'); ?></span>
                </li>
                <li class="layout expresscurate_floatRight">
                    <span class="tooltip"><?php if (get_option('expresscurate_bookmark_layout', '') == 'single') {
                            _e('view as grid');
                        } else {
                            _e('view as list');
                        } ?></span>
                </li>
                <br class="second"/>
                <div class="expresscurate_clear"></div>
            </ul>
        </div>
    </div>
    <div class="expresscurate_clear"></div>
    <ul id="expresscurate_feedBoxes" class="expresscurate_feedBoxes expresscurate_masonryWrap">
        <?php
        if (!empty($sorted_feeds)) {
            $i = 0;
            foreach ($sorted_feeds as $key => $item) {
                ?>
                <li class="expresscurate_preventTextSelection expresscurate_masonryItem">
                    <input id="uniqueId_<?php echo $i; ?>" class="checkInput" type="checkbox"/>
                    <label for="uniqueId_<?php echo $i; ?>"></label>
                <textarea
                    class="expresscurate_displayNone expresscurate_feedData"><?php echo json_encode($item); ?></textarea>

                    <ul class="keywords">
                        <?php if (!empty($item['media']['videos'])) {
                            echo '<li class="media videos"><span class="tooltip">' . __('Video(s): ') . $item["media"]["videos"] . '</span></li>';
                        }
                        if (!empty($item['media']['images'])) {
                            echo '<li class="media images"><span class="tooltip">' . __('Image(s): ') . $item["media"]["images"] . '</span></li>';
                        }
                        if (!empty($item['keywords'])) { ?>
                            <?php foreach ($item['keywords'] as $keyword => $stats) {
                                if ($stats['percent'] * 100 < 3) {
                                    $color = 'blue';
                                } else if ($stats['percent'] * 100 > 5) {
                                    $color = 'red';
                                } else {
                                    $color = 'green';
                                }
                                ?>
                                <li class="expresscurate_keyword <?php echo $color ?>"><?php echo $keyword; ?>
                                    <span class="tooltip">
                      <div class="<?php echo $color ?>"><?php _e('Keyword match'); ?></div>
                    <span class="inTitle"><?php _e('title'); ?><p class=""><?php echo $stats['title'] ?></p></span>
                                        <!--inTitle yes|no-->
                    <span class="inContent"><?php _e('content'); ?><p><?php echo $stats['percent'] * 100 ?>%</p></span>
                  </span>
                                </li>
                            <?php }
                        } ?>
                    </ul>

                    <a data-link="<?php echo $item['link']; ?>" class="postTitle" href="<?php echo $item['link'] ?>"
                       target="_blank"><?php echo $item['title'] ?></a><br/>
                    <a data-encodedurl="<?php echo base64_encode(urlencode($item['link'])) ?>" class="url"
                       href="<?php echo $item['link'] ?>"><?php echo $item['domain'] ?></a>
                    <?php if (isset($item['author']) && '' != $item['author']) { ?>
                        <span class="curatedBy">/<?php echo $item['curated'] ? 'curated by' : 'author'; ?>
                            <span><?php echo $item['author']; ?></span> /</span>
                    <?php } ?>
                    <span
                        class="time"><?php echo human_time_diff(current_time('timestamp'), strtotime($item['date'])) . ' ago'; ?></span></br>

                    <ul class="controls expresscurate_preventTextSelection">
                        <li class="restore"><?php _e('Restore In Feed'); ?></li>
                        <li class="separator">-</li>
                        <li class="bookmark"><?php _e('Bookmark'); ?></li>
                        <li class="separator">-</li>
                        <li class="permanent_remove"><?php _e('Remove'); ?></li>

                    </ul>
                    <div class="expresscurate_clear"></div>
                </li>

                <?php $i++;
            }
            ?><?php
        } ?>
        <label class="expresscurate_notDefined expresscurate_displayNone"><?php _e('Your content feed is
            empty. ');
            echo (strlen(get_option('expresscurate_links_rss', '')) > 2) ? '' : _e('Configure'); ?> <a
                href="admin.php?page=expresscurate_feeds"><?php _e('RSS feeds'); ?></a> <?php _e('to
        start.'); ?></label>
    </ul>
    <form method="POST" action="<?php echo get_admin_url() ?>post-new.php#expresscurate_sources_collection"
          id="expresscurate_bookmarks_curate">
        <textarea name="expresscurate_bookmarks_curate_data" id="expresscurate_bookmarks_curate_data"
                  class="expresscurate_displayNone"></textarea>
        <input type="hidden" name="expresscurate_load_sources" value="1"/>
    </form>
</div>

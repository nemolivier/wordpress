<?php
$feedManager = new ExpressCurate_FeedManager();
$bookmarks = $feedManager->get_bookmarks();
if (!empty($bookmarks)) {
    $sorted_bookmarks = array_reverse($bookmarks);
}
?>
<input id="adminUrl" type="hidden" value="<?php echo get_admin_url(); ?>"/>
<div
    class="expresscurate_bookmarks expresscurate_Styles wrap <?php if (get_option('expresscurate_bookmark_layout', '') == 'single') {
        echo 'expresscurate_singleColumn';
    } ?>">
    <div class="expresscurate_headBorderBottom expresscurate_OpenSansRegular">
        <a href="admin.php?page=expresscurate_support" class="expresscurate_writeUs"><?php _e('Suggestions? '); ?>
            <span><?php _e('Submit here!'); ?></span></a>

        <h2><?php _e('Bookmarks'); ?></h2>

        <div class="pageDesc">
            <?php _e('List of your bookmarked web pages. You can start a post by picking a bookmarked article (or multiple
            articles) and clicking on the curate button.'); ?>
        </div>
        <div class="controlsWrap">
            <ul class="bookmarkListControls expresscurate_preventTextSelection expresscurate_controls">
                <li class="check">
                    <span class="tooltip"><?php _e('select / deselect'); ?></span>
                </li>
                <li class="remove expresscurate_floatRight">
                    <span class="tooltip"><?php _e('delete'); ?></span>
                </li>
                <li class="quotes expresscurate_floatRight">
                    <span class="tooltip"><?php _e('curate'); ?></span>
                </li>
                <li class="layout expresscurate_floatRight">
                <span class="tooltip"><?php if (get_option('expresscurate_bookmark_layout', '') == 'single') {
                        _e('view as grid');
                    } else {
                        _e('view as list');
                    } ?></span>
                </li>
                <div class="expresscurate_clear"></div>
            </ul>
        </div>
    </div>

    <label class="expresscurate_displayNone expresscurate_notDefined"><?php _e('Currently you have no bookmarked web
        pages.'); ?></label>
    <ul class="expresscurate_bookmarkBoxes expresscurate_masonryWrap">
        <div class="addNewBookmark expresscurate_masonryItem grid-sizer">
            <label for="addBookmark "><?php _e('Add new Bookmark'); ?></label>

            <div class="addBookmark">
                <input id="addBookmark" type="text" placeholder="URL" class="expresscurate_disableInputStyle"/>
                <span class="plus expresscurate_preventTextSelection"><span></span></span>
                <span class="expresscurate_errorMessage"></span>
            </div>

            <div class="expresscurate_clear"></div>
        </div>
        <?php
        if (!empty($sorted_bookmarks)) {
            $i = 0;
            foreach ($sorted_bookmarks as $key => $item) {
                ?>
                <li class="expresscurate_preventTextSelection expresscurate_masonryItem">
                    <input id="uniqueId_<?php echo $i ?>" class="checkInput" type="checkbox"/>
                    <label for="uniqueId_<?php echo $i ?>"></label>
                <textarea
                    class="expresscurate_displayNone expresscurate_bookmarkData"><?php echo json_encode($item); ?></textarea>

                    <ul class="keywords">
                        <?php if (!empty($item['media']['videos'])) {
                            echo '<li class="media videos"><span class="tooltip">' . __('Video(s): ') . $item["media"]["videos"] . '</span></li>';
                        }
                        if (!empty($item['media']['images'])) {
                            echo '<li class="media images"><span class="tooltip">' . __('Image(s): ') . $item["media"]["images"] . '</span></li>';
                        }
                        if (!empty($item[' keywords'])) { ?>
                            <?php foreach ($item['keywords'] as $keyword => $stats) {
                                if ($stats['percent'] * 100 < 3) {
                                    $color = 'blue';
                                } else if ($stats['percent'] * 100 > 5) {
                                    $color = 'red';
                                } else {
                                    $color = 'green';
                                }
                                ?>
                                <li class="<?php echo $color ?>"><?php echo $keyword; ?>
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

                    <a class="postTitle" href="<?php echo $item['link'] ?>"
                       target="_blank"><?php echo $item['title'] ?></a><br/>
                    <a target="_blank"><?php echo $item['title'] ?></a><br/>
                    <a data-encodedurl="<?php echo base64_encode(urlencode($item['link'])) ?>" class="url"
                       target="_blank" href="<?php echo $item['link'] ?>"><?php echo $item['domain'] ?></a>
                    <span class="curatedBy"><?php _e('/ by '); ?><span><?php echo $item['user']; ?></span> /</span>
                <span
                    class="time"><?php echo human_time_diff(strtotime($item['bookmark_date']), current_time('timestamp')) .' ago' ?></span>

                    <div class="comment">
                        <label class="<?php if ($item['comment']) {
                            echo 'active';
                        } ?>"
                               for="comment__<?php echo $i ?>"><?php echo $item['comment'] ? stripslashes($item['comment']) : __('add comment'); ?></label>
                        <input type="text" class="expresscurate_disableInputStyle expresscurate_displayNone"
                               id="comment__<?php echo $i ?>" value="<?php echo stripslashes($item['comment']); ?>">
                        <span class="expresscurate_displayNone">&#215</span>
                    </div>
                    <ul class="controls expresscurate_preventTextSelection">
                        <li class="curate"><a
                                href="<?php echo esc_url(get_admin_url() . "post-new.php?expresscurate_load_source=" . base64_encode(urlencode($item['link'])) . "&expresscurate_load_title=" . urlencode($item['title'])); ?>"><?php _e('Curate'); ?></a>
                        </li>
                        <li class="separator">-</li>
                        <?php
                        if (get_option('expresscurate_social_publishing', '') == "on" && strlen(get_option('expresscurate_buffer_access_token')) > 2) {
                            ?>
                            <li class="share"><?php _e('Share'); ?> </li>
                            <li class="separator">-</li>
                        <?php } ?>
                        <li class="copyURL"><?php _e('Copy URL'); ?></li>
                        <li class="separator">-</li>
                        <li class="hide"><?php _e('Delete'); ?></li>
                    </ul>
                    <div class="expresscurate_clear"></div>
                </li>
                <?php
                $i++;
            }
        }
        ?>

    </ul>
    <form method="POST" action="<?php echo get_admin_url() ?>post-new.php#expresscurate_sources_collection"
          id="expresscurate_bookmarks_curate">
        <textarea name="expresscurate_bookmarks_curate_data" id="expresscurate_bookmarks_curate_data"
                  class="expresscurate_displayNone"></textarea>
        <input type="hidden" name="expresscurate_load_sources" value="1"/>
    </form>
    <script type="text/html" id="tmpl-bookmarksItem">
        <!--<# for(i=0;i<data.media.images;i++) { #>
            <# } #>-->
        <li class="expresscurate_preventTextSelection expresscurate_masonryItem">
            <input id="uniqueId_{{data.id}}" class="checkInput" type="checkbox"/>
            <label for="uniqueId_{{data.id}}" class="expresscurate_preventTextSelection"></label>
            <ul class="keywords">
                <# if (data.media.videos) { #>
                    <li class="media videos"><span class="tooltip"><?php _e('Video(s): '); ?>{{data.media.videos}}</span></li>
                    <# } #>
                        <# if (data.media.images) { #>
                            <li class="media images"><span class="tooltip"><?php _e('Image(s): '); ?>{{data.media.images}}</span></li>
                            <# } #>
            </ul>
            <a class="postTitle" href="{{data.link}}" target="_blank">{{data.title}}</a><br/>
            <a class="url" href="{{data.link}}" target="_blank">{{data.domain}}</a>
            <span class="curatedBy"><?php _e('/ by '); ?><span>{{data.user}}</span> /</span>
            <span class="time"><?php _e('Just now'); ?></span>

            <div class="comment">
                <label class="" for="uniqueId"><?php _e('add comment'); ?></label>
                <input type="text" class="expresscurate_disableInputStyle expresscurate_displayNone" id="uniqueId">
                <span class="expresscurate_displayNone">&#215</span>
            </div>
            <ul class="controls expresscurate_preventTextSelection">
                <li><a class="curate"
                       href="post-new.php?expresscurate_load_source={{data.curateLink}}"><?php _e('Curate'); ?></a></li>
                <li class="separator">-</li>
                <?php
                if (get_option('expresscurate_social_publishing', '') == "on" && strlen(get_option('expresscurate_buffer_access_token')) > 2) {
                    ?>
                    <li class="share"><?php _e('Share '); ?></li>
                    <li class="separator">-</li>
                <?php } ?>
                <li class="copyURL"><?php _e('Copy URL'); ?></li>
                <li class="separator">-</li>
                <li class="hide"><?php _e('Delete'); ?></li>

            </ul>
            <div class="expresscurate_clear"></div>
        </li>
    </script>
    <script type="text/html" id="tmpl-confirmDialog">
        <div>
            <p class='dialog_text'>{{data.text}}<span class='confirm_post_title'>{{data.title}}</span></p>
        </div>
    </script>
</div>
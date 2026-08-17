let body = $response.body;
if (typeof body === "string" && body.length > 0) {
  // 广告过滤：独立 try，失败不影响下面的 nsfw 替换
  try {
    let json = JSON.parse(body);
    let posts = json?.data?.postsInfoByIds;

    if (Array.isArray(posts)) {
      json.data.postsInfoByIds = posts.filter(post => {
        if (!post) return false;
        if (post.isCreatedFromAdsUi === true) return false;
        if (post.isCommercialCommunication === true) return false;
        if (post.promotedCommunityPost) return false;
        if (post.adSupplementaryTextRichtext) return false;
        if (post.callToAction) return false;
        if (typeof post.__typename === "string" && /^(Promoted|Ad)/.test(post.__typename)) return false;
        return true;
      });
      body = JSON.stringify(json);
    }
  } catch (e) {
    console.log("[reddit_filter_ad] error: " + e);
    // 出错则保留原 body，不中断后续流程
  }

  // isNsfw 替换：独立 try，始终执行
  try {
    body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
  } catch (e) {
    console.log("[reddit_isnsfw] error: " + e);
  }

  $done({ body });
} else {
  $done({});
}

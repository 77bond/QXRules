let body = $response.body;
if (typeof body === "string" && body.length > 0) {
  try {
    let json = JSON.parse(body);
    let posts = json?.data?.postsInfoByIds;

    if (Array.isArray(posts)) {
      json.data.postsInfoByIds = posts.filter(post => {
        if (!post) return false;

        // 常见广告标记字段
        if (post.isCreatedFromAdsUi === true) return false;
        if (post.isCommercialCommunication === true) return false;
        if (post.promotedCommunityPost) return false;
        if (post.adSupplementaryTextRichtext) return false;
        if (post.callToAction) return false;

        // typename 里含 Ad 的（PromotedPost / AdPost 等）
        if (typeof post.__typename === "string" && /ad/i.test(post.__typename)) return false;

        // gallery 内单张图带广告标记的情况（保守判断，只在明显是广告时才整贴过滤）
        if (post.gallery?.items?.some(item => item.adUrl || item.adEvents)) return false;

        return true;
      });
    }

    body = JSON.stringify(json);
    body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
  } catch (e) {
    console.log("[reddit_filter] error: " + e);
  }
  $done({ body });
} else {
  $done({});
}

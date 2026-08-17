let body = $response.body;
if (typeof body === "string" && body.length > 0) {
  try {
    let json = JSON.parse(body);
    let posts = (json && json.data && json.data.postsInfoByIds) ? json.data.postsInfoByIds : null;

    if (posts && Array.isArray(posts)) {
      let filtered = [];
      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        if (!post) continue;

        let isAd = false;
        if (post.isCreatedFromAdsUi === true) isAd = true;
        if (post.isCommercialCommunication === true) isAd = true;
        if (post.promotedCommunityPost) isAd = true;
        if (post.adSupplementaryTextRichtext) isAd = true;
        if (post.callToAction) isAd = true;
        if (typeof post.__typename === "string" && /^(Promoted|Ad)/.test(post.__typename)) isAd = true;

        if (!isAd) filtered.push(post);
      }
      json.data.postsInfoByIds = filtered;
      body = JSON.stringify(json);
    }
  } catch (e) {
    console.log("[reddit_filter_ad] error: " + e);
  }

  try {
    body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
  } catch (e) {
    console.log("[reddit_isnsfw] error: " + e);
  }

  $done({ body: body });
} else {
  $done({});
}

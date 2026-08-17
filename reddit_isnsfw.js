let body = $response.body;

if (typeof body !== "string" || body.length === 0) {
  $done({});
} else {
  console.log("[reddit_script] v4 running, bodyLen=" + body.length);

  let removedCount = 0;
  let totalCount = 0;

  try {
    let json = JSON.parse(body);
    let posts = json && json.data && json.data.postsInfoByIds;

    if (posts && Array.isArray(posts)) {
      totalCount = posts.length;
      let kept = [];
      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        if (!post) continue;

        let isAd = false;
        if (post.isCreatedFromAdsUi === true) isAd = true;
        if (post.isCommercialCommunication === true) isAd = true;
        if (post.promotedCommunityPost) isAd = true;
        if (post.adSupplementaryTextRichtext) isAd = true;
        if (typeof post.__typename === "string" && /^(Promoted|Ad)/i.test(post.__typename)) isAd = true;

        if (isAd) {
          removedCount++;
        } else {
          kept.push(post);
        }
      }
      json.data.postsInfoByIds = kept;
      body = JSON.stringify(json);
    }
    console.log("[reddit_filter] total=" + totalCount + " removed=" + removedCount);
  } catch (e) {
    console.log("[reddit_filter_ad] error, skip: " + e);
  }

  try {
    body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
  } catch (e) {
    console.log("[reddit_isnsfw] error: " + e);
  }

  $done({ body: body });
}

function stripAds(node) {
  if (Array.isArray(node)) {
    return node
      .filter(function (item) {
        if (item && typeof item === "object") {
          if (item.__typename === "AdPost") return false;
          if (item.adPayload) return false;
          if (Array.isArray(item.cells) &&
              item.cells.some(function (c) {
                return c && (c.__typename === "AdMetadataCell" || c.isAdPost === true);
              })) return false;
        }
        return true;
      })
      .map(stripAds);
  } else if (node && typeof node === "object") {
    var result = {};
    for (var key in node) {
      if (key === "commentsPageAds") {
        result[key] = [];
        continue;
      }
      result[key] = stripAds(node[key]);
    }
    return result;
  }
  return node;
}

let body = $response.body;
if (typeof body === "string" && body.length > 0) {
  try {
    body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
    let json = JSON.parse(body);
    json = stripAds(json);
    body = JSON.stringify(json);
  } catch (e) {
    console.log("[reddit_isnsfw] error: " + e);
  }
  $done({ body });
} else {
  $done({});
}

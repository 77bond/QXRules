let body = $response.body;
if (typeof body === "string" && body.length > 0) {
  try {
    body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
  } catch (e) {
    console.log("[reddit_isnsfw] error: " + e);
  }
  $done({ body });
} else {
  $done({});
}

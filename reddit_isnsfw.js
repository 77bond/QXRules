let body = $response.body;
try {
  body = body.replace(/"isNsfw"\s*:\s*false/g, '"isNsfw":true');
} catch (e) {
  console.log("[reddit_isnsfw] error: " + e);
}
$done({ body });

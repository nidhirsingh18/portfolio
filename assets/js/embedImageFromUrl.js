/**
 * Fetches the HTML text from a remote URL and attempts to parse out
 * the content of the <meta property="og:image"> tag.
 * @param {string} url The URL to fetch and parse.
 * @returns {Promise<string|null>} The OG image URL, or null if not found.
 */
async function fetchOGImageURL(url) {
  try {
    // Fetch the raw HTML from the remote page
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch:", response.status, response.statusText);
      return null;
    }

    const htmlText = await response.text();

    // Parse the HTML string into a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    // Look for the <meta property="og:image" content="...">
    const ogImageMeta = doc.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      return ogImageMeta.getAttribute("content");
    }
  } catch (err) {
    console.error("Error fetching or parsing HTML:", err);
  }
  return null;
}

/**
 * On DOM content loaded, find all articles with class "work-item",
 * pull out the anchor's href, fetch OG image, and update the <img> src.
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Get all articles that have the "work-item" class
  const workItems = document.querySelectorAll(".work-item");

  for (const item of workItems) {
    const link = item.querySelector("a");
    const img = item.querySelector("img");

    if (link && img) {
      const href = link.href;
      // Fetch OG image URL from that href
      const ogImageUrl = await fetchOGImageURL(href);
      if (ogImageUrl) {
        // Update the <img> with the OG image URL
        img.src = ogImageUrl;
      } else {
        console.log("No OG image found (or request failed) for:", href);
      }
    }
  }
});

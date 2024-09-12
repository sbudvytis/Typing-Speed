export async function fetchRandomText() {
  try {
    const response = await fetch("https://poetrydb.org/random/1");
    if (!response.ok) {
      throw new Error("Failed to fetch random text");
    }
    const data = await response.json();
    if (data && data[0] && data[0].lines) {
      const fullText = data[0].lines.join(" ");
      const truncatedText = fullText.slice(0, 600); // Extracts the first 600 characters
      return truncatedText;
    } else {
      throw new Error("Invalid API");
    }
  } catch (error) {
    console.error(error);
    return "Error fetching text";
  }
}

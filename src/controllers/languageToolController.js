import axios from "axios";

const LANGUAGE_TOOL_URL =
  process.env.LANGUAGETOOL_URL || "http://localhost:8010";

const languageCheck = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await axios.post(
      `${LANGUAGE_TOOL_URL}/v2/check`,
      new URLSearchParams({
        text,
        language: "en-US",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "BloggIt-Backend/1.0",
        },
        timeout: 10000,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "Grammar error:",
      err.code,
      err.message
    );

    res.status(503).json({
      error: "Grammar service unavailable",
    });
  }
};

export default languageCheck;

/**
 * @desc    Grammar and spell check
 * @route   POST /api/grammar-check
 * @access  Public
 */

const LANGUAGE_TOOL_URL = process.env.LANGUAGETOOL_URL|| "http://localhost:8010";


const languageCheck = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required for grammar check",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${LANGUAGE_TOOL_URL}/v2/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        language: "en-US",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(503).json({
      error: "Grammar service unavailable",
    });
  }
};

export default languageCheck;

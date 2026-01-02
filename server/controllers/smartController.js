const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parse natural language text into expense data
 * POST /api/smart/parse-text
 */
exports.parseText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ msg: "Text is required" });

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const prompt = `Extract expense details from this text: "${text}".
Return JSON with:
- amount (number, required)
- category (one of: food, travel, study, fun, rent, other)
- note (string description)
- date (ISO format YYYY-MM-DD, default to today)
- type ("expense" or "income", default "expense")

Respond ONLY with valid JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const data = JSON.parse(response.text());

        // Validate and set defaults
        if (!data.amount || isNaN(data.amount)) {
            return res.status(400).json({ msg: "Could not extract amount from text" });
        }

        data.type = data.type || 'expense';
        data.category = data.category || 'other';
        data.date = data.date || new Date().toISOString().split('T')[0];
        data.note = data.note || text;

        res.json({ success: true, data });
    } catch (err) {
        console.error("AI Parse Error:", err);
        res.status(500).json({
            msg: "AI Processing Failed",
            error: err.message
        });
    }
};

/**
 * Scan receipt image and extract expense data
 * POST /api/smart/scan
 */
exports.scanReceipt = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: "No image uploaded" });

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Convert buffer to base64
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
            }
        };

        const prompt = `Analyze this receipt image. Extract expense data as JSON:
- amount (number, total paid)
- category (infer from items: food, travel, study, fun, rent, other)
- note (merchant name or brief description)
- date (ISO format YYYY-MM-DD, use receipt date or today)
- type (always "expense" for receipts)

Return ONLY valid JSON.`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const data = JSON.parse(response.text());

        // Set defaults
        data.type = 'expense';
        data.category = data.category || 'other';
        data.date = data.date || new Date().toISOString().split('T')[0];

        res.json({ success: true, data });

    } catch (err) {
        console.error("Receipt Scan Error:", err);
        res.status(500).json({
            msg: "Receipt Scanning Failed",
            error: err.message
        });
    }
};

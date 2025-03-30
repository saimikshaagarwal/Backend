const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser");
const {ask}=require("./gemini.service");
const app=express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    console.log("Request body:", req.body);  // Log request body to check incoming data

    const chatId = req.body.chat_id;
    const message = req.body.message;

    if (!chatId) return res.status(400).json({ error: "ChatId is missing" });
    if (!message) return res.status(400).json({ error: "Message is missing" });

    console.log(`Received message: ${message}`);

    try {
        const response = await ask(chatId, message);
        console.log("Response from ask function:", response);

        if (!response || !response.reply) {
            console.log("ask function returned an empty response");
            return res.status(500).json({ error: "No response from chatbot" });
        }
        return res.json(response);
    } catch (error) {
        console.error("Error in ask function:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 8080; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
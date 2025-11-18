import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors());

const NOTION_SECRET = process.env.NOTION_SECRET;
const DATABASE_ID = "29230dfde2d780a2baf1ee1e5945547d";

app.post("/api/notion/push", async (req, res) => {
    try {
        const { subject, from, date, body } = req.body;

        const notionRes = await fetch("https://api.notion.com/v1/pages", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${NOTION_SECRET}`,
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28"
            },
            body: JSON.stringify({
                parent: { database_id: DATABASE_ID },
                properties: {
                    "Name": { "title": [{ "text": { "content": subject }}]},
                    "From": { "rich_text": [{ "text": { "content": from }}]},
                    "Date": { "date": { "start": date }},
                },
                children: [
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [{ text: { content: body }}]
                        }
                    }
                ]
            })
        });

        const json = await notionRes.json();

        res.json({ success: true, page: json });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on https://localhost:3000"));

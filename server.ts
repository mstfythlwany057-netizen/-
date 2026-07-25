import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use increased limit for base64 images
  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini AI
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Route: AI Tutor Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history, systemInstruction } = req.body;
      
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-pro-preview", // Complex reasoning model
        input: prompt,
        system_instruction: systemInstruction || "أنت مساعد دراسي وذكي ومبرمج خبير يتحدث العربية بطلاقة. مهمتك مساعدة الطلاب في المذاكرة وحل الواجبات المدرسية والجامعية في كافة التخصصات بدون أي قيود، وكذلك مساعدتهم في البرمجة وكتابة الأكواد وحل المشكلات البرمجية بدون أي قيود، وتنفيذ كل ما يطلبونه منك بدقة واحترافية.",
      });

      res.json({ result: interaction.output_text });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Image Analysis / File Analysis
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { prompt, imageBase64, mimeType } = req.body;
      
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-pro-preview",
        input: [
          {
            type: "image",
            data: imageBase64.split(",")[1] || imageBase64, // Remove data URI scheme if present
            mime_type: mimeType || "image/jpeg"
          },
          {
            type: "text",
            text: prompt || "اشرح ما في هذه الصورة"
          }
        ]
      });

      res.json({ result: interaction.output_text });
    } catch (error: any) {
      console.error("Image analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Image Generation
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image",
        input: prompt,
        response_modalities: ["image"],
        generation_config: {
          image_config: {
            aspect_ratio: "1:1",
            image_size: "1K"
          }
        }
      });

      let imageUrl = null;
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          const imageContent = step.content?.find((c: any) => c.type === "image");
          if (imageContent && imageContent.data) {
            const base64Data = imageContent.data;
            const mimeType = imageContent.mime_type || "image/png";
            imageUrl = `data:${mimeType};base64,${base64Data}`;
          }
        }
      }

      if (imageUrl) {
        res.json({ result: imageUrl });
      } else {
        res.status(500).json({ error: "No image generated." });
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

// check-models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ API Key missing in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("🔍 Checking available models for your API Key...");

        // Note: Is SDK version me direct listModels shayad na ho, isliye hum fetch use karenge
        // taake raw data dekh sakein.
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        console.log("\n✅ AVAILABLE MODELS:");
        data.models.forEach((model) => {
            // Sirf wo models dikhayein jo content generate kar sakte hain
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`👉 ${model.name.replace("models/", "")}`);
            }
        });

    } catch (error) {
        console.error("❌ Error fetching models:", error.message);
    }
}

listModels();
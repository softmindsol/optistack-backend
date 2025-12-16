import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';

const prisma = new PrismaClient();

const generateResponse = async (userId, message, localHistory = []) => {
    // 1. Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, 'GEMINI_API_KEY is not configured in the server environment.');
    }

    // 2. Initialize Gemini (Use 'latest' to avoid 404 errors)
    const genAI = new GoogleGenerativeAI(apiKey);

    // NOTE: Agar ab bhi 404 aaye, toh 'gemini-pro' try karna fallback ke liye
    const modelName = "gemini-2.0-flash";

    // 3. Fetch User Profile
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            fullname: true,
            age: true,
            gender: true,
            healthGoals: true, // Assuming this is an Array of strings
            medicalConditions: true, // Assuming this is an Array of strings
            dietType: true,
        },
    });

    if (!user) throw new ApiError(404, 'User not found');

    // 4. Fetch Supplement Stack
    const stackItems = await prisma.stackItem.findMany({
        where: { userId: userId }, // Removed isActive: true as it's not in schema
        include: { product: true },
    });

    const stackList = stackItems.length > 0
        ? stackItems.map(item => `${item.product.name} (${item.dailyDosage || 'Standard'})`).join(', ')
        : 'None';

    // 5. Construct System Prompt
    const systemInstruction = `
Role: You are an expert AI Health & Wellness Assistant for a mobile app.
Context: You have access to the user's profile and their current supplement stack.

User Profile:
- Name: ${user.fullname || 'Friend'}
- Age: ${user.age || 'Unknown'}
- Gender: ${user.gender || 'Unknown'}
- Goals: ${Array.isArray(user.healthGoals) ? user.healthGoals.join(', ') : user.healthGoals || 'General Wellness'}
- Diet: ${user.dietType || 'Not specified'}
- Medical Conditions: ${Array.isArray(user.medicalConditions) ? user.medicalConditions.join(', ') : 'None reported'}

Current Supplement Stack:
${stackList}

Instructions:
1. Answer strictly based on health, nutrition, fitness, and supplement advice.
2. If the user asks about anything else (coding, politics), politely refuse.
3. Check for interactions with the 'Current Supplement Stack'.
4. DISCLAIMER: Always mention "I am an AI, not a doctor. Please consult a professional."
5. Keep answers concise (max 3-4 sentences).
`;

    // 6. Format Local History for Gemini
    // Mobile se shayad { role: 'user', text: 'hi' } aa raha ho, lekin Gemini ko { role: 'user', parts: [{ text: 'hi' }] } chahiye.
    const formattedHistory = localHistory.map((msg) => ({
        role: msg.role === 'ai' || msg.role === 'assistant' ? 'model' : 'user', // Gemini uses 'model' strictly
        parts: [{ text: msg.text || msg.message || '' }],
    }));

    // 7. Start Chat Session
    const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction, // System prompt yahan inject hota hai
    });

    const chat = model.startChat({
        history: formattedHistory,
    });

    try {
        // AI Call
        const result = await chat.sendMessage(message);
        const text = result.response.text();
        return text;

    } catch (error) {
        console.error('Gemini API Error:', error);

        // Specific Error Handling
        if (error.message.includes('404') || error.message.includes('not found')) {
            throw new ApiError(500, 'AI Model setup error. Please contact support.');
        }

        if (error.message.includes('fetch failed')) {
            throw new ApiError(503, 'Network error: Failed to connect to Google AI. Check internet/VPN.');
        }

        throw new ApiError(500, 'Failed to generate AI response.');
    }
};

export default {
    generateResponse,
};
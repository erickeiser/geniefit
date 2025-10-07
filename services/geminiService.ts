import { GoogleGenAI, Type } from "@google/genai";
import type { DetailedExercise, FoodInfo, WorkoutSchedule } from "../types";

// Lazily initialize the AI client to prevent app crash on load if API key is missing.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (ai) {
        return ai;
    }
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        // This error will be caught by the calling function's try/catch block.
        throw new Error("API_KEY environment variable not set. AI features are disabled.");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
}


export async function getExerciseDetails(exerciseName: string): Promise<DetailedExercise | null> {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a detailed, step-by-step guide for performing a '${exerciseName}'. Include information on proper form, primary muscles worked, common mistakes to avoid, and breathing techniques. Also, generate a simple, clear, minimalist SVG illustration of the exercise. The SVG should be a single string, have a viewBox="0 0 100 100", use a white stroke, and be visually appealing on a dark background.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        musclesWorked: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        commonMistakes: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        breathing: { type: Type.STRING },
                        illustrationSvg: { type: Type.STRING, description: "A string containing a full SVG illustration of the exercise." }
                    },
                    required: ["name", "description", "instructions", "musclesWorked", "commonMistakes", "breathing", "illustrationSvg"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as DetailedExercise;

    } catch (error) {
        console.error("Error fetching exercise details from Gemini API:", error);
        return null;
    }
}

export async function getFoodNutrition(query: string): Promise<FoodInfo | null> {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide the estimated nutritional information for "${query}". If the query is unclear, make a reasonable assumption (e.g., 'milk' means '1 cup of whole milk').`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the food item, including quantity." },
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER }
                    },
                    required: ["name", "calories", "protein", "carbs", "fat"]
                }
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as FoodInfo;

    } catch (error) {
        console.error("Error fetching food nutrition from Gemini API:", error);
        return null;
    }
}

export async function getFoodNutritionFromBarcode(barcode: string): Promise<FoodInfo | null> {
    const barcodeToProductMap: { [key: string]: string } = {
        '0123456789012': '1 Quest Nutrition Chocolate Chip Cookie Dough Protein Bar',
        '9876543210987': '1 can of Coca-Cola Classic, 12 fl oz',
        '1112223334445': '1 serving of skippy creamy peanut butter'
    };

    const productName = barcodeToProductMap[barcode];

    if (!productName) {
        console.warn(`Barcode ${barcode} not found in the simulation map.`);
        return null;
    }

    return getFoodNutrition(productName);
}

export async function generateWorkoutPlan(options: { goal: string; level: string; equipment: string; }): Promise<WorkoutSchedule | null> {
    const { goal, level, equipment } = options;
    const prompt = `You are an expert fitness coach and physical therapist. Generate a personalized 6-day workout schedule for a user with the following profile:
- Fitness Goal: ${goal}
- Fitness Level: ${level}
- Available Equipment: ${equipment || 'Bodyweight only'}

**Goal Interpretation Guide:**
- **Powerbuilding:** Combine heavy, low-rep compound lifts for strength (like Powerlifting) with higher-rep accessory exercises for muscle growth (like Bodybuilding).
- **Marathon Training:** The plan should prioritize running. Include different types of runs (e.g., Long Runs, Tempo Runs, Interval Training) and 2-3 days of complementary, full-body strength training to support running and prevent injuries.
- **Rehabilitation:** Focus on low-impact exercises, mobility work, and controlled movements to gently strengthen muscles and improve range of motion. Avoid high-impact or heavy-load exercises unless specified by equipment.
- For other goals, use standard best practices.

**Schedule Requirements:**
The schedule must be split into Week A (Monday, Wednesday, Friday) and Week B (Tuesday, Thursday, Saturday). Sunday should be a rest day.
For each workout day, provide a descriptive 'type' (e.g., 'Push Day', 'Long Run + Core') and a list of 5-6 exercises or primary activities.
For each exercise, provide a name and a suggested set/rep scheme (e.g., '4x8-12', '3xAMRAP', '5km Tempo Run').
Ensure the response strictly adheres to the provided JSON schema.`;
    
    const workoutDaySchema = {
        type: Type.OBJECT,
        properties: {
            day: { type: Type.STRING },
            type: { type: Type.STRING },
            exercises: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.STRING },
                    },
                    required: ["name", "sets"],
                },
            },
        },
        required: ["day", "type", "exercises"],
    };

    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        "A": {
                            type: Type.ARRAY,
                            items: workoutDaySchema,
                        },
                        "B": {
                            type: Type.ARRAY,
                            items: workoutDaySchema,
                        },
                    },
                    required: ["A", "B"],
                }
            }
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        if (data.A && data.B && Array.isArray(data.A) && Array.isArray(data.B)) {
            return data as WorkoutSchedule;
        }
        console.error("Generated data is not in the expected WorkoutSchedule format:", data);
        return null;

    } catch (error) {
        console.error("Error generating workout plan from Gemini API:", error);
        return null;
    }
}
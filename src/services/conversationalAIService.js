import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY_3 || '';

if (!apiKey) {
    console.error("Gemini API Key for conversational service is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Đánh giá câu dịch giao tiếp của người dùng.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @param {string} userAnswer - Câu trả lời tiếng Anh của người dùng.
 * @returns {Promise<{correct: boolean, feedback: string, suggestion: string}>}
 */
export const gradeConversationalTranslation = async (vietnameseSentence, userAnswer) => {
    const prompt = `
        Bạn là một giáo viên tiếng Anh bản ngữ, chuyên sửa lỗi giao tiếp.
        Câu tiếng Việt là: "${vietnameseSentence}".
        Học viên dịch là: "${userAnswer}".

        Hãy đánh giá và trả về một đối tượng JSON duy nhất với cấu trúc sau:
        {
          "correct": [true nếu câu dịch đúng ngữ pháp, tự nhiên và sát nghĩa, ngược lại false],
          "feedback": "Một nhận xét ngắn gọn, thân thiện về câu trả lời (ví dụ: 'Tuyệt vời!', 'Gần đúng rồi!', 'Sai ngữ pháp rồi nhé!').",
          "suggestion": "Nếu sai, đưa ra một hoặc hai cách diễn đạt đúng và tự nhiên hơn. Nếu đúng, có thể đưa ra một cách nói khác phổ biến."
        }
        - Tập trung vào tính tự nhiên trong giao tiếp hàng ngày.
        - Phản hồi bằng tiếng Việt.
        - Chỉ trả về đối tượng JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error grading conversational answer:", error);
        throw new Error("AI đang bận, không thể chấm điểm lúc này. Vui lòng thử lại sau!");
    }
};
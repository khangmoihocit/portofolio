import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY_3 || '';

if (!apiKey) {
    console.error("Gemini API Key for conversational service is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Đánh giá câu dịch của người dùng khi luyện viết câu đơn.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @param {string} userAnswer - Câu trả lời tiếng Anh của người dùng.
 * @returns {Promise<{correct: boolean, feedback: string, grammar: string, suggestion: string}>}
 */
export const gradeConversationalTranslation = async (vietnameseSentence, userAnswer) => {
    const prompt = `
Câu tiếng Việt: "${vietnameseSentence}"
Câu học viên viết: "${userAnswer}"

Đánh giá và trả về JSON:
{
  "correct": true/false,
  "feedback": "Nhận xét ngắn gọn (1 câu)",
  "grammar": "Giải thích ngữ pháp và cấu trúc câu cần dùng cho ngữ cảnh này (ví dụ: 'Thì hiện tại đơn (S + V/V-s/es) dùng cho sự thật, thói quen', 'Cấu trúc: S + give + IO + DO', 'Dùng giới từ 'in' với thời gian dài: in + year/month/season')",
  "suggestion": "Câu đúng (nếu sai) hoặc cách diễn đạt khác (nếu đúng)"
}

Yêu cầu:
- Nếu đúng: feedback khen ngợi, grammar giải thích cấu trúc đã dùng tốt, suggestion đưa cách viết thay thế
- Nếu sai: feedback chỉ ra lỗi, grammar giải thích chi tiết ngữ pháp/cấu trúc đúng phải dùng, suggestion viết câu hoàn chỉnh đúng
- Grammar phải ngắn gọn, dễ hiểu, tập trung vào cấu trúc câu và ngữ cảnh sử dụng
- Trả về JSON thuần, không có markdown
- Phản hồi bằng tiếng Việt
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
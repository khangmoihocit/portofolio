import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY_3 || '';

if (!apiKey) {
    console.error("Gemini API Key for conversational service is not set.");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Đánh giá câu dịch của người dùng khi luyện viết câu đơn.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @param {string} userAnswer - Câu trả lời tiếng Anh của người dùng.
 * @returns {Promise<{correct: boolean, feedback: string, grammar: string, suggestion: string, explanation?: string}>}
 */
export const gradeConversationalTranslation = async (vietnameseSentence, userAnswer) => {
    const prompt = ` Bạn là một giáo viên tiếng Anh tỉ mỉ và chuyên sâu về ngữ pháp. Người dùng được cho câu tiếng Việt "${vietnameseSentence}". Họ đã viết câu tiếng Anh sau: "${userAnswer}".
Đánh giá và trả về JSON:
{
  "correct": true/false,
  "feedback": "Nhận xét ngắn gọn (1 câu)",
  "grammar": "Giải thích ngữ pháp và cấu trúc câu cần dùng cho ngữ cảnh này (ví dụ: 'Thì hiện tại đơn (S + V/V-s/es) dùng cho sự thật, thói quen', 'Cấu trúc: S + give + IO + DO', 'Dùng giới từ 'in' với thời gian dài: in + year/month/season')",
  "suggestion": "Câu đúng (nếu sai) hoặc cách diễn đạt khác (nếu đúng)",
  "explanation": "Giải thích ngắn gọn tại sao câu trả lời đúng (chỉ khi correct=true) và ngữ cảnh sử dụng từ vựng quan trọng trong câu này."
}

Yêu cầu:
- Nếu đúng: feedback khen ngợi, grammar giải thích cấu trúc đã dùng tốt, suggestion đưa cách viết thay thế, explanation giải thích ngữ cảnh
- Nếu sai: feedback chỉ ra lỗi, grammar giải thích chi tiết ngữ pháp/cấu trúc đúng phải dùng, suggestion viết câu hoàn chỉnh đúng, explanation không cần
- Grammar phải ngắn gọn, dễ hiểu, tập trung vào cấu trúc câu và ngữ cảnh sử dụng
- Trả về JSON thuần, không có markdown
- Phản hồi bằng tiếng Việt
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
    const text = response.text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
    } catch (error) {
        console.error("Error grading conversational answer:", error);
        throw new Error("AI đang bận, không thể chấm điểm lúc này. Vui lòng thử lại sau!");
    }
};

/**
 * Lấy gợi ý học tập cho câu hội thoại: từ vựng quan trọng và cấu trúc ngữ pháp.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @returns {Promise<{vocabulary: Array<{word: string, meaning: string}>, grammar: string}>}
 */
export const getConversationalHint = async (vietnameseSentence) => {
    const prompt = `
Câu tiếng Việt: "${vietnameseSentence}"

Hãy cung cấp gợi ý giúp người học viết câu tiếng Anh tương ứng và trả về JSON:
{
  "vocabulary": [
    { "word": "...", "meaning": "..." }
  ],
  "grammar": "..."
}

Yêu cầu:
- Chọn 3-7 từ vựng hoặc cụm từ quan trọng. "word" là tiếng Anh, "meaning" là nghĩa tiếng Việt ngắn gọn.
- "grammar" mô tả cấu trúc câu hoặc điểm ngữ pháp cần lưu ý bằng tiếng Việt, tối đa 2 câu.
- Không dùng markdown.
- Chỉ trả về JSON hợp lệ.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const text = response.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text);

        const vocabulary = Array.isArray(parsed.vocabulary)
            ? parsed.vocabulary
                .filter(item => item && typeof item.word === 'string' && typeof item.meaning === 'string')
                .map(item => ({
                    word: item.word.trim(),
                    meaning: item.meaning.trim(),
                }))
            : [];

        return {
            vocabulary,
            grammar: typeof parsed.grammar === 'string' ? parsed.grammar.trim() : '',
        };
    } catch (error) {
        console.error("Error fetching conversational hint:", error);
        throw new Error("AI đang bận, không thể tạo gợi ý lúc này. Vui lòng thử lại sau!");
    }
};
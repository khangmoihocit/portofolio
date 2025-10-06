import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY_2 || '';
if (!apiKey) {
    console.error("Gemini API Key is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Đánh giá một đoạn văn dịch thuật bằng AI.
 * @param {string} originalText - Đoạn văn gốc.
 * @param {string} translatedText - Đoạn văn do người dùng dịch.
 * @param {string} sourceLang - Ngôn ngữ gốc (ví dụ: 'Tiếng Anh').
 * @param {string} targetLang - Ngôn ngữ đích (ví dụ: 'Tiếng Việt').
 * @returns {Promise<object>} - Một đối tượng chứa nhận xét từ AI.
 */
export const evaluateTranslation = async (originalText, translatedText, sourceLang, targetLang) => {
    const prompt = `
        Bạn là một giáo viên ngôn ngữ chuyên nghiệp và tỉ mỉ. Nhiệm vụ của bạn là đánh giá một bản dịch.

        - Ngôn ngữ gốc: ${sourceLang}
        - Đoạn văn gốc: "${originalText}"
        - Ngôn ngữ đích: ${targetLang}
        - Bản dịch của học viên: "${translatedText}"

        Hãy phân tích bản dịch và trả về một đối tượng JSON duy nhất với cấu trúc sau:
        {
          "score": [Điểm số từ 0 đến 10, dựa trên mức độ chính xác và tự nhiên],
          "overallFeedback": "Một nhận xét tổng quan ngắn gọn (2-3 câu) về chất lượng bản dịch.",
          "corrections": [
            {
              "original": "Phần bị sai trong bản dịch của học viên",
              "suggestion": "Phần nên được sửa lại cho đúng",
              "explanation": "Giải thích ngắn gọn tại sao cần sửa (ví dụ: 'sai ngữ pháp', 'từ dùng chưa tự nhiên', 'dịch sai nghĩa')."
            }
          ]
        }

        - Nếu bản dịch hoàn hảo, trả về "score": 10, "overallFeedback": "Xuất sắc! Bản dịch của bạn rất chính xác và tự nhiên.", và một mảng "corrections" rỗng.
        - Nếu có lỗi, hãy tìm ra 2-3 lỗi quan trọng nhất để đưa vào mảng "corrections".
        - Tất cả các nhận xét và giải thích phải bằng Tiếng Việt.
        - Chỉ trả về đối tượng JSON, không có bất kỳ văn bản nào khác.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/{[\s\S]*}/);
        if (jsonMatch && jsonMatch[0]) {
            const jsonString = jsonMatch[0];
            return JSON.parse(jsonString);
        } else {
            console.error("AI response did not contain valid JSON.", text);
            throw new Error("Phản hồi từ AI không hợp lệ.");
        }
    } catch (error) {
        console.error("Error evaluating translation:", error);
        throw new Error("Không thể đánh giá bản dịch vào lúc này. Vui lòng thử lại.");
    }
};


import { GoogleGenerativeAI } from '@google/generative-ai';

// Lấy API key từ biến môi trường
const apiKey = import.meta.env.VITE_GEMINI_API_KEY_1 || '';

if (!apiKey) {
    console.error("Gemini API Key is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Gọi Gemini API để tạo bài tập đặt câu từ danh sách từ vựng.
 * @param {string[]} vocabList - Mảng các từ vựng tiếng Anh.
 * @returns {Promise<Array<{englishWord: string, vietnameseSentence: string}>>}
 */
export const createSentenceExercises = async (vocabList) => {
    const prompt = `
        Bạn là một giáo viên tiếng Anh. Với các từ vựng sau: [${vocabList.join(', ')}].
        Hãy tạo ra cho mỗi từ một câu tiếng Việt đơn giản, thông dụng mà khi dịch sang tiếng Anh bắt buộc phải dùng từ vựng tương ứng.
        Trả về kết quả dưới dạng một mảng JSON có cấu trúc: [{ "englishWord": "từ_vựng_1", "vietnameseSentence": "câu_tiếng_việt_1" }, ...].
        Chỉ trả về JSON, không có bất kỳ văn bản giải thích nào khác.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error creating exercises:", error);
        throw new Error("Không thể tạo bài tập vào lúc này. Vui lòng thử lại.");
    }
};

/**
 * Gọi Gemini API để chấm điểm câu trả lời của người dùng.
 * @param {string} englishWord - Từ vựng tiếng Anh.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @param {string} userAnswer - Câu trả lời của người dùng.
 * @returns {Promise<{correct: boolean, suggestion?: string}>}
 */
export const gradeUserAnswer = async (englishWord, vietnameseSentence, userAnswer) => {
    const prompt = `
        Bạn là một chuyên gia ngữ pháp tiếng Anh. Người dùng được cho từ khóa "${englishWord}" và câu tiếng Việt "${vietnameseSentence}". Họ đã viết câu tiếng Anh sau: "${userAnswer}".
        Hãy đánh giá câu này dựa trên các tiêu chí:
        1.  Câu trả lời có chứa đúng từ khóa không? (Phải chứa chính xác từ "${englishWord}")
        2.  Ngữ pháp có đúng không?
        3.  Nghĩa có phù hợp với câu tiếng Việt không?

        -   Nếu câu trả lời hoàn toàn đúng và tự nhiên, chỉ trả về JSON: {"correct": true}.
        -   Nếu sai, trả về JSON: {"correct": false, "suggestion": "Đưa ra một lời khuyên ngắn gọn, chính xác để sửa lỗi (viết bằng tiếng Việt)."}
        Chỉ trả về đối tượng JSON, không có bất kỳ văn bản giải thích nào khác.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error grading answer:", error);
        throw new Error("Không thể chấm điểm vào lúc này. Vui lòng thử lại.");
    }
};
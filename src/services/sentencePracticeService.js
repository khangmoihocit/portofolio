import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
    console.error("Gemini API Key is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Gọi Gemini API để tạo bài tập đặt câu từ danh sách từ vựng.
 * @param {string[]} vocabList - Mảng các từ vựng tiếng Anh.
 * @param {string} difficulty - Độ khó của câu ('cơ bản', 'trung bình', 'nâng cao').
 * @returns {Promise<Array<{englishWord: string, vietnameseSentence: string}>>}
 */
export const createSentenceExercises = async (vocabList, difficulty = 'trung bình') => {
    const prompt = `
        Bạn là một giáo viên tiếng Anh. Với các từ vựng sau: [${vocabList.join(', ')}].
        Hãy tạo ra cho mỗi từ một câu tiếng Việt ở mức độ '${difficulty}', mà khi dịch sang tiếng Anh bắt buộc phải dùng từ vựng tương ứng.
        - Cơ bản: Câu ngắn, cấu trúc đơn giản (S + V + O).
        - Trung bình: Câu có thể chứa mệnh đề phụ, giới từ phức tạp hơn.
        - Nâng cao: Câu dài, sử dụng cấu trúc ngữ pháp phức tạp, thành ngữ hoặc từ vựng ít phổ biến hơn.
        Trả về kết quả dưới dạng một mảng JSON có cấu trúc: [{ "englishWord": "từ_vựng_1", "vietnameseSentence": "câu_tiếng_việt_1" }, ...].
        Chỉ trả về JSON, không có bất kỳ văn bản giải thích nào khác.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const text = response.text.replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error creating exercises:", error);
        throw new Error("Không thể tạo bài tập vào lúc này. Vui lòng thử lại.");
    }
};

/**
 * Gọi Gemini API để lấy gợi ý cho bài tập.
 * @param {string} englishWord - Từ vựng tiếng Anh.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @returns {Promise<{vocabulary: Array<{word: string, meaning: string}>, grammar: string}>}
 */
export const getExerciseHint = async (englishWord, vietnameseSentence) => {
    const prompt = `
Từ khóa: "${englishWord}"
Câu tiếng Việt: "${vietnameseSentence}"

Hãy cung cấp gợi ý giúp người học viết câu tiếng Anh tương ứng và trả về JSON:
{
  "vocabulary": [
    { "word": "...", "meaning": "..." }
  ],
  "grammar": "..."
}

Yêu cầu:
- Chọn 3-7 từ vựng hoặc cụm từ quan trọng (bao gồm từ khóa yêu cầu). "word" là tiếng Anh, "meaning" là nghĩa tiếng Việt ngắn gọn.
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
        console.error("Error getting hint:", error);
        throw new Error("Không thể lấy gợi ý vào lúc này. Vui lòng thử lại.");
    }
};

/**
 * Gọi Gemini API để chấm điểm câu trả lời của người dùng.
 * @param {string} englishWord - Từ vựng tiếng Anh.
 * @param {string} vietnameseSentence - Câu tiếng Việt gốc.
 * @param {string} userAnswer - Câu trả lời của người dùng.
 * @returns {Promise<{correct: boolean, feedback?: string, suggestion?: string, explanation?: string}>}
 */
export const gradeUserAnswer = async (englishWord, vietnameseSentence, userAnswer) => {
    const prompt = `
        Bạn là một giáo viên tiếng Anh tỉ mỉ và chuyên sâu về ngữ cảnh sử dụng từ vựng. Người dùng được cho từ khóa "${englishWord}" và câu tiếng Việt "${vietnameseSentence}". Họ đã viết câu tiếng Anh sau: "${userAnswer}".

        Hãy đánh giá câu trả lời và trả về một đối tượng JSON duy nhất.
        
        1.  Nếu câu trả lời hoàn toàn đúng về ngữ pháp, sử dụng đúng từ khóa và truyền tải chính xác ý nghĩa của câu tiếng Việt, trả về:
            {"correct": true, "explanation": "Giải thích ngắn gọn tại sao câu trả lời đúng và ngữ cảnh sử dụng từ vựng '${englishWord}' trong câu này."}

        2.  Nếu câu trả lời có lỗi, trả về:
            {"correct": false, "feedback": "Phân tích ngắn gọn lỗi sai (ví dụ: 'sai thì của động từ', 'dùng sai giới từ', 'không chứa từ khóa yêu cầu'). Sau đó, giải thích rõ tại sao từ khóa '${englishWord}' được sử dụng trong ngữ cảnh của câu tiếng Việt này, bao gồm nghĩa của từ và cách nó phù hợp với tình huống.", "suggestion": "Viết lại câu đúng để người dùng tham khảo."}

        Lưu ý: Phản hồi phải bằng tiếng Việt. Chỉ trả về đối tượng JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const text = response.text.replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error grading answer:", error);
        throw new Error("Không thể chấm điểm vào lúc này. Vui lòng thử lại.");
    }
};
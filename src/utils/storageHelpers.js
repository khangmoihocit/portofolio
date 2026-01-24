// Quản lý việc lưu trữ đáp án đúng trong localStorage (chỉ lưu đáp án mới nhất)

const CORRECT_ANSWERS_KEY = 'conversational_correct_answers';

/**
 * Lưu đáp án đúng của người dùng vào localStorage (chỉ lưu đáp án mới nhất)
 * @param {Object} sentence - Câu hỏi gốc  
 * @param {string} userAnswer - Câu trả lời của người dùng
 */
export const saveCorrectAnswer = (sentence, userAnswer) => {
    try {
        // Lấy object chứa các đáp án theo id
        const correctAnswers = JSON.parse(localStorage.getItem(CORRECT_ANSWERS_KEY) || '{}');

        // Lưu đáp án mới nhất (ghi đè đáp án cũ nếu có)
        correctAnswers[sentence.id] = userAnswer.trim();

        localStorage.setItem(CORRECT_ANSWERS_KEY, JSON.stringify(correctAnswers));
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu đáp án đúng:', error);
        return false;
    }
};

/**
 * Lấy đáp án đúng cho một câu cụ thể
 * @param {number} sentenceId - ID của câu
 * @returns {string|null} Đáp án đúng gần nhất hoặc null nếu chưa có
 */
export const getCorrectAnswerForSentence = (sentenceId) => {
    try {
        const correctAnswers = JSON.parse(localStorage.getItem(CORRECT_ANSWERS_KEY) || '{}');
        return correctAnswers[sentenceId] || null;
    } catch (error) {
        console.error('Lỗi khi đọc đáp án đúng:', error);
        return null;
    }
};

/**
 * Xóa tất cả đáp án đúng đã lưu
 * @returns {boolean} Trạng thái xóa
 */
export const clearCorrectAnswers = () => {
    try {
        localStorage.removeItem(CORRECT_ANSWERS_KEY);
        return true;
    } catch (error) {
        console.error('Lỗi khi xóa đáp án đúng:', error);
        return false;
    }
};

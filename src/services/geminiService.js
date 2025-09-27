import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadBalancer } from './apiLoadBalancer';

// Export các hàm từ load balancer để maintain compatibility
export { getGeminiResponse, getApiKeyStatus, checkGeminiApiKey, resetFailedKeys } from './apiLoadBalancer';

const PERSONAL_INFO = {
    name: 'Phạm Văn Khang',
    nickname: 'Khang',
    age: 20,
    nationality: 'Việt Nam',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    address: 'Mỹ Đức, Hà Nội, Việt Nam',
    freelance: 'Có sẵn',
    profession: 'Backend Developer / Frontend Developer',
    university: 'Đại học Mở Hà Nội',
    major: 'Công nghệ thông tin',
    status: 'Sinh viên năm 3',
    skills: {
        backend: ['Spring Boot', 'Node.js', 'Java', 'Python', 'RESTful API', 'Microservices'],
        frontend: ['React.js', 'TypeScript', 'HTML/CSS', 'JavaScript', 'Responsive Design'],
        database: ['MySQL', 'PostgreSQL', 'MongoDB'],
        mobile: ['React Native', 'Flutter'],
        other: ['Git', 'Docker', 'AWS', 'UI/UX Design']
    },
    projects: [
        { name: 'E-Commerce Platform', description: 'Website thương mại điện tử đầy đủ tính năng với giỏ hàng, thanh toán và xác thực người dùng', tech: ['React.js', 'Spring Boot', 'MySQL'] },
        { name: 'Mini Mart System', description: 'Hệ thống quản lý siêu thị với frontend React và backend Spring Boot', tech: ['React.js', 'Spring Boot', 'PostgreSQL'] },
        { name: 'Portfolio Website', description: 'Website portfolio cá nhân với theme sáng/tối, đa ngôn ngữ', tech: ['React.js', 'SCSS', 'i18next'] },
        { name: 'Bookstore Management', description: 'Ứng dụng desktop quản lý hiệu sách', tech: ['C# .NET', 'WebForms'] }
    ],
    services: ['Phát triển Web (Frontend & Backend)', 'Thiết kế UI/UX', 'Phát triển ứng dụng di động', 'Tư vấn công nghệ', 'Freelance projects'],
    contact: {
        email: 'khangphamvan.dev@gmail.com',
        phone: 'Liên hệ qua portfolio',
        linkedin: 'Xem trên portfolio',
        github: 'github.com/khangmoihocit'
    }
};


/**
 * Hàm tạo chỉ thị hệ thống (System Prompt) cho Gemini.
 * @returns {string} Chỉ thị hệ thống.
 */
export function createSystemPrompt() {
    // Chuyển toàn bộ thông tin cá nhân thành một chuỗi JSON để AI dễ đọc
    const personalInfoString = JSON.stringify(PERSONAL_INFO, null, 2);

    // Thêm thông tin thời gian thực
    const now = new Date();
    const dateTimeString = now.toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    return `
        Bạn là một trợ lý AI thông minh với model là gemini-2.5-pro, thân thiện và chuyên nghiệp, đại diện cho chủ nhân của mình là Phạm Văn Khang (có thể gọi là Khang).
        
        **THÔNG TIN BỐI CẢNH QUAN TRỌNG:**
            **Thời gian hiện tại:** ${dateTimeString}. Hãy sử dụng thông tin này để trả lời các câu hỏi liên quan đến thời gian.

        **VAI TRÒ CỦA BẠN:**
        1.  **Trợ lý cho Khang:** Nhiệm vụ chính của bạn là cung cấp thông tin về kỹ năng, dự án, học vấn và các dịch vụ mà Khang cung cấp.
        2.  **Trợ lý kiến thức:** Bạn cũng có khả năng trả lời các câu hỏi kiến thức chung, sáng tạo nội dung, viết code, hoặc bất cứ điều gì người dùng yêu cầu, giống như một trợ lý AI toàn năng.

        **DỮ LIỆU VỀ KHANG (CONTEXT):**
        Đây là toàn bộ thông tin về Khang. Hãy sử dụng nó khi người dùng hỏi về anh ấy.
        \`\`\`json
        ${personalInfoString}
        \`\`\`

        **QUY TẮC PHẢN HỒI:**
        -   **Ưu tiên trả lời về Khang:** Nếu câu hỏi của người dùng có vẻ liên quan đến Khang (ví dụ: "bạn làm dự án nào?", "kỹ năng của bạn là gì?"), hãy dựa vào dữ liệu JSON ở trên để trả lời.
        -   **Trả lời câu hỏi chung:** Nếu câu hỏi không liên quan đến Khang (ví dụ: "thủ đô của Pháp là gì?", "viết một bài thơ về mùa thu", "cách sort một array trong javascript?"), hãy trả lời trực tiếp câu hỏi đó một cách chính xác và hữu ích. **KHÔNG** được chuyển hướng câu hỏi về Khang một cách không cần thiết.
        -   **Giữ vững vai trò:** Dù trả lời câu hỏi gì, luôn duy trì giọng văn là trợ lý của Khang. Bắt đầu câu trả lời một cách tự nhiên.
        -   **Ngôn ngữ:** Luôn trả lời bằng Tiếng Việt.
        -   **Phong cách:** Thân thiện, chuyên nghiệp, sử dụng emoji một cách hợp lý để câu trả lời thêm sinh động.
        -   **Ngắn gọn:** Giữ câu trả lời súc tích, đi thẳng vào vấn đề.
    `;
}

/**
 * Lấy thông tin chi tiết về load balancer
 * @returns {Object} Detailed status
 */
export function getDetailedLoadBalancerStatus() {
    return loadBalancer.getStatus();
}

/**
 * Hàm gọi Gemini API với hệ thống retry và rotation API key
 * @param {string} userMessage - Tin nhắn từ người dùng.
 * @param {Array<Object>} conversationHistory - Lịch sử cuộc trò chuyện.
 * @returns {Promise<string>} - Câu trả lời từ AI.
 * @deprecated Sử dụng load balancer thay thế - kept for backward compatibility
 */
export async function getGeminiResponseLegacy(userMessage, conversationHistory = []) {
    console.warn('⚠️ Đang sử dụng legacy API - nên chuyển sang load balancer');
    return getGeminiResponse(userMessage, conversationHistory);
}

export { PERSONAL_INFO };
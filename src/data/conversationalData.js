// src/data/conversationalData.js
export const conversationalSentences = [
    // Chào hỏi & Giới thiệu - Cơ bản
    {
        id: 1,
        category: 'Chào hỏi & Giới thiệu',
        difficulty: 'Cơ bản',
        vietnamese: 'Rất vui được gặp bạn.',
        english: "It's a pleasure to meet you."
    },
    {
        id: 2,
        category: 'Chào hỏi & Giới thiệu',
        difficulty: 'Cơ bản',
        vietnamese: 'Bạn có khỏe không?',
        english: "How are you doing?"
    },
    {
        id: 3,
        category: 'Chào hỏi & Giới thiệu',
        difficulty: 'Cơ bản',
        vietnamese: 'Tôi tên là Nam.',
        english: "My name is Nam."
    },
    {
        id: 4,
        category: 'Chào hỏi & Giới thiệu',
        difficulty: 'Cơ bản',
        vietnamese: 'Hẹn gặp lại.',
        english: "See you later."
    },

    // Chào hỏi & Giới thiệu - Trung bình
    {
        id: 5,
        category: 'Chào hỏi & Giới thiệu',
        difficulty: 'Trung bình',
        vietnamese: 'Cho tôi xin số điện thoại của bạn.',
        english: "Could I have your phone number?"
    },
    {
        id: 6,
        category: 'Chào hỏi & Giới thiệu',
        difficulty: 'Trung bình',
        vietnamese: 'Bạn đến từ đâu?',
        english: "Where are you from?"
    },

    // Tại nhà hàng - Cơ bản
    {
        id: 7,
        category: 'Tại nhà hàng',
        difficulty: 'Cơ bản',
        vietnamese: 'Tôi muốn đặt món.',
        english: "I would like to order."
    },
    {
        id: 8,
        category: 'Tại nhà hàng',
        difficulty: 'Cơ bản',
        vietnamese: 'Làm ơn tính tiền.',
        english: "Check, please."
    },

    // Tại nhà hàng - Trung bình
    {
        id: 9,
        category: 'Tại nhà hàng',
        difficulty: 'Trung bình',
        vietnamese: 'Bạn có thể gợi ý món nào đặc sắc ở đây không?',
        english: "Could you recommend any specialty dishes here?"
    },
    {
        id: 10,
        category: 'Tại nhà hàng',
        difficulty: 'Trung bình',
        vietnamese: 'Làm ơn cho tôi xem thực đơn.',
        english: "Can I see the menu, please?"
    },
    {
        id: 11,
        category: 'Tại nhà hàng',
        difficulty: 'Trung bình',
        vietnamese: 'Món ăn này có cay không?',
        english: "Is this dish spicy?"
    },

    // Tại nhà hàng - Nâng cao
    {
        id: 12,
        category: 'Tại nhà hàng',
        difficulty: 'Nâng cao',
        vietnamese: 'Tôi có dị ứng với hải sản, bạn có thể đề xuất món thay thế không?',
        english: "I'm allergic to seafood, could you suggest an alternative dish?"
    },

    // Du lịch - Cơ bản
    {
        id: 13,
        category: 'Du lịch',
        difficulty: 'Cơ bản',
        vietnamese: 'Nhà vệ sinh ở đâu?',
        english: "Where is the restroom?"
    },
    {
        id: 14,
        category: 'Du lịch',
        difficulty: 'Cơ bản',
        vietnamese: 'Bao nhiêu tiền?',
        english: "How much is it?"
    },

    // Du lịch - Trung bình
    {
        id: 15,
        category: 'Du lịch',
        difficulty: 'Trung bình',
        vietnamese: 'Tôi muốn đặt phòng cho hai người.',
        english: "I would like to book a room for two people."
    },
    {
        id: 16,
        category: 'Du lịch',
        difficulty: 'Trung bình',
        vietnamese: 'Làm thế nào để đến trung tâm thành phố?',
        english: "How do I get to the city center?"
    },

    // Du lịch - Nâng cao
    {
        id: 17,
        category: 'Du lịch',
        difficulty: 'Nâng cao',
        vietnamese: 'Bạn có thể chỉ cho tôi đường đến ga tàu điện ngầm gần nhất không?',
        english: "Could you please direct me to the nearest subway station?"
    },
    {
        id: 18,
        category: 'Du lịch',
        difficulty: 'Nâng cao',
        vietnamese: 'Tôi bị lạc, bạn có thể giúp tôi tìm đường về khách sạn không?',
        english: "I'm lost, could you help me find my way back to the hotel?"
    },

    // Mua sắm - Cơ bản
    {
        id: 19,
        category: 'Mua sắm',
        difficulty: 'Cơ bản',
        vietnamese: 'Cái này bao nhiêu tiền?',
        english: "How much does this cost?"
    },
    {
        id: 20,
        category: 'Mua sắm',
        difficulty: 'Cơ bản',
        vietnamese: 'Tôi có thể thử nó được không?',
        english: "Can I try it on?"
    },

    // Mua sắm - Trung bình
    {
        id: 21,
        category: 'Mua sắm',
        difficulty: 'Trung bình',
        vietnamese: 'Bạn có màu khác không?',
        english: "Do you have this in a different color?"
    },
    {
        id: 22,
        category: 'Mua sắm',
        difficulty: 'Trung bình',
        vietnamese: 'Tôi có thể đổi hàng được không?',
        english: "Can I exchange this?"
    },

    // Mua sắm - Nâng cao
    {
        id: 23,
        category: 'Mua sắm',
        difficulty: 'Nâng cao',
        vietnamese: 'Sản phẩm này có được bảo hành không và thời gian bảo hành là bao lâu?',
        english: "Does this product come with a warranty, and how long is the warranty period?"
    },

    // Công việc - Trung bình
    {
        id: 24,
        category: 'Công việc',
        difficulty: 'Trung bình',
        vietnamese: 'Tôi có thể gặp sếp được không?',
        english: "Can I speak with the manager?"
    },
    {
        id: 25,
        category: 'Công việc',
        difficulty: 'Trung bình',
        vietnamese: 'Cuộc họp được lên lịch vào lúc mấy giờ?',
        english: "What time is the meeting scheduled?"
    },

    // Công việc - Nâng cao
    {
        id: 26,
        category: 'Công việc',
        difficulty: 'Nâng cao',
        vietnamese: 'Tôi muốn sắp xếp một cuộc họp để thảo luận về dự án mới.',
        english: "I would like to arrange a meeting to discuss the new project."
    },
    {
        id: 27,
        category: 'Công việc',
        difficulty: 'Nâng cao',
        vietnamese: 'Chúng ta cần hoàn thành báo cáo này trước thời hạn cuối tuần.',
        english: "We need to complete this report before the end-of-week deadline."
    },

    // Khẩn cấp - Trung bình
    {
        id: 28,
        category: 'Khẩn cấp',
        difficulty: 'Trung bình',
        vietnamese: 'Làm ơn gọi cảnh sát!',
        english: "Please call the police!"
    },
    {
        id: 29,
        category: 'Khẩn cấp',
        difficulty: 'Trung bình',
        vietnamese: 'Tôi cần đến bệnh viện.',
        english: "I need to go to the hospital."
    },

    // Khẩn cấp - Nâng cao
    {
        id: 30,
        category: 'Khẩn cấp',
        difficulty: 'Nâng cao',
        vietnamese: 'Tôi bị mất hộ chiếu, tôi cần liên hệ với đại sứ quán.',
        english: "I've lost my passport, I need to contact the embassy."
    }
];
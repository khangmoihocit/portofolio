import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import FloatingActionMenu from '../../components/common/FloatingActionMenu';
import ScrollToTopButton from '../../components/common/ScrollToTopButton';
import SentencePractice from '../../components/Blog/Interactive/SentencePractice';
import styles from '../../components/Blog/contents/Content1/styles.module.scss';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AILearningPage = () => {
    return (
        <div>
            <Header />
            <main className="blog-container">
                <article className={styles.blogContent}>
                    <div className={styles.backButton}>
                        <Link to="/#blog" className={styles.backLink}>
                            <FaArrowLeft />
                            <span>Quay lại danh sách bài viết</span>
                        </Link>
                    </div>
                    <header className={styles.articleHeader}>
                        <h1 className={styles.title}>
                            Học Tiếng Anh Hiệu Quả Hơn với "Luyện Đặt Câu cùng AI"
                        </h1>
                    </header>
                    <div className={styles.articleBody}>
                        <section className={styles.section}>
                            <h2>Giới thiệu</h2>
                            <p>
                                Chào mừng bạn đến với một phương pháp học tiếng Anh hoàn toàn mới, được tích hợp ngay trên trang portfolio này!
                                Tính năng "Luyện Đặt Câu với AI" sử dụng sức mạnh của Google Gemini để tạo ra các bài tập thực hành cá nhân hóa, giúp bạn vận dụng từ vựng vào ngữ cảnh thực tế một cách hiệu quả.
                            </p>
                        </section>

                        <SentencePractice />

                        <section className={styles.section}>
                            <h2>Cách Hoạt Động</h2>
                            <p>
                                Rất đơn giản! Bạn chỉ cần nhập các từ vựng tiếng Anh muốn học (cách nhau bằng dấu phẩy) và nhấn "Tạo bài tập". AI sẽ ngay lập tức tạo ra các câu tiếng Việt tương ứng. Nhiệm vụ của bạn là dịch chúng trở lại tiếng Anh, sử dụng đúng từ vựng đã cho. Sau đó, AI sẽ chấm điểm và đưa ra gợi ý nếu bạn làm sai.
                            </p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
            <FloatingActionMenu />
            <ScrollToTopButton />
        </div>
    );
};

export default AILearningPage;
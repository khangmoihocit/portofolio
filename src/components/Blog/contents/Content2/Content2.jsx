import React from 'react';
import styles from '../Content1/styles.module.scss';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { SentenceBuilding } from '../../../../pages/PracticePage/components';

const Content2 = () => {
    return (
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
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(100, 255, 218, 0.1)',
                                borderLeft: '3px solid #64ffda',
                                borderRadius: '4px',
                                marginTop: '1rem'
                            }}>
                                <p style={{ margin: 0 }}>
                                    <strong>Trải nghiệm đầy đủ:</strong> Tính năng này hiện đã được tích hợp vào{' '}
                                    <Link to="/practice" style={{ color: '#2e6e59ff', fontWeight: 'bold' }}>
                                        Trang Luyện Tập <FaExternalLinkAlt style={{ fontSize: '0.8em' }} />
                                    </Link>
                                    {' '}với giao diện được cải tiến và nhiều chế độ luyện tập hơn!
                                </p>
                            </div>
                        </section>

                        <SentenceBuilding />

                        <section className={styles.section}>
                            <h2>Cách Hoạt Động</h2>
                            <p>
                                Rất đơn giản! Bạn chỉ cần nhập các từ vựng tiếng Anh muốn học (cách nhau bằng dấu phẩy) và nhấn "Tạo bài tập". AI sẽ ngay lập tức tạo ra các câu tiếng Việt tương ứng. Nhiệm vụ của bạn là dịch chúng trở lại tiếng Anh, sử dụng đúng từ vựng đã cho. Sau đó, AI sẽ chấm điểm và đưa ra gợi ý nếu bạn làm sai.
                            </p>
                        </section>
                    </div>
                </article>
    );
};

export default Content2;
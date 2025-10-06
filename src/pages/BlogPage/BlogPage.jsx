import React, { Suspense, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import FloatingActionMenu from '../../components/common/FloatingActionMenu';
import ScrollToTopButton from '../../components/common/ScrollToTopButton';

const Content1 = React.lazy(() => import('../../components/Blog/contents/Content1/Content1'));
const Content2 = React.lazy(() => import('../../components/Blog/contents/Content2/Content2'));

const BlogPage = ({ id: propId }) => {
    const { id: paramId } = useParams();
    const id = propId || parseInt(paramId, 10) || 1;

    const ContentComponent = useMemo(() => {
        switch (id) {
            case 1:
                return Content2;
            default:
                return null;
        }
    }, [id]);

    return (
        <div>
            <Header />
            <main className="blog-container">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p>Loading content...</p>
                        </div>
                    </div>
                }>
                    {ContentComponent ? (
                        <ContentComponent />
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold mb-4">Content not found</h2>
                            <p>The requested blog content does not exist.</p>
                        </div>
                    )}
                </Suspense>
            </main>
            <Footer />
            <FloatingActionMenu />
            <ScrollToTopButton />
        </div>
    );
};

export default BlogPage;
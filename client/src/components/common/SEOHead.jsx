import { Helmet } from 'react-helmet-async';

const SEOHead = ({ title, description, keywords, canonicalUrl }) => {
    const siteTitle = 'SpendWise';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={description} />
            {/* <meta property="og:image" content="/og-image.jpg" /> */}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEOHead;

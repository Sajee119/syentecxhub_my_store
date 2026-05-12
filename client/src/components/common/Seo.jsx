import { Helmet } from 'react-helmet-async';

export default function Seo({ title, description, keywords }) {
  const siteName = 'MyStore';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Your Premium Shopping Destination`;
  const desc = description || 'Discover amazing products at great prices. Shop the latest trends with fast shipping and excellent customer service.';
  const kw = keywords || 'ecommerce, shop, online store, products, shopping';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}

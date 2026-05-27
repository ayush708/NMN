import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'National Migrant Network';
const DEFAULT_SITE_URL = 'https://nmnhas.org.np';

const getSiteUrl = () => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (!envUrl) return DEFAULT_SITE_URL;
  return envUrl.replace(/\/$/, '');
};

const upsertMetaByName = (name, content) => {
  if (!content) return;

  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
};

const upsertMetaByProperty = (property, content) => {
  if (!content) return;

  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }

  el.setAttribute('href', href);
};

const upsertStructuredData = (data) => {
  if (!data) return;

  let el = document.head.querySelector('script[data-seo="structured-data"]');
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo', 'structured-data');
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(data);
};

function SEO({
  title,
  description,
  robots = 'index,follow',
  image,
  canonicalPath,
  type = 'website',
  structuredData,
}) {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const currentPath = canonicalPath || location.pathname;
    const canonicalUrl = `${siteUrl}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = fullTitle;

    upsertMetaByName('description', description);
    upsertMetaByName('robots', robots);

    upsertMetaByProperty('og:title', fullTitle);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:site_name', SITE_NAME);

    upsertMetaByName('twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMetaByName('twitter:title', fullTitle);
    upsertMetaByName('twitter:description', description);

    if (image) {
      upsertMetaByProperty('og:image', image);
      upsertMetaByName('twitter:image', image);
    }

    upsertCanonical(canonicalUrl);

    if (structuredData) {
      upsertStructuredData(structuredData);
    }
  }, [title, description, robots, image, canonicalPath, type, structuredData, location.pathname]);

  return null;
}

export default SEO;
import { useEffect } from 'react';

const SITE_NAME = 'Global Scientific Trade';
const BASE_URL = 'https://globalscientifictrade.com.np';
const DEFAULT_IMAGE = `${BASE_URL}/logo.jpeg`;

/**
 * useSEO - Simple per-page SEO hook
 * Sets document title, meta description, og tags, and canonical URL dynamically.
 *
 * @param {Object} opts
 * @param {string} opts.title        - Page title (without site name suffix)
 * @param {string} opts.description  - Meta description
 * @param {string} [opts.url]        - Canonical URL path e.g. '/products/item-slug'
 * @param {string} [opts.image]      - OG image URL (absolute)
 * @param {string} [opts.type]       - OG type: 'website' | 'product' | 'article' (default 'website')
 * @param {Object} [opts.jsonLd]     - Optional JSON-LD structured data object
 */
export default function useSEO({ title, description, keywords, url = '', image, type = 'website', jsonLd }) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Scientific & Lab Equipment Nepal`;
        const canonicalUrl = `${BASE_URL}${url}`;
        const ogImage = image || DEFAULT_IMAGE;

        // Document title
        document.title = fullTitle;

        // Helper to set/create a meta tag
        const setMeta = (selector, attr, value) => {
            if (!value) return;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                const [key, val] = attr.split('=').map(s => s.replace(/['"]/g, ''));
                el.setAttribute(key, val);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        };

        // Standard meta
        setMeta('meta[name="description"]', 'name="description"', description);
        if (keywords) {
            setMeta('meta[name="keywords"]', 'name="keywords"', keywords);
        }

        // Open Graph
        setMeta('meta[property="og:title"]', 'property="og:title"', fullTitle);
        setMeta('meta[property="og:description"]', 'property="og:description"', description);
        setMeta('meta[property="og:url"]', 'property="og:url"', canonicalUrl);
        setMeta('meta[property="og:image"]', 'property="og:image"', ogImage);
        setMeta('meta[property="og:type"]', 'property="og:type"', type);

        // Twitter
        setMeta('meta[name="twitter:title"]', 'name="twitter:title"', fullTitle);
        setMeta('meta[name="twitter:description"]', 'name="twitter:description"', description);
        setMeta('meta[name="twitter:image"]', 'name="twitter:image"', ogImage);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', canonicalUrl);

        // JSON-LD structured data
        const existingLd = document.querySelector('script[data-seo-ld]');
        if (jsonLd) {
            const script = existingLd || document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            script.setAttribute('data-seo-ld', 'true');
            script.textContent = JSON.stringify(jsonLd);
            if (!existingLd) document.head.appendChild(script);
        } else if (existingLd) {
            existingLd.remove();
        }

        return () => {
            // No cleanup needed; next page will overwrite
        };
    }, [title, description, keywords, url, image, type, jsonLd]);
}

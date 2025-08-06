import { useEffect } from "react";

interface SEOMetaProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: string;
}

export function SEOMeta({ title, description, imageUrl, url, type = "website" }: SEOMetaProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = description;
      document.head.appendChild(newMeta);
    }

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', type);
    
    if (imageUrl) {
      updateMetaTag('property', 'og:image', imageUrl);
    }
    
    if (url) {
      updateMetaTag('property', 'og:url', url);
    }

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    
    if (imageUrl) {
      updateMetaTag('name', 'twitter:image', imageUrl);
    }

  }, [title, description, imageUrl, url, type]);

  return null;
}

function updateMetaTag(attribute: string, value: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}
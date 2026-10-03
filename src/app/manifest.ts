import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mongkonridemate',
    short_name: 'mongkonridemate',
    description: 'Private van with driver in Bangkok and across Thailand',
    start_url: '/th',
    display: 'standalone',
    background_color: '#F3F5F6',
    theme_color: '#0A274D',
    icons: [
      {src: '/icon.svg', sizes: 'any', type: 'image/svg+xml'},
      {src: '/logo.webp', sizes: '1100x1100', type: 'image/webp'}
    ]
  };
}

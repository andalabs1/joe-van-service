import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Joe Van Service',
    short_name: 'Joe Van',
    description: 'Private van with driver in Bangkok and across Thailand',
    start_url: '/th',
    display: 'standalone',
    background_color: '#f5f7f8',
    theme_color: '#071d2b',
    icons: [{src: '/icon.svg', sizes: 'any', type: 'image/svg+xml'}]
  };
}

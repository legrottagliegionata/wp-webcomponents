export interface WpPost {
  id: number;
  type: string;
  link: string;
  title: Rendered;
  excerpt: Rendered;
  author: number;
  featured_media: number;
  featured_media_url: string;
}

export interface Rendered {
  rendered: string;
}

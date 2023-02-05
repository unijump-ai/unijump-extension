// Image tools
export type ImageToolsFormats = 'webp' | 'avif' | 'png' | 'jpg';

export interface ImageToolsImage {
  src: string;
  w: string;
}

export type ImageToolsSources = Record<ImageToolsFormats, ImageToolsImage[]>;

export interface ImageToolsSource {
  sources: ImageToolsSources;
  fallback: ImageToolsImage;
}

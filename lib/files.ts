export interface UploadedFile {
  url: string;
  key?: string;
  name: string;
  size: number;
  mime: string;
}

export const IMAGE_MIMES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml", "image/avif", "image/bmp", "image/x-icon"];

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isFileValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.startsWith("{") &&
    value.includes(`"url"`)
  );
}

export function parseFileValue(value: string): UploadedFile | null {
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed.url === "string" && typeof parsed.name === "string") {
      return parsed as UploadedFile;
    }
  } catch {
    // not a file value
  }
  return null;
}

export function formatFileCell(value: string): string {
  const file = parseFileValue(value);
  if (!file) return value;
  return `${file.name} (${file.url})`;
}
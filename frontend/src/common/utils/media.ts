import { FALLBACK_PRODUCT_IMAGE } from "@/common/mocks/customerMenu";
import api from "@/services/apiServices";

const isAbsoluteOrLocalPath = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("/") ||
  value.startsWith("blob:") ||
  value.startsWith("data:");

/** Resolve API image filename (e.g. `1784....jpg`) to a full media URL. */
export function resolveProductImageUrl(
  imageUrl?: string | null,
  fallback: string = FALLBACK_PRODUCT_IMAGE,
) {
  const trimmed = imageUrl?.trim();

  if (!trimmed) {
    return fallback;
  }

  if (isAbsoluteOrLocalPath(trimmed)) {
    return trimmed;
  }

  return api.file.getThumbnailUrl(trimmed) || fallback;
}

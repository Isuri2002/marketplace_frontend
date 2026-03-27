import { API_BASE_URL } from "@/utils/constants/api";

const uploadsBase = API_BASE_URL.replace("/v1", "");

const normalizeImageName = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized) return "";
  const lowered = normalized.toLowerCase();
  if (lowered === "undefined" || lowered === "null") return "";
  return normalized;
};

const toPublicAdImageUrl = (value) => {
  const imageName = normalizeImageName(value);
  if (!imageName) return "";
  if (imageName.startsWith("http")) return imageName;
  return "";
};

export const rentFrequencyLabel = (frequency = "") => {
  const map = {
    hourly: "Hour",
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
  };

  return map[String(frequency || "").toLowerCase()] || "Day";
};

export const rentFrequencyShortLabel = (frequency = "") => {
  const map = {
    hourly: "Hr",
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
  };

  return map[String(frequency || "").toLowerCase()] || String(frequency || "");
};

export const buildAdImage = (ad = {}) => {
  const mainImage = ad.mainImage || ad.image;
  if (mainImage) {
    const mainImageUrl = toPublicAdImageUrl(mainImage);
    if (mainImageUrl) return mainImageUrl;
  }

  const subImage = Array.isArray(ad.subImages)
    ? ad.subImages.find(Boolean)
    : null;
  if (subImage) {
    const subImageUrl = toPublicAdImageUrl(subImage);
    if (subImageUrl) return subImageUrl;
  }

  return "/demo/images/placeholder.jpg";
};

export const buildAdImages = (ad = {}) => {
  const images = [];
  const mainImage = ad.mainImage || ad.image;

  if (mainImage) {
    images.push(buildAdImage({ mainImage }));
  }

  if (Array.isArray(ad.subImages)) {
    ad.subImages.filter(Boolean).forEach((image) => {
      const imageUrl = toPublicAdImageUrl(image);
      if (imageUrl) images.push(imageUrl);
    });
  }

  return images.filter(
    (image, index, arr) => image && arr.indexOf(image) === index,
  );
};

export const buildRentLocation = (ad = {}) => {
  if (ad.city && ad.zipCode) return `${ad.city}, ${ad.zipCode}`;
  if (ad.city) return ad.city;
  if (ad.addressLine1 && ad.city) return `${ad.addressLine1}, ${ad.city}`;
  if (ad.addressLine1) return ad.addressLine1;
  if (ad.location) return ad.location;
  return "Location unavailable";
};

export const normalizeAdditionalInfo = (additionalInfo) => {
  if (Array.isArray(additionalInfo)) {
    return additionalInfo
      .map((entry) => {
        if (!entry) return null;
        if (typeof entry === "string") return { label: entry, value: entry };

        return {
          label: entry.label || "",
          value: entry.value ?? "",
        };
      })
      .filter((entry) => entry && (entry.label || entry.value));
  }

  if (additionalInfo && typeof additionalInfo === "object") {
    return Object.entries(additionalInfo)
      .map(([label, value]) => ({
        label,
        value: value ?? "",
      }))
      .filter((entry) => entry.label || entry.value);
  }

  return [];
};

export const normalizeRentAd = (ad = {}, options = {}) => {
  const categoryName =
    ad.category?.name ||
    ad.categoryName ||
    options.categoryName ||
    ad.category ||
    "Category";

  return {
    id: ad.id || ad._id,
    image: buildAdImage(ad),
    title: ad.title || "Untitled listing",
    category: categoryName,
    categoryName,
    location: buildRentLocation(ad),
    rating: ad.averageRating || ad.rating || 0,
    reviewCount: ad.reviewCount || 0,
    price: Number(ad.price || 0),
    currency: options.currency || "LKR",
    rentFrequency: String(ad.rentFrequency || "").toLowerCase(),
    period: rentFrequencyLabel(ad.rentFrequency),
    description: ad.description || "",
    additionalInfo: normalizeAdditionalInfo(ad.additionalInfo),
    section: ad.section || "rent",
    badge: options.badge || categoryName,
    address: ad.addressLine1
      ? `${ad.addressLine1}${ad.city ? `, ${ad.city}` : ""}${ad.zipCode ? `, ${ad.zipCode}` : ""}`
      : buildRentLocation(ad),
    latitude: ad.latitude ?? null,
    longitude: ad.longitude ?? null,
    categoryId:
      ad.category?.id ||
      ad.category?._id ||
      ad.category ||
      options.categoryId ||
      "",
    raw: ad,
  };
};

export const matchRentFilters = (ad = {}, filters = {}) => {
  const keyword = String(filters.keyword || "")
    .trim()
    .toLowerCase();
  const location = String(filters.location || "")
    .trim()
    .toLowerCase();

  if (keyword) {
    const haystack = [ad.title, ad.description, ad.categoryName, ad.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(keyword)) {
      return false;
    }
  }

  if (location) {
    const haystack = [
      ad.location,
      ad.address,
      ad.raw?.city,
      ad.raw?.addressLine1,
      ad.raw?.addressLine2,
      ad.raw?.zipCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(location)) {
      return false;
    }
  }

  return true;
};

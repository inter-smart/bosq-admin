// BOSQ App Slider API service
export interface BosqAppSliderData {
  id?: number;
  description: string;
  btn_text: string;
  btn_link: string;
  media_type: string;
  media_alt: string;
  icon?: File | string;
  media_path?: File | string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/backend";

// Get all app sliders
export const getBosqAppSliders = async (): Promise<BosqAppSliderData[]> => {
  const response = await fetch(`${API_BASE_URL}/bosq-app`);
  if (!response.ok) {
    throw new Error("Failed to fetch app sliders");
  }
  const responseData = await response.json();

  // Handle the nested data structure
  return responseData.data?.data || [];
};

// Get app slider by ID
export const getBosqAppSlider = async (
  id: number
): Promise<BosqAppSliderData> => {
  const response = await fetch(`${API_BASE_URL}/bosq-app/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch app slider");
  }
  const data = await response.json();
  return data.data || data;
};

// Create new app slider
export const createBosqAppSlider = async (
  data: BosqAppSliderData
): Promise<BosqAppSliderData> => {
  const formData = new FormData();

  // Add text fields
  formData.append("description", data.description);
  formData.append("btn_text", data.btn_text);
  formData.append("btn_link", data.btn_link);
  formData.append("media_type", data.media_type);
  formData.append("media_alt", data.media_alt);

  // Add file fields
  if (data.icon instanceof File) {
    formData.append("icon", data.icon);
  }
  if (data.media_path instanceof File) {
    formData.append("media_path", data.media_path);
  }

  const response = await fetch(`${API_BASE_URL}/bosq-app`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create app slider");
  }

  const result = await response.json();
  return result.data || result;
};

// Update app slider
export const updateBosqAppSlider = async (
  id: number,
  data: BosqAppSliderData
): Promise<BosqAppSliderData> => {
  const formData = new FormData();

  // Add text fields
  formData.append("description", data.description);
  formData.append("btn_text", data.btn_text);
  formData.append("btn_link", data.btn_link);
  formData.append("media_type", data.media_type);
  formData.append("media_alt", data.media_alt);

  // Add file fields
  if (data.icon instanceof File) {
    formData.append("icon", data.icon);
  }
  if (data.media_path instanceof File) {
    formData.append("media_path", data.media_path);
  }

  const response = await fetch(`${API_BASE_URL}/bosq-app/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update app slider");
  }

  const result = await response.json();
  return result.data || result;
};

// Delete app slider
export const deleteBosqAppSlider = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/bosq-app/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete app slider");
  }
};

// Toggle app slider status
export const toggleBosqAppSliderStatus = async (
  id: number
): Promise<BosqAppSliderData> => {
  const response = await fetch(
    `${API_BASE_URL}/bosq-app/${id}/toggle-status`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to toggle app slider status");
  }

  const result = await response.json();
  return result.data || result;
};

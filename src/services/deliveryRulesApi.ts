import { apiCall } from "@/utils/apiUtils";

export const getStatesByCountry = async (countrySlug: string = "ae") => {
  return apiCall(`/delivery-rules/states?countrySlug=${countrySlug}`, {
    method: "GET",
  });
};

export const updateDeliveryRules = async (stateId: number, rules: any[]) => {
  return apiCall(`/delivery-rules/states/${stateId}`, {
    method: "PUT",
    data: { rules },
  });
};

export const getActiveCategories = async () => {
  return apiCall(`/resources/product-categories/active`, {
    method: "GET",
  });
};

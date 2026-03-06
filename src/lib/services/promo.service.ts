import api from "@/lib/api/client";
import type { Promo } from "@/types";

export const promoService = {
  list: () =>
    api.get<Promo[]>("/api/promo/promos/"),

  validate: (code: string) =>
    api.get<Promo>("/api/promo/promos/validate/", { params: { code } }),
};

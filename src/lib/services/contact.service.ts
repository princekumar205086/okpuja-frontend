import api from "@/lib/api/client";
import type { ContactRequest } from "@/types";

export const contactService = {
  submit: (data: ContactRequest) =>
    api.post("/api/misc/contact/", data),
};

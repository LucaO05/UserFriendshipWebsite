import type {StoredUser} from "@/components/dashboard/types";

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem("auth_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    localStorage.removeItem("auth_user");
    return null;
  }
}

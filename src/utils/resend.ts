import type { CartItem } from "@/types";

export default async function handleEmails({
  email,
  name,
  funkos,
  total,
}: {
  email: string;
  name: string;
  funkos: CartItem[];
  total: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, items: funkos, total }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, error: (body as { error?: string }).error ?? res.statusText };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return { success: false, error: message };
  }
}

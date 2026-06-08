import { Resend } from "resend";
import type { CartItem } from "@/types";

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY as string;

export default async function handleEmails({
  email,
  name,
  funkos,
}: {
  email: string;
  name: string;
  funkos: CartItem[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("llego al menos");
    const resend = new Resend(RESEND_API_KEY);
    resend.emails
      .send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: `Resumen de tu compra en Funkoland - Orden ${Math.floor(Math.random() * 10000)}`,
        html: `
          <p>¡Gracias, ${name}!</p>
          <p>Aquí está el resumen de tu compra:</p>
          <ul>
            ${funkos.map((funko) => `<li>${funko.name} - $${funko.price.toFixed(2)}</li>`).join("")}
          </ul>
        `,
      })
      .finally(() => {
        console.log("se envio el mail");
      });

    /* const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: `Resumen de tu compra en Funkoland - Orden ${Math.floor(Math.random() * 10000)}`,
        html: `
          <p>¡Gracias, ${name}!</p>
          <p>Aquí está el resumen de tu compra:</p>
          <ul>
            ${funkos.map((funko) => `<li>${funko.name} - $${funko.price.toFixed(2)}</li>`).join("")}
          </ul>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: (body as { message?: string }).message ?? res.statusText };
    }
    */

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return { success: false, error: message };
  }
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, items } = req.body as {
    email: string;
    name: string;
    items: { name: string; price: number }[];
  };

  if (!email || !name || !items) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: `Resumen de tu compra en Funkoland - Orden ${Math.floor(Math.random() * 10000)}`,
    html: `
      <p>¡Gracias, ${name}!</p>
      <p>Aquí está el resumen de tu compra:</p>
      <ul>
        ${items.map((item) => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join("")}
      </ul>
    `,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}

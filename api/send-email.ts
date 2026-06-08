import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND_COLOR = "#383e56";
const FONT = "'Lato', Arial, Helvetica, sans-serif";
const ORDER_NUMBER = Math.floor(10000 + Math.random() * 90000);

function row(label: string, value: string, bold = false, shaded = false): string {
  const bg = shaded ? "#f9f9f9" : "#ffffff";
  const weight = bold ? "bold" : "normal";
  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width:640px;" role="presentation" bgcolor="${bg}">
      <tr>
        <td bgcolor="#ffffff" width="40"></td>
        <td bgcolor="${bg}" align="left" style="color:#5a5a5a;padding:10px 40px;font-family:${FONT};font-weight:${weight};font-size:14px;line-height:1.4;">${label}</td>
        <td bgcolor="${bg}" align="right" style="color:#5a5a5a;padding:10px 40px;font-family:${FONT};font-weight:bold;font-size:14px;line-height:1.4;">${value}</td>
        <td bgcolor="#ffffff" width="40"></td>
      </tr>
    </table>`;
}

function totalRow(value: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width:640px;" role="presentation" bgcolor="#ffffff">
      <tr>
        <td bgcolor="#ffffff" width="40"></td>
        <td align="left" style="border-top:2px solid #cccccc;border-bottom:2px solid #cccccc;color:#5a5a5a;padding:12px 40px;font-family:${FONT};font-weight:bold;font-size:14px;line-height:1.4;">TOTAL</td>
        <td align="right" style="border-top:2px solid #cccccc;border-bottom:2px solid #cccccc;color:#5a5a5a;padding:12px 40px;font-family:${FONT};font-weight:bold;font-size:16px;line-height:1.4;">${value}</td>
        <td bgcolor="#ffffff" width="40"></td>
      </tr>
    </table>`;
}

function buildHtml(name: string, items: { name: string; price: number }[], total: number): string {
  const itemRows = items
    .map((item, i) => row(`${item.name} (x1)`, `$${item.price.toFixed(2)}`, false, i % 2 === 1))
    .join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido — Funkoland</title>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body { margin:0; padding:0; background-color:#f1f1f1; -webkit-text-size-adjust:100%; }
    body, table, td, p, a, li { font-family:${FONT}; -webkit-text-size-adjust:100%; }
    table { border-spacing:0; border-collapse:collapse; }
    img { border:0; outline:none; text-decoration:none; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f1f1;">

<table width="640" border="0" cellpadding="0" cellspacing="0" align="center" style="width:640px;min-width:640px;" bgcolor="#f1f1f1" role="presentation">
<tbody>
<tr><td>

  <!-- Spacer -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#f1f1f1">
    <tr><td height="30"></td></tr>
  </table>

  <!-- HEADER -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${BRAND_COLOR}" role="presentation">
    <tr>
      <td align="center" style="padding:30px 40px;">
        <span style="font-family:${FONT};font-size:28px;font-weight:900;color:#ffffff;letter-spacing:2px;">FUNKOLAND</span>
      </td>
    </tr>
  </table>

  <!-- WHITE BODY -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" role="presentation">
    <tr><td height="50"></td></tr>
  </table>

  <!-- Title -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" role="presentation">
    <tr>
      <td align="center" style="color:#45535c;padding:0 40px;font-family:${FONT};font-weight:900;font-size:34px;line-height:1.2;">
        ¡Recibimos tu pedido!
      </td>
    </tr>
    <tr>
      <td align="center" style="color:#45535c;padding:16px 40px 0;font-family:${FONT};font-weight:700;font-size:20px;line-height:1.2;">
        ¡Hola, ${name}!
      </td>
    </tr>
    <tr>
      <td align="center" style="color:#5a5a5a;padding:16px 40px 0;font-family:${FONT};font-weight:400;font-size:15px;line-height:1.6;">
        Gracias por tu compra. Estamos procesando tu pedido y nos pondremos en contacto a la brevedad para coordinar la entrega. ¡Gracias por elegirnos!
      </td>
    </tr>
  </table>

  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" role="presentation">
    <tr><td height="40"></td></tr>
  </table>

  <!-- ORDER # row -->
  ${row(`Confirmación de Pedido #${ORDER_NUMBER}`, new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }), true, true)}

  <!-- ITEM ROWS -->
  ${itemRows}

  <!-- TOTAL -->
  ${totalRow(`$${total.toFixed(2)}`)}

  <!-- Spacer -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#ffffff" role="presentation">
    <tr><td height="50"></td></tr>
  </table>

  <!-- FOOTER -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${BRAND_COLOR}" role="presentation">
    <tr><td height="30"></td></tr>
  </table>

  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${BRAND_COLOR}" role="presentation">
    <tr>
      <td align="center" style="color:#ffffff;font-family:${FONT};font-size:13px;line-height:1.8;padding:0 40px;">
        <strong>FUNKOLAND</strong><br>
        © ${new Date().getFullYear()} Funkoland. Todos los derechos reservados.
      </td>
    </tr>
  </table>

  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${BRAND_COLOR}" role="presentation">
    <tr><td height="40"></td></tr>
  </table>

  <!-- Bottom spacer -->
  <table width="640" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#f1f1f1" role="presentation">
    <tr><td height="30"></td></tr>
  </table>

</td></tr>
</tbody>
</table>

</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, items, total } = req.body as {
    email: string;
    name: string;
    items: { name: string; price: number }[];
    total: number;
  };

  if (!email || !name || !items || total == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await resend.emails.send({
    from: "Funkoland <onboarding@resend.dev>",
    to: email,
    subject: `Confirmación de pedido #${ORDER_NUMBER} — Funkoland`,
    html: buildHtml(name, items, total),
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}

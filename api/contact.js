/**
 * Vercel serverless: POST /api/contact
 * Handles contact enquiries + newsletter signups via Resend.
 *
 * Env:
 *   RESEND_API_KEY  (required)
 *   RESEND_TO       (default: saadnaseeroffice@gmail.com without verified domain)
 *   RESEND_FROM     (default: The Aussies <onboarding@resend.dev>)
 *   RESEND_INTENDED_TO (default: contact@theaussies.org)
 */
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    const type = String(body.type || "contact").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const source = String(body.source || "website").trim();
    const isNewsletter = type === "newsletter";

    if (!email || (!isNewsletter && (!name || !message))) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          ok: false,
          error: isNewsletter
            ? "Email is required."
            : "Name, email, and message are required.",
        })
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: false, error: "Invalid email." }));
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ ok: false, error: "Email service not configured." })
      );
    }

    const to = process.env.RESEND_TO || "saadnaseeroffice@gmail.com";
    const from =
      process.env.RESEND_FROM || "The Aussies <onboarding@resend.dev>";
    const intendedTo =
      process.env.RESEND_INTENDED_TO || "contact@theaussies.org";

    const subject = isNewsletter
      ? `Newsletter signup → ${intendedTo}`
      : `Website enquiry from ${name || email} → ${intendedTo}`;

    const html = isNewsletter
      ? `<h2>Newsletter signup — The Aussies</h2>
<p><strong>Deliver to (business inbox):</strong> ${escapeHtml(intendedTo)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Source:</strong> ${escapeHtml(source)}</p>`
      : `<h2>New enquiry from The Aussies website</h2>
<p><strong>Deliver to (business inbox):</strong> ${escapeHtml(intendedTo)}</p>
<p><strong>Source:</strong> ${escapeHtml(source)}</p>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

    const text = isNewsletter
      ? `Newsletter signup (forward to ${intendedTo})\nEmail: ${email}\nSource: ${source}`
      : `New enquiry (forward to ${intendedTo})\nSource: ${source}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${message}`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("Resend error", r.status, data);
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          ok: false,
          error: data?.message || "Failed to send email.",
        })
      );
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: true, id: data.id || null }));
  } catch (err) {
    console.error("contact api error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: false, error: "Server error." }));
  }
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

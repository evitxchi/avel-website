const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nqwltqewwarbcphvaxsy.supabase.co";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_7UcP1_MLYCA1uEYf9oOh7w_GAOlgRfI";

const form = document.querySelector("#avel-contact-form");
const submitButton = document.querySelector("#contact-submit");
const formNote = document.querySelector("#contact-form-note");

function setFormMessage(message, tone = "") {
  formNote.textContent = message;
  formNote.classList.toggle("is-error", tone === "error");
  formNote.classList.toggle("is-success", tone === "success");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const fields = new FormData(form);
  if (String(fields.get("website") || "").trim()) {
    form.reset();
    setFormMessage("Thank you. Your inquiry has been received.", "success");
    return;
  }

  const payload = {
    name: String(fields.get("name") || "").trim(),
    email: String(fields.get("email") || "").trim().toLowerCase(),
    phone: String(fields.get("phone") || "").trim() || null,
    message: String(fields.get("message") || "").trim(),
  };

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  setFormMessage("Sending your message…");

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/avel_contact_inquiries`, {
      method: "POST",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);

    form.reset();
    setFormMessage("Thank you. Your inquiry has been received.", "success");
  } catch (error) {
    console.error("Avel contact submission failed", error);
    setFormMessage("We couldn’t send your message right now. Please try again in a moment.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
});

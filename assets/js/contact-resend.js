/**
 * Intercept Gravity contact + newsletter forms; submit via /api/contact (Resend).
 */
(function () {
  var ENDPOINT = "/api/contact";
  var CONTACT_FORMS = ["gform_2", "gform_6"];
  var NEWSLETTER_FORMS = ["gform_1"];

  function field(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || "").trim() : "";
  }

  function showStatus(form, type, text) {
    var id = "aussies-form-status";
    var host = form.closest(".footer-form-newsletter") || form.parentElement || form;
    var box = host.querySelector("#" + id);
    if (!box) {
      box = document.createElement("div");
      box.id = id;
      box.setAttribute("role", "status");
      box.style.cssText =
        "margin-top:16px;padding:14px 16px;border-radius:12px;font-size:14px;line-height:1.4;";
      host.appendChild(box);
    }
    box.style.background = type === "ok" ? "#E2FF31" : "#FEE2E2";
    box.style.color = "#131924";
    box.textContent = text;
  }

  function showContactSuccess(form) {
    var wrap = form.closest(".gform_wrapper") || form.parentElement;
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="aussies-contact-success" style="padding:24px 8px;text-align:left;">' +
      '<h3 style="margin:0 0 10px;font-size:22px;">Thanks — message sent</h3>' +
      '<p style="margin:0;opacity:.85;">We\'ve received your enquiry and will get back to you ASAP.</p>' +
      "</div>";
  }

  function showNewsletterSuccess(form) {
    var wrap = form.closest(".gform_wrapper") || form.parentElement;
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="aussies-newsletter-success" style="padding:8px 0;color:#fff;">' +
      "<p style=\"margin:0;font-size:15px;\">Thanks — you're subscribed. We'll be in touch.</p>" +
      "</div>";
  }

  async function submitContact(form, btn) {
    var name = field(form, "input_1");
    var email = field(form, "input_4");
    var phone = field(form, "input_5");
    var message = field(form, "input_8");

    if (!name || !email || !message) {
      showStatus(form, "err", "Please fill in name, email, and message.");
      return;
    }

    var original = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }

    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: name,
          email: email,
          phone: phone,
          message: message,
          source: form.id === "gform_6" ? "contact-popup" : "contact-page",
        }),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not send. Please try again.");
      }
      showContactSuccess(form);
    } catch (err) {
      showStatus(
        form,
        "err",
        (err && err.message) || "Could not send. Please try again."
      );
      if (btn) {
        btn.disabled = false;
        btn.textContent = original || "Submit";
      }
    }
  }

  async function submitNewsletter(form, btn) {
    var email = field(form, "input_1");
    if (!email || email.indexOf("@") < 1) {
      showStatus(form, "err", "Please enter a valid email address.");
      return;
    }

    var original = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }

    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          name: "Newsletter subscriber",
          email: email,
          phone: "",
          message: "Please add this email to The Aussies newsletter list.",
          source: "footer-newsletter",
        }),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not subscribe. Please try again.");
      }
      showNewsletterSuccess(form);
    } catch (err) {
      showStatus(
        form,
        "err",
        (err && err.message) || "Could not subscribe. Please try again."
      );
      if (btn) {
        btn.disabled = false;
        btn.textContent = original || "Subscribe";
      }
    }
  }

  function bind(form, kind) {
    if (!form || form.dataset.aussiesResendBound === "1") return;
    form.dataset.aussiesResendBound = "1";
    form.removeAttribute("target");
    form.setAttribute("action", "#");

    var handler = kind === "newsletter" ? submitNewsletter : submitContact;

    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var btn =
          form.querySelector('[type="submit"]') ||
          form.querySelector(".gform_button");
        handler(form, btn);
        return false;
      },
      true
    );

    var btn = form.querySelector('[type="submit"], .gform_button');
    if (btn) {
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          handler(form, btn);
          return false;
        },
        true
      );
    }
  }

  function boot() {
    CONTACT_FORMS.forEach(function (id) {
      bind(document.getElementById(id), "contact");
    });
    NEWSLETTER_FORMS.forEach(function (id) {
      bind(document.getElementById(id), "newsletter");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();

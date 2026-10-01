/**
 * Intercept Gravity contact forms and submit via /api/contact (Resend).
 */
(function () {
  var ENDPOINT = "/api/contact";
  var FORM_IDS = ["gform_2", "gform_6"];

  function field(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || "").trim() : "";
  }

  function showStatus(form, type, text) {
    var id = "aussies-contact-status";
    var box = form.parentElement && form.parentElement.querySelector("#" + id);
    if (!box) {
      box = document.createElement("div");
      box.id = id;
      box.setAttribute("role", "status");
      box.style.cssText =
        "margin-top:16px;padding:14px 16px;border-radius:12px;font-size:14px;line-height:1.4;";
      (form.parentElement || form).appendChild(box);
    }
    box.style.background = type === "ok" ? "#E2FF31" : "#FEE2E2";
    box.style.color = "#131924";
    box.textContent = text;
  }

  function showSuccess(form) {
    var wrap = form.closest(".gform_wrapper") || form.parentElement;
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="aussies-contact-success" style="padding:24px 8px;text-align:left;">' +
      "<h3 style=\"margin:0 0 10px;font-size:22px;\">Thanks — message sent</h3>" +
      "<p style=\"margin:0;opacity:.85;\">We've received your enquiry and will get back to you ASAP.</p>" +
      "</div>";
  }

  async function submitForm(form, btn) {
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
      showSuccess(form);
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

  function bind(form) {
    if (!form || form.dataset.aussiesResendBound === "1") return;
    form.dataset.aussiesResendBound = "1";
    // Stop Gravity iframe AJAX
    form.removeAttribute("target");
    form.setAttribute("action", "#");
    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var btn =
          form.querySelector('[type="submit"]') ||
          form.querySelector(".gform_button");
        submitForm(form, btn);
        return false;
      },
      true
    );

    // Also catch Gravity's button click handler
    var btn = form.querySelector('[type="submit"], .gform_button');
    if (btn) {
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          submitForm(form, btn);
          return false;
        },
        true
      );
    }
  }

  function boot() {
    FORM_IDS.forEach(function (id) {
      bind(document.getElementById(id));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  // Popup may be injected late
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();

async function startPayment() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const amount = document.getElementById("amount").value;

  if (!name || !email || !amount) {
    document.getElementById("msg").textContent =
      "Please fill all fields";
    return;
  }

  try {
    const res = await fetch("/pay/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        amount: Number(amount)
      })
    });

    const data = await res.json();

    if (!data.authorization_url) {
      document.getElementById("msg").textContent =
        "Payment initialization failed";
      return;
    }

    // Redirect to Paystack
    window.location.href = data.authorization_url;

  } catch (err) {
    console.error(err);
    document.getElementById("msg").textContent =
      "Payment error. Try again.";
  }
}

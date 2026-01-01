const express = require("express");
const axios = require("axios");

const router = express.Router();

/* ================================
   INIT PAYSTACK PAYMENT
================================ */
router.post("/init", async (req, res) => {
  try {
    const { name, email, amount } = req.body;

    if (!name || !email || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Number(amount) * 100,
        callback_url: "http://localhost:3000/paystack-success",
        metadata: {
          contributor_name: name,
          purpose: "LEGAL ACTIONS AGAINST TMT TRAVEL AGENCY"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(paystackRes.data.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Initialization failed" });
  }
});

/* ================================
   VERIFY PAYSTACK PAYMENT
================================ */
router.get("/verify/:reference", async (req, res) => {
  try {
    const ref = req.params.reference;

    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }
      }
    );

    const data = verifyRes.data.data;

    if (data.status !== "success") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    console.log("Contribution received:", {
      name: data.metadata.contributor_name,
      email: data.customer.email,
      amount: data.amount / 100
    });

    res.redirect("/thank-you.html");

  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
});

/* ================================
   EXPORT ROUTER (CRITICAL)
================================ */
module.exports = router;

const router = require("express").Router();
const Contact = require("../models/contactModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Submit a new contact message
router.post("/submit-contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    await newContact.save();
    res.send({
      success: true,
      message: "Contact message submitted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Get all contact messages (admin only)
router.get("/get-all-contacts", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Contact messages fetched successfully",
      data: contacts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

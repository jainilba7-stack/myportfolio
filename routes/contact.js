import express from 'express';
import Contact from '../models/Contact.js';
import { sendContactEmail } from '../utils/mailer.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a new contact form message
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Input Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.'
      });
    }

    // Save to MongoDB
    let savedContact = null;
    try {
      savedContact = await Contact.create({
        name,
        email,
        subject,
        message,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || ''
      });
    } catch (dbErr) {
      console.warn('⚠️ Warning: Could not save to MongoDB:', dbErr.message);
    }

    // Send Email via Nodemailer
    let emailSent = false;
    try {
      await sendContactEmail({ name, email, subject, message });
      emailSent = true;
    } catch (mailErr) {
      console.error('❌ Error sending email notification:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received successfully.',
      data: {
        id: savedContact ? savedContact._id : null,
        emailSent
      }
    });
  } catch (error) {
    console.error('❌ Server error processing contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

export default router;

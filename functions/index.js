const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// ✅ Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// ✅ Firebase Cloud Function to Send Email
exports.sendEmail = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }

  const { email, movies } = req.body;

  if (!email || !movies) {
    return res.status(400).json({ message: "Missing email or movie list" });
  }

  const movieList = movies.map((movie, index) => `${index + 1}. ${movie.title}`).join("\n");

  const mailOptions = {
    from: gmailEmail,
    to: email,
    subject: "Your Personalized Movie List from Lumeo 🎬",
    text: `Hello! 🎥 Here are your top 10 movie recommendations:\n\n${movieList}\n\nEnjoy! 🍿`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

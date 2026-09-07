require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Donor = require("./models/DonorRegistration");
const Recipient = require("./models/RecipientRequest");

const demoPassword = "LifelyDemo123!";
const donors = [
  ["Aarav Sharma", "aarav.sharma", "Delhi", "Delhi", "O+", "Blood"],
  ["Ananya Iyer", "ananya.iyer", "Bengaluru", "Karnataka", "A+", "Plasma"],
  ["Vihaan Patel", "vihaan.patel", "Ahmedabad", "Gujarat", "B+", "Platelets"],
  ["Diya Nair", "diya.nair", "Kochi", "Kerala", "AB+", "Blood"],
  ["Arjun Reddy", "arjun.reddy", "Hyderabad", "Telangana", "O-", "Blood"],
  ["Meera Singh", "meera.singh", "Jaipur", "Rajasthan", "A-", "Plasma"],
  ["Kabir Khan", "kabir.khan", "Lucknow", "Uttar Pradesh", "B-", "Platelets"],
  ["Ishita Das", "ishita.das", "Kolkata", "West Bengal", "O+", "Blood"],
  ["Aditya Joshi", "aditya.joshi", "Pune", "Maharashtra", "AB-", "Kidney"],
  ["Saanvi Rao", "saanvi.rao", "Chennai", "Tamil Nadu", "B+", "Blood"],
  ["Rohan Kapoor", "rohan.kapoor", "Chandigarh", "Chandigarh", "O-", "Plasma"],
  ["Kavya Menon", "kavya.menon", "Thiruvananthapuram", "Kerala", "A+", "Blood"],
  ["Yash Verma", "yash.verma", "Bhopal", "Madhya Pradesh", "B+", "Platelets"],
  ["Nisha Gupta", "nisha.gupta", "Patna", "Bihar", "O+", "Blood"],
  ["Reyansh Shah", "reyansh.shah", "Surat", "Gujarat", "A-", "Bone marrow/stem cells"]
];

const recipients = [
  ["Maya Thomas", "maya.thomas", "Mumbai", "Maharashtra", "Blood", "critical"],
  ["Ayaan Khan", "ayaan.khan", "New Delhi", "Delhi", "Platelets", "urgent"],
  ["Riya Chatterjee", "riya.chatterjee", "Kolkata", "West Bengal", "Blood", "soon"],
  ["Dev Malhotra", "dev.malhotra", "Gurugram", "Haryana", "Plasma", "planned"],
  ["Sara Fernandes", "sara.fernandes", "Goa", "Goa", "Blood", "urgent"],
  ["Manav Kulkarni", "manav.kulkarni", "Nagpur", "Maharashtra", "Kidney", "planned"],
  ["Ira Sethi", "ira.sethi", "Amritsar", "Punjab", "Blood", "soon"],
  ["Neil George", "neil.george", "Coimbatore", "Tamil Nadu", "Platelets", "urgent"],
  ["Aditi Saxena", "aditi.saxena", "Kanpur", "Uttar Pradesh", "Blood", "planned"],
  ["Karan Bansal", "karan.bansal", "Indore", "Madhya Pradesh", "Plasma", "soon"],
  ["Pooja Yadav", "pooja.yadav", "Ranchi", "Jharkhand", "Blood", "critical"],
  ["Rudra Mehta", "rudra.mehta", "Vadodara", "Gujarat", "Liver", "planned"],
  ["Tara Banerjee", "tara.banerjee", "Bhubaneswar", "Odisha", "Blood", "urgent"],
  ["Vivaan Roy", "vivaan.roy", "Guwahati", "Assam", "Platelets", "soon"],
  ["Sia Prasad", "sia.prasad", "Visakhapatnam", "Andhra Pradesh", "Blood", "planned"]
];

const splitName = name => {
  const parts = name.split(" ");
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

async function getOrCreateUser(username, name, index) {
  const { firstName, lastName } = splitName(name);
  return User.findOneAndUpdate(
    { username },
    {
      $setOnInsert: {
        username,
        email: `${username}@demo.lifely.test`,
        passwordHash: await bcrypt.hash(demoPassword, 10),
        firstName,
        lastName,
        phone: `+91 90000 ${String(10000 + index).slice(-5)}`,
        country: "India",
        city: "",
        role: "user"
      }
    },
    { new: true, upsert: true }
  );
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lifely");
  const [donorUsers, recipientUsers] = await Promise.all([
    Promise.all(donors.map((entry, index) => getOrCreateUser(entry[1], entry[0], index + 1))),
    Promise.all(recipients.map((entry, index) => getOrCreateUser(entry[1], entry[0], index + 101)))
  ]);

  await Promise.all(donors.map(async (entry, index) => {
    const [, , city, state, bloodGroup, donationType] = entry;
    return Donor.findOneAndUpdate(
      { userId: donorUsers[index]._id, "location.city": city },
      {
        userId: donorUsers[index]._id,
        donationTypes: [donationType],
        bloodInformation: { bloodGroup, rhFactor: bloodGroup.endsWith("+") ? "positive" : "negative" },
        location: { country: "India", state, city },
        availability: { status: index % 3 === 0 ? "available_now" : "advance_notice" },
        privacySettings: { visibility: "limited" },
        verificationStatus: "verified",
        registrationStatus: "active"
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }));

  await Promise.all(recipients.map(async (entry, index) => {
    const [, , city, state, requiredDonationType, urgency] = entry;
    return Recipient.findOneAndUpdate(
      { userId: recipientUsers[index]._id, "location.city": city },
      {
        userId: recipientUsers[index]._id,
        requiredDonationType,
        bloodInformation: { bloodGroup: ["O+", "A+", "B+", "AB+"][index % 4], rhFactor: "positive", quantity: "1 unit" },
        requestInformation: { description: "Demo request for testing the Lifely recipient directory." },
        hospitalInformation: { name: "Lifely Demo Hospital", city },
        location: { country: "India", state, city },
        urgency,
        contactPreferences: { method: "in_app", phoneVisible: false, emailVisible: false },
        verificationStatus: "verified",
        requestStatus: "active"
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }));

  console.log("Seeded 15 Indian donors and 15 Indian recipients.");
  console.log(`Demo login password: ${demoPassword}`);
}

seed().catch(error => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});

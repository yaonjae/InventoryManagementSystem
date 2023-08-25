const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.user.findMany();
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addProfile = async (req, res) => {
  const {
    username,
    password,
    email,
    firstname,
    lastname,
    middle,
    role,
    barangay,
    city,
    province,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstname,
        lastname,
        middle,
        email,
        role,
        barangay,
        city,
        province,
      },
    });

    res.status(201).json({ message: "Profile Added", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add profile" });
  }
};

exports.updateProfile = async (req, res) => {
  const {
    id,
    username,
    password,
    email,
    firstname,
    lastname,
    middle,
    role,
    barangay,
    city,
    province,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        username,
        password: hashedPassword,
        firstname,
        lastname,
        middle,
        email,
        role,
        barangay,
        city,
        province,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add profile" });
  }
};

exports.updateProfileCustomer = async (req, res) => {
  const {
    id,
    username,
    password,
    email,
    firstname,
    lastname,
    middle,
    barangay,
    city,
    province,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        username,
        password: hashedPassword,
        firstname,
        lastname,
        middle,
        email,
        barangay,
        city,
        province,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add profile" });
  }
};

exports.deleteProfile = async (req, res) => {
    const { id } = req.body;

  try {
    const deletedProfile = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.json(deletedProfile);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

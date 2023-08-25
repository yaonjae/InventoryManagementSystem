const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addSupplier = async (req, res) => {
  const { name, number, email, terms } = req.body;

  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        name: name,
        number: number,
        email: email,
        terms: terms,
      },
    });
    res.json(newSupplier);
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  const { id, name, number, email, terms } = req.body;

  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        number,
        email,
        terms,
      },
    });

    res.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the supplier." });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedSupplier = await prisma.supplier.delete({
      where: {
        id: id,
      },
    });

    res.json(deletedSupplier);
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Error deleting supplier" });
  }
};

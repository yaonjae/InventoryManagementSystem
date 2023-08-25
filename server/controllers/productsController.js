const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, brand, category, price, supplierId, description } = req.body;

  try {
    const newProducts = await prisma.products.create({
      data: {
        name: name,
        brand: brand,
        category: category,
        quantity: 0,
        price: parseFloat(price),
        description: description,
        supplier: {
          connect: { id: supplierId },
        },
      },
    });

    res.json(newProducts);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id, name, brand, category, price, supplierId, description } =
    req.body;

  try {
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: {
        name,
        brand,
        category,
        price: parseFloat(price),
        description,
        supplier: {
          connect: { id: supplierId },
        },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the product." });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedProduct = await prisma.products.delete({
      where: {
        id: id,
      },
    });

    res.json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

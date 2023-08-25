const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany();
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addStock = async (req, res) => {
  try {
    const {
      productId,
      supplierId,
      orderDate,
      quantity,
      productName,
      supplierName,
      cost,
    } = req.body;

    // Create a new stock entry
    const stockEntry = await prisma.stock.create({
      data: {
        productId,
        supplierId,
        orderDate,
        quantity,
        productName,
        supplierName,
        cost,
      },
    });

    res.status(201).json(stockEntry);
  } catch (error) {
    console.error("Error replenishing stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateStock = async (req, res) => {
  const { id, isReceived, receivedQuantity } = req.body;

  try {
    const stock = await prisma.stock.findUnique({
      where: { id: id },
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found." });
    }

    await prisma.stock.update({
      where: { id: id },
      data: { isReceived, receivedQuantity },
    });

    await prisma.products.update({
      where: { id: stock.productId },
      data: {
        quantity: {
          increment: receivedQuantity,
        },
      },
    });

    res.json({ message: "Stock marked as received." });
  } catch (error) {
    console.error("Error marking stock as received:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateQuantity = async (req, res) => {
  const { id, quantity, receivedQuantity } =
    req.body;

  try {
    const updatedProduct = await prisma.products.update({
      where: { id: id },
      data: {
        quantity: quantity + receivedQuantity
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

exports.deleteStock = async (req, res) => {
  // Implement the "delete-stocks" route logic here
};

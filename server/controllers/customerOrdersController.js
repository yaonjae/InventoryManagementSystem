const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCustomerOrders = async (req, res) => {
  try {
    const cart = await prisma.cart.findMany();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addCustomerOrder = async (req, res) => {
  const {
    userId,
    productId,
    supplierId,
    quantity,
    price,
    productName,
    supplierName,
  } = req.body;

  try {
    const newOrder = await prisma.cart.create({
      data: {
        userId,
        productId,
        supplierId,
        quantity,
        price,
        productName,
        supplierName,
      },
    });

    res.json(newOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomerOrder = async (req, res) => {
  const { id, isPending, orderDate } = req.body;
  try {
    const newPending = await prisma.cart.update({
      where: { id: id },
      data: { isPending, orderDate },
    });
    res.json(newPending);
  } catch (error) {
    console.error("Error marking order as received:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProductQuantity = async (req, res) => {
  const { id, quantity } = req.body;
  try {
    const newQuantity = await prisma.products.update({
      where: { id: id },
      data: { quantity },
    });
    res.json(newQuantity);
  } catch (error) {
    console.error("Error marking order as received:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCustomerOrderReceived = async (req, res) => {
    const { id, isReceived, receiveDate } = req.body;
    try {
      const newPending = await prisma.cart.update({
        where: { id: id },
        data: { isReceived, receiveDate },
      });
      res.json(newPending);
    } catch (error) {
      console.error("Error marking order as received:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

exports.deleteCustomerOrder = async (req, res) => {};

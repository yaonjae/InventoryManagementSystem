const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productsController = require("./controllers/productsController");
const suppliersController = require("./controllers/suppliersController");
const stocksController = require("./controllers/stocksController");
const profilesController = require("./controllers/profilesController");
const customerOrderController = require("./controllers/customerOrdersController");
const { authorizeToken } = require("./authorizeToken");

app.get("/api/products", productsController.getProducts);
app.post("/api/add-products", productsController.addProduct);
app.put("/api/update-products", productsController.updateProduct);
app.delete("/api/delete-products", productsController.deleteProduct);

app.get("/suppliers", suppliersController.getSuppliers);
app.post("/add-suppliers", suppliersController.addSupplier);
app.put("/api/update-suppliers", suppliersController.updateSupplier);
app.delete("/api/delete-suppliers", suppliersController.deleteSupplier);

app.get("/stocks", stocksController.getStocks);
app.post("/api/stocks", stocksController.addStock);
app.put("/api/update-stocks", stocksController.updateStock);
app.put("/api/update-quantity", stocksController.updateQuantity);
app.delete("/api/stocks/:stockId", stocksController.deleteStock);

app.get("/user", profilesController.getProfiles);
app.post("/api/user", profilesController.addProfile);
app.put("/api/update-user", profilesController.updateProfile);
app.put("/api/update-customer", profilesController.updateProfileCustomer);
app.delete("/api/delete-user", profilesController.deleteProfile);

app.get("/customerOrders", customerOrderController.getCustomerOrders);
app.post("/api/customerOrder", customerOrderController.addCustomerOrder);
app.put("/api/update-customerOrder", customerOrderController.updateCustomerOrder);
app.put("/api/update-product-quantity", customerOrderController.updateProductQuantity);
app.put("/api/update-customerOrderReceived", customerOrderController.updateCustomerOrderReceived);
app.delete("/api/delete-customerOrder", customerOrderController.deleteCustomerOrder);

app.post("/register", async (req, res) => {
  const { username, password, email, firstname, lastname, middle, role } = req.body;
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
      },
    });

    res.status(201).json({ message: "Registration successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        lastname: true,
        firstname: true,
        middle: true,
        email: true,
        role: true,
        barangay: true,
        city: true,
        province: true
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user_id: user.id,
          username: user.username,
          lastname: user.lastname,
          firstname: user.firstname,
          middle: user.middle,
          email: user.email,
          role: user.role,
          barangay: user.barangay,
          city: user.city,
          province: user.province
        },
        "SECRET",
        {
          expiresIn: "2h",
        }
      );

      res.json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/logout", async (req, res) => {
  try {
    res.clearCookie();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout failed", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

app.put("/api/profile", authorizeToken, async (req, res) => {
  const { username, email, firstname, lastname, middle } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: decoded.user_id },
      data: {
        username,
        email,
        firstname,
        lastname,
        middle,
      },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
});

app.get("/api/profile", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json(users);
  });
});

app.get("/", async (req, res) => {
  res.status(200).send({ message: "Success" });
});

app.listen(8888, () => {
  console.log("Server is running on port http://localhost:8888");
});

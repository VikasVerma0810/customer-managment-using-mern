import express from "express";
import Customer from "../models/customer.js";

const router = express.Router();

// API to get all customers with pagination and sorting
router.get("/customers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortField = req.query.sortBy || "_id";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const sortOption = {};
    sortOption[sortField] = sortOrder;

    const customers = await Customer.find()
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCustomers = await Customer.countDocuments();

    const totalPages = Math.ceil(totalCustomers / limit);

    const response = {
      page,
      totalPages,
      totalCustomers,
      customers
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


// API to add a new customer
router.post("/customers", async (req, res) => {
    try {
        console.log("added");
      const { name, email, phone } = req.body;
      // Check if the email already exists
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ error: true, message: "Email already exists" });
      }
      const customer = new Customer({ name, email, phone });
      const newCustomer = await customer.save();
     
      res.status(201).json(newCustomer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  });


// API to search for customers with pagination
router.get("/customers/search", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const { query } = req.query;

    const customers = await Customer.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    })
    .skip((page - 1) * limit)
    .limit(limit);

    const totalCustomers = await Customer.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    });

    const totalPages = Math.ceil(totalCustomers / limit);

    const response = {
      page,
      totalPages,
      totalCustomers,
      customers
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;

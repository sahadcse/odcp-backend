const createAdminService = require("../services/admin/createAdminService");
const getAllAdminsService = require("../services/admin/getAllAdminsService");
const updateAdminService = require("../services/admin/updateAdminService");
const deleteAdminService = require("../services/admin/deleteAdminService");
const loginAdminService = require("../services/admin/loginAdminService");
const getAdminByIdService = require("../services/admin/getSingleAdminService");

// Create a new admin
const createAdmin = async (req, res) => {
  // check if all required fields are present
  const adminField = ["name", "email", "password"];

  const isValidOperation = adminField.every((field) => req.body[field]);

  if (!isValidOperation) {
    return res.status(400).send({ error: "Please Input all Field" });
  }

  try {
    const admin = await createAdminService(req.body);
    res.status(201).send(admin);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Please provide email and password" });
  }

  try {
    const admin = await loginAdminService({ email, password });
    res.send(admin);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await getAllAdminsService();
    res.send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  console.log("req.files", req.files);
  try {
    const updates = Object.keys(req.body);
    // console.log("updates", req.body);
    const allowedUpdates = [
      "name",
      "email",
      "password",
      "isActive",
      "permissions",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    // remove permission if not superadmin
    if (req.admin.role !== "superadmin") {
      delete req.body.permissions;
    }

    // get files from req.body
    if (req.files) {
      const { profile_picture } = req.files;
      req.body.profile_picture = profile_picture[0].path;
    }

    if (!isValidOperation || req.body.length === 0) {
      return res
        .status(400)
        .send({ error: "Invalid updates or no fields provided!" });
    }

    const admin = await updateAdminService(req.params.id, req.body);
    res.send(admin);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await getAdminByIdService(req.params.id);
    res.send(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await deleteAdminService(req.params.id);
    res.send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminById,
};

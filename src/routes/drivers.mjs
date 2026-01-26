import { Router } from "express";

import { validationResult, matchedData, checkSchema } from "express-validator";
// Validation Shemas
import { addDriverValidationsSchema } from "../utils/validationShemas/driver.js";
// Consts
import { driverExistsMiddleware } from "../utils/midwares/drivers.js";

import { drivers } from "../data/drivers.js";

const router = Router();

// ======== Get =========

// Get Drivers (Includes Filter)
router.get("/", (req, res) => {
  const { filter, value } = req.query;

  if (filter && value) {
    const filteredDrivers = drivers.filter((driver) =>
      driver[filter]?.toString().toLowerCase().includes(value.toLowerCase()),
    );
    return res.status(200).send(filteredDrivers);
  }

  return res.status(200).send(drivers);
});

// Get Driver By Id
router.get("/:id", (req, res) => {
  const driverId = parseInt(req.params.id);

  // Handling type of id not a number
  if (isNaN(driverId)) {
    return res.status(400).send({ msg: "Driver Id Should be a number" });
  }
  const driver = drivers.find((driver) => driver.id == driverId);

  // Handling the driver is not found
  if (!driver) {
    return res.status(404).send({ msg: "Bad Request, Invalid Id" });
  }
  res.status(200).send(driver);
});

// ========== Post =========

router.post("/", checkSchema(addDriverValidationsSchema), (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { username, phone, city } = matchedData(req);
  const id = drivers.length > 0 ? drivers[drivers.length - 1].id + 1 : 1;
  const newDriver = {
    id,
    username,
    phone,
    city,
  };

  const isFound = drivers.find((driver) => driver.phone == phone);

  // Handling driver existing
  if (isFound) {
    return res.status(400).send({ msg: "Driver Already Exists" });
  }

  // Handling Success
  if (username && phone && city) {
    drivers.push(newDriver);
    return res
      .status(201)
      .send({ msg: "Driver added Successfully", data: newDriver });
  }

  // Handling bad request
  return res.status(400).send({ msg: "Bad Request, Missing Data" });
});

// ========= Put ============

router.put("/:id", driverExistsMiddleware, (req, res) => {
  const parsedId = req.parsedId;
  const driverIndex = req.driverIndex;
  const { username, phone, city } = req.body;

  const updatedDriver = {
    id: parsedId,
    username,
    phone,
    city,
  };

  drivers[driverIndex] = updatedDriver;

  return res.status(200).send({
    msg: "Driver Updated Successfully",
    data: updatedDriver,
  });
});

// ======== Patch ==========
router.patch("/:id", driverExistsMiddleware, (req, res) => {
  const driverIndex = req.driverIndex;

  drivers[driverIndex] = { ...drivers[driverIndex], ...req.body };

  return res.status(200).send({
    msg: "Driver updated successfully",
    data: drivers[driverIndex],
  });
});

// ======== Delete =========

router.delete("/:id", driverExistsMiddleware, (req, res) => {
  const driverIndex = req.driverIndex;

  drivers.splice(driverIndex, 1);

  return res.status(200).send({
    msg: "User Deleted Successfully",
  });
});

export default router;

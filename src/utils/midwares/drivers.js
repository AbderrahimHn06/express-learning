import { drivers } from "../../data/drivers.js";

export const driverExistsMiddleware = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Invalid Id" });
  }

  const driverIndex = drivers.findIndex((driver) => driver.id == parsedId);

  if (driverIndex < 0) {
    return res.status(404).send({ msg: "Driver Not Found" });
  }
  req.driverIndex = driverIndex;
  req.parsedId = parsedId;
  next();
};

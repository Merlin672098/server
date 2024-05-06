  const express = require("express");
  const { Location, LocationSchema } = require("../models/ubicacion");
  const ubiRouter = express.Router();

  ubiRouter.post("/api/ubiping", async (req, res) => {
    try {
      const { name, latitude, longitude, linea, id_usuario } = req.body;

      const existingLocation = await Location.findOne({ id_usuario });

      if (existingLocation) {
        await Location.findOneAndUpdate(
          { id_usuario },
          { latitude, longitude },
          { new: true }
        );
        res.status(200).json({ message: 'Ubicación actualizada correctamente' });
      } else {
        let newLocation = new Location({
          name,
          latitude,
          longitude,
          linea,
          id_usuario
        });
        await newLocation.save();
        res.status(201).json({ message: 'Ubicación guardada correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  ubiRouter.get("/api/ubiping", async (req, res) => {
    try {
      const locations = await Location.find({});
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  module.exports = ubiRouter;

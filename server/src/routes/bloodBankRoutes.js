import express from "express";

import BloodBank from "../models/BloodBank.js";

const router = express.Router();


/* =====================================
   ADD BLOOD BANK
===================================== */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      location,
      phone,
      bloodStock,
    } = req.body;


    if (!name || !location) {
      return res.status(400).json({
        message:
          "Blood bank name and location are required",
      });
    }


    const bloodBank =
      await BloodBank.create({
        name,
        location:
          location.toLowerCase(),
        phone,
        bloodStock,
      });


    res.status(201).json({
      message:
        "Blood bank added successfully",

      bloodBank,
    });

  } catch (error) {

    console.error(
      "Blood bank creation error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to add blood bank",
    });

  }
});


/* =====================================
   SEARCH BLOOD BANK BY LOCATION
===================================== */

router.get("/", async (req, res) => {
  try {

    const { location } =
      req.query;


    let query = {};


    if (location) {

      query.location = {
        $regex:
          location.toLowerCase(),

        $options:
          "i",
      };

    }


    const bloodBanks =
      await BloodBank.find(query)
        .sort({
          createdAt: -1,
        });


    res.json(
      bloodBanks
    );

  } catch (error) {

    console.error(
      "Blood bank search error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load blood banks",
    });

  }

});


/* =====================================
   GET SINGLE BLOOD BANK
===================================== */

router.get("/:id", async (req, res) => {
  try {

    const bloodBank =
      await BloodBank.findById(
        req.params.id
      );


    if (!bloodBank) {

      return res.status(404).json({
        message:
          "Blood bank not found",
      });

    }


    res.json(
      bloodBank
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to load blood bank",
    });

  }

});


export default router;
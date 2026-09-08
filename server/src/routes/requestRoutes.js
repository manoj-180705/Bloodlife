import express from "express";

import Request from "../models/Request.js";

const router = express.Router();


/* =====================================
   CREATE BLOOD REQUEST
===================================== */

router.post("/", async (req, res) => {
  try {

    const {
      patientName,
      bloodGroup,
      location,
      phone,
      units,
      hospital,
      message,
      requestedBy,
    } = req.body;


    if (
      !patientName ||
      !bloodGroup ||
      !location ||
      !phone ||
      !requestedBy
    ) {

      return res.status(400).json({
        message:
          "Please fill all required fields",
      });

    }


    const request =
      await Request.create({

        patientName,

        bloodGroup,

        location,

        phone,

        units:
          units || 1,

        hospital:
          hospital || "",

        message:
          message || "",

        // Logged-in user who created the request
        requestedBy,

        status:
          "Active",

        isEmergency:
          true,

      });


    res.status(201).json({

      message:
        "Emergency blood request created successfully",

      request,

    });

  } catch (error) {

    console.error(
      "Create blood request error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create blood request",
    });

  }

});


/* =====================================
   GET ACTIVE BLOOD REQUEST COUNT

   IMPORTANT:
   This must come BEFORE "/:id"
===================================== */

router.get(
  "/count",
  async (req, res) => {

    try {

      const count =
        await Request.countDocuments({
          status: "Active",
        });


      res.status(200).json({
        count,
      });

    } catch (error) {

      console.error(
        "Request count error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load request count",
      });

    }

  }
);


/* =====================================
   GET ALL ACTIVE BLOOD REQUESTS
===================================== */

router.get("/", async (req, res) => {

  try {

    const requests =
      await Request.find({
        status: "Active",
      })
        .sort({
          createdAt: -1,
        });


    res.status(200).json(
      requests
    );

  } catch (error) {

    console.error(
      "Fetch requests error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load blood requests",
    });

  }

});


/* =====================================
   GET SINGLE REQUEST
===================================== */

router.get("/:id", async (req, res) => {

  try {

    const request =
      await Request.findById(
        req.params.id
      );


    if (!request) {

      return res.status(404).json({
        message:
          "Blood request not found",
      });

    }


    res.status(200).json(
      request
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to load blood request",
    });

  }

});


/* =====================================
   UPDATE REQUEST STATUS

   Only the user who created the request
   can change its status.
===================================== */

router.put(
  "/:id/status",
  async (req, res) => {

    try {

      const {
        status,
        userId,
      } = req.body;


      if (
        ![
          "Active",
          "Fulfilled",
          "Cancelled",
        ].includes(status)
      ) {

        return res.status(400).json({
          message:
            "Invalid request status",
        });

      }


      const request =
        await Request.findById(
          req.params.id
        );


      if (!request) {

        return res.status(404).json({
          message:
            "Blood request not found",
        });

      }


      // Only request owner can update

      if (
        request.requestedBy.toString() !==
        userId
      ) {

        return res.status(403).json({

          message:
            "You can update only your own blood request",

        });

      }


      request.status =
        status;


      await request.save();


      res.status(200).json({

        message:
          "Request status updated successfully",

        request,

      });

    } catch (error) {

      console.error(
        "Update request error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update request",

      });

    }

  }
);


/* =====================================
   DELETE BLOOD REQUEST

   Only the user who created the request
   can delete it.
===================================== */

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const {
        userId,
      } = req.body;


      if (!userId) {

        return res.status(400).json({

          message:
            "User ID is required",

        });

      }


      const request =
        await Request.findById(
          req.params.id
        );


      if (!request) {

        return res.status(404).json({

          message:
            "Blood request not found",

        });

      }


      // Check whether logged-in user
      // created this request

      if (
        request.requestedBy.toString() !==
        userId.toString()
      ) {

        return res.status(403).json({

          message:
            "You can delete only your own blood request",

        });

      }


      await Request.findByIdAndDelete(
        req.params.id
      );


      res.status(200).json({

        message:
          "Blood request deleted successfully",

      });

    } catch (error) {

      console.error(
        "Delete request error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to delete blood request",

      });

    }

  }
);


export default router;
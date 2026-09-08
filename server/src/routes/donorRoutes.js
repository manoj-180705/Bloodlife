import express from "express";
import User from "../models/User.js";

const router = express.Router();


/* =========================================
   HELPER: UPDATE DONOR AVAILABILITY
========================================= */

const updateDonorAvailability = async () => {
  try {
    const today = new Date();

    // 90 days ago
    const threeMonthsAgo = new Date();

    threeMonthsAgo.setDate(
      today.getDate() - 90
    );

    // Donors who donated more than 90 days ago
    // become available again

    await User.updateMany(
      {
        role: "donor",

        lastDonated: {
          $ne: null,
          $lte: threeMonthsAgo,
        },
      },

      {
        $set: {
          isAvailable: true,
        },
      }
    );

  } catch (error) {
    console.error(
      "Availability update error:",
      error
    );
  }
};


/* =========================================
   GET DASHBOARD STATISTICS
========================================= */

router.get("/stats", async (req, res) => {
  try {
    await updateDonorAvailability();

    // Total donors
    const totalDonors =
      await User.countDocuments({
        role: "donor",
      });


    // Available donors
    const availableDonors =
      await User.countDocuments({
        role: "donor",
        isAvailable: true,
      });


    // Total donations
    const donationResult =
      await User.aggregate([
        {
          $match: {
            role: "donor",
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: "$donations",
            },
          },
        },
      ]);


    const totalDonations =
      donationResult.length > 0
        ? donationResult[0].total
        : 0;


    res.status(200).json({
      totalDonors,
      availableDonors,
      totalDonations,
    });

  } catch (error) {

    console.error(
      "Stats error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load statistics",
    });

  }
});


/* =========================================
   GET ALL DONORS
========================================= */

router.get("/", async (req, res) => {
  try {

    await updateDonorAvailability();


    const donors =
      await User.find({
        role: "donor",
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });


    res.status(200).json(donors);

  } catch (error) {

    console.error(
      "Fetch donors error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch donors",
    });

  }
});


/* =========================================
   SEARCH DONORS
   /api/donors/search?bloodGroup=O%2B&location=Nandyal
========================================= */

router.get("/search/filter", async (req, res) => {
  try {

    await updateDonorAvailability();

    const {
      bloodGroup,
      location,
    } = req.query;


    const query = {
      role: "donor",
    };


    // Blood group filter
    if (
      bloodGroup &&
      bloodGroup !== "All"
    ) {
      query.bloodGroup = bloodGroup;
    }


    // Location filter
    if (
      location &&
      location.trim() !== ""
    ) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }


    const donors =
      await User.find(query)
        .select("-password")
        .sort({
          isAvailable: -1,
          createdAt: -1,
        });


    res.status(200).json(donors);

  } catch (error) {

    console.error(
      "Search donor error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to search donors",
    });

  }
});


/* =========================================
   ADD DONOR MANUALLY
========================================= */

router.post("/", async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      bloodGroup,
      location,
      lastDonated,
      password,
    } = req.body;


    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });


    if (existingUser) {

      return res.status(400).json({
        message:
          "A donor with this email already exists",
      });

    }


    let isAvailable = true;


    // If donor has donated before,
    // check whether 90 days have passed

    if (lastDonated) {

      const donationDate =
        new Date(lastDonated);


      const availableDate =
        new Date(donationDate);


      availableDate.setDate(
        availableDate.getDate() + 90
      );


      isAvailable =
        new Date() >= availableDate;
    }


    const donor =
      await User.create({

        name,

        email:
          email.toLowerCase(),

        phone,

        bloodGroup,

        location,

        lastDonated:
          lastDonated
            ? new Date(lastDonated)
            : null,

        password:
          password ||
          "temporarypassword123",

        isAvailable,

        donations:
          lastDonated
            ? 1
            : 0,

        points:
          lastDonated
            ? 40
            : 0,

        role: "donor",

      });


    const donorResponse =
      donor.toObject();


    delete donorResponse.password;


    res.status(201).json({

      message:
        "Donor added successfully",

      donor:
        donorResponse,

    });

  } catch (error) {

    console.error(
      "Create donor error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create donor",
    });

  }
});


/* =========================================
   UPDATE LAST BLOOD DONATED DATE
========================================= */

router.put(
  "/:id/last-donated",

  async (req, res) => {

    try {

      const {
        lastDonated,
      } = req.body;


      if (!lastDonated) {

        return res.status(400).json({
          message:
            "Please select a donation date",
        });

      }


      const donationDate =
        new Date(lastDonated);


      if (
        donationDate >
        new Date()
      ) {

        return res.status(400).json({
          message:
            "Donation date cannot be in the future",
        });

      }


      const donor =
        await User.findOneAndUpdate(

          {
            _id: req.params.id,
            role: "donor",
          },

          {
            $set: {

              lastDonated:
                donationDate,

              // Immediately unavailable
              isAvailable:
                false,

            },

            $inc: {

              donations: 1,

              points: 40,

            },

          },

          {
            new: true,
            runValidators: true,
          }

        ).select("-password");


      if (!donor) {

        return res.status(404).json({
          message:
            "Donor not found",
        });

      }


      res.status(200).json({

        message:
          "Last blood donation date updated successfully",

        donor,

      });

    } catch (error) {

      console.error(
        "Update donation date error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update donation date",
      });

    }

  }
);


/* =========================================
   GET SINGLE DONOR
========================================= */

router.get("/:id", async (req, res) => {

  try {

    await updateDonorAvailability();


    const donor =
      await User.findOne({

        _id:
          req.params.id,

        role:
          "donor",

      })
        .select("-password");


    if (!donor) {

      return res.status(404).json({
        message:
          "Donor not found",
      });

    }


    res.status(200).json(
      donor
    );

  } catch (error) {

    console.error(
      "Fetch donor error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch donor",
    });

  }

});


/* =========================================
   DONOR AVAILABILITY INFORMATION
========================================= */

router.get(
  "/:id/availability",

  async (req, res) => {

    try {

      await updateDonorAvailability();


      const donor =
        await User.findOne({

          _id:
            req.params.id,

          role:
            "donor",

        })
          .select(
            "-password"
          );


      if (!donor) {

        return res.status(404).json({
          message:
            "Donor not found",
        });

      }


      let availableFrom =
        null;


      if (
        donor.lastDonated
      ) {

        availableFrom =
          new Date(
            donor.lastDonated
          );


        availableFrom.setDate(
          availableFrom.getDate() + 90
        );

      }


      res.status(200).json({

        isAvailable:
          donor.isAvailable,

        availableFrom,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to check availability",
      });

    }

  }
);


export default router;
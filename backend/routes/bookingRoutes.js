const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getAllBookings, getMyBookings, createBooking, updateBookingStatus, deleteBooking } = require("../controllers/bookingController");

const router = express.Router();
router.use(protect);

router.route("/")
    .get(getAllBookings)
    .post(createBooking);

router.route("/my-bookings")
    .get(getMyBookings);

router.route("/:id")
    .put(updateBookingStatus)
    .delete(deleteBooking);

module.exports = router;

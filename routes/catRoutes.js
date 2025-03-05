const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const catController = require("../controllers/catController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Cat Pictures
 *   description: Endpoints for managing user-specific cat pictures
 */

/**
 * @swagger
 * /api/cats:
 *   post:
 *     summary: Upload a new cat picture
 *     tags: [Cat Pictures]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               catPic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Picture uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.single("catPic"), catController.uploadCatPic);

/**
 * @swagger
 * /api/cats:
 *   get:
 *     summary: Get all uploaded cat pictures for the authenticated user
 *     tags: [Cat Pictures]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of cat pictures uploaded by the user
 */
router.get("/", protect, catController.getAllCatPics);

/**
 * @swagger
 * /api/cats/{id}:
 *   get:
 *     summary: Fetch a specific cat picture (Only if owned by the user)
 *     tags: [Cat Pictures]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cat picture ID
 *     responses:
 *       200:
 *         description: Picture retrieved successfully
 *       404:
 *         description: Picture not found
 */
router.get("/:id", protect, catController.getCatPicById);

/**
 * @swagger
 * /api/cats/{id}:
 *   put:
 *     summary: Update a cat picture (Only if owned by the user)
 *     tags: [Cat Pictures]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               catPic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Picture updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Picture not found
 */
router.put(
  "/:id",
  protect,
  upload.single("catPic"),
  catController.updateCatPic
);

/**
 * @swagger
 * /api/cats/{id}:
 *   delete:
 *     summary: Delete a cat picture (Only if owned by the user)
 *     tags: [Cat Pictures]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Picture deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Picture not found
 */
router.delete("/:id", protect, catController.deleteCatPic);

module.exports = router;

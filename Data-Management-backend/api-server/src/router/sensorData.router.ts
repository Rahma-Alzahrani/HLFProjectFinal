import { Router } from "express";
import { postSensorData, getSensorData, deleteSensorData,updateSensorData,getSensorDataById } from "../controllers/sensorData";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SensorData
 *   description: API operations for Sensor Data
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorData:
 *       type: object
 *       properties:
 *         device_id:
 *           type: string
 *           description: The ID of the device.
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               deviceid:
 *                 type: string
 *                 description: The ID of the device.
 *               data:
 *                 type: number
 *                 description: The sensor data value.
 *               timestamp:
 *                 type: integer
 *                 format: int64
 *                 description: The timestamp of the sensor data.
 *           description: An array of sensor data entries.
 *         isCompleted:
 *           type: boolean
 *           description: Indicates whether the data collection is completed.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the sensor data collection.
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: The start time of data collection.
 *       required:
 *         - deviceid
 *         - data
 *         - isCompleted
 *         - timestamp
 *       example:
 *         deviceid: '123456'
 *         data:
 *           - deviceid: '123456'
 *             data: 0.00061840636
 *             timestamp: 1693817649633
 *         isCompleted: false
 *         timestamp: '2023-09-04T08:54:09.676Z'
 *         start_time: '2023-09-04T08:00:00.000Z'
 */


/**
 * @swagger
 * /api/v1/sensordata:
 *   post:
 *     summary: Create a new sensor data entry.
 *     tags: [SensorData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       200:
 *         description: Successfully created a new sensor data entry.
 *         content:
 *           application/json:
 *             example:
 *               deviceid: '123456'
 *               data:
 *                 - deviceid: '123456'
 *                   data: 0.00061840636
 *                   timestamp: 1693817649633
 *               isCompleted: false
 *               timestamp: '2023-09-04T08:54:09.676Z'
 *       400:
 *         description: Bad request, invalid input data.
 *
 *   get:
 *     summary: Get a list of sensor data entries.
 *     tags: [SensorData]
 *     responses:
 *       200:
 *         description: Successfully retrieved sensor data entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *
 * /api/v1/sensordata/{id}:
 *   get:
 *     summary: Get a sensor data entry by ID.
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the sensor data entry.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved a sensor data entry by ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Sensor data entry not found.
 *
 *   put:
 *     summary: Update a sensor data entry by ID.
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the sensor data entry to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       200:
 *         description: Successfully updated a sensor data entry by ID.
 *       404:
 *         description: Sensor data entry not found.
 *
 *   delete:
 *     summary: Delete a sensor data entry by ID.
 *     tags: [SensorData]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the sensor data entry to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted a sensor data entry by ID.
 *       404:
 *         description: Sensor data entry not found.
 */


router.post("/", postSensorData);
router.get("/", getSensorData);
router.put("/", updateSensorData);
router.delete("/:id", deleteSensorData);
router.get("/:id", getSensorDataById);

export default router;


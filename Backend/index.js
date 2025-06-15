import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.js";
import cors from "cors";
import loginroutes from "./routes/loginroutes.js";
import appointmentroutes from "./routes/appointments.js";
import patientroutes from "./routes/patient.route.js";
import reminderroutes from "./routes/notifications.js";

import documentRoutes from "./routes/documents.js";
dotenv.config();
const app=express();


app.use(cors(
    {
        origin:"*"
    }
));
app.use(express.json());
app.use("/auth",loginroutes);
app.use("/appointments",appointmentroutes);
app.use("/patients",patientroutes);
app.use("/reminder",reminderroutes);

app.use('/reminders', reminderroutes);
app.use('/documents', documentRoutes);
// Serve uploaded files
app.use("/uploads", express.static("uploads"))
app.listen(process.env.PORT,()=>{
    connectDB();
    console.log(`server is running on ${process.env.PORT}`)
})
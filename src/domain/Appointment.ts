import { Patient } from "./models/Patient";
import { Doctor } from "./models/Doctor";

export interface Appointment {
    id: string;
    date: Date;
    time: string;
    patient: Patient;
    doctor: Doctor; // Added doctor to the appointment
  }
  
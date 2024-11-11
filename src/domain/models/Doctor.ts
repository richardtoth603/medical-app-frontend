import { Patient } from "./Patient";
import { Appointment } from "../Appointment";

export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    patients: Patient[];
    appointments: Appointment[];
  }
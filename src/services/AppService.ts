import { Doctor } from "@/domain/models/Doctor";
import { Patient } from "@/domain/models/Patient";

export class PatientLocalUrls {
    static readonly allDoctorsList = "https://localhost:7062/Doctors/GetAllDoctors";
    static readonly allPatientsList = "https://localhost:7062/Pacients/GetAllPacients";
    static readonly getPatientById = "https://localhost:7062/Pacients/GetPacientById/";
    static readonly getDoctorById = "https://localhost:7062/Doctors/GetDoctorById/";
}

export class AppService {
    public static async getAllDoctors(): Promise<Doctor[]> {
        const response = await fetch(PatientLocalUrls.allDoctorsList, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            // map the data to the Doctor type, from the list called 'records' returned in the response
            return data.records.map((doctor: any) => {
                return {
                    id: doctor.id,
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                    specialization: doctor.specialization
                };
            }) as Doctor[];
            return data;
        } else {
            throw new Error("Unable to fetch data");
        }
    }

    public static async getAllPatients(): Promise<Patient[]> {
        const response = await fetch(PatientLocalUrls.allPatientsList, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            // map the data to the Patient type, from the list called 'records' returned in the response
            return data.records.map((patient: any) => {
                return {
                    id: patient.id,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    dateOfBirth: new Date(patient.dateOfBirth),
                    email: patient.email,
                };
            }) as Patient[];
            return data;
        } else {
            throw new Error("Unable to fetch data");
        }
    }

    public static async getPatientById(id: string): Promise<Patient> {
        const response = await fetch(PatientLocalUrls.getPatientById + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: new Date(data.dateOfBirth),
                email: data.email,
            } as Patient;
        } else {
            throw new Error("Unable to fetch data");
        }
    }

    public static async getDoctorById(id: string): Promise<Doctor> {
        const response = await fetch(PatientLocalUrls.getDoctorById + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                specialization: data.specialization
            } as Doctor;
        } else {
            throw new Error("Unable to fetch data");
        }
    }
}
import { Doctor } from "@/domain/models/Doctor";

export class PatientLocalUrls {
    static readonly allDoctorsList = "https://localhost:7062/Doctors/GetAllDoctors";
}

export class PatientService {
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
}
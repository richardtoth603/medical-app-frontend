import { ChatMessage } from "@/domain/models/ChatMessage";
import { Doctor } from "@/domain/models/Doctor";
import { Patient } from "@/domain/models/Patient";

export class PatientLocalUrls {
    static readonly allDoctorsList = "https://localhost:7062/Doctors/GetAllDoctors";
    static readonly allPatientsList = "https://localhost:7062/Pacients/GetAllPacients";
    static readonly getPatientById = "https://localhost:7062/Pacients/GetPacientById/";
    static readonly getDoctorById = "https://localhost:7062/Doctors/GetDoctorById/";
    static readonly getDocumentsByPatientId = "https://localhost:7062/Document/GetDocumentByPatientId/";
    static readonly addDocument = "https://localhost:7062/Document/AddDocument";
    static readonly getMessagesById = "https://localhost:7062/Messages/GetMessagesByIDs";
    static readonly sendMessage = "https://localhost:7062/Messages/SendMessage";
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

    public static async getDocumentsByPatientId(id: string): Promise<File[]> {
        const response = await fetch(PatientLocalUrls.getDocumentsByPatientId + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();

            // Convert each document record to a File
            const files = data.records.map((document: any) => {
                // Decode the Base64 file data
                const byteCharacters = atob(document.fileData);
                const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);

                // Convert to a Blob with the correct MIME type
                const blob = new Blob([byteArray], { type: document.fileType });

                // Wrap Blob in a File with a meaningful name and type
                const fileName = document.title;
                return new File([blob], fileName, { type: document.fileType });
            });

            return files;
        } else {
            throw new Error("Unable to fetch data");
        }
    }

    public static async addDocument(document: File, patientId: string): Promise<void> {
        // Convert the file to a Base64-encoded string
        const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(document);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    
        // Remove the data URL prefix if you only need the Base64 content
        const base64FileData = fileData.split(',')[1];
    
        const body = JSON.stringify({
            title: document.name,
            pacientId: patientId,
            fileType: "PDF", // e.g., "application/pdf"
            fileData: base64FileData,
        });
    
        const response = await fetch(PatientLocalUrls.addDocument, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: body,
        });
    
        if (!response.ok) {
            throw new Error("Unable to upload document");
        }
    }

    public static async getMessagesByIDs(doctorID: string, patientID: string): Promise<ChatMessage[]>{
        const response = await fetch(`${PatientLocalUrls.getMessagesById}/${doctorID}/${patientID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if(response.ok){
            const data = await response.json();

            return data.records.map((message: any) => {
                return{
                    id: message.id,
                    doctorID: message.doctorID,
                    content: message.content,
                    patientId: message.patientId,
                    sentAt: new Date(message.sentAt)
                }
            }) as ChatMessage[];
        } else{
            throw new Error("Unable to fetch messages");
        }
    }

    public static async sendMessage(message: Omit<ChatMessage, 'id' | 'sentAt'>): Promise<ChatMessage> {
        const response = await fetch(PatientLocalUrls.sendMessage, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(message),
        });

        if (response.ok) {
            const data = await response.json();
            return {
                id: data.id,
                doctorID: data.doctorID,
                content: data.content,
                patientId: data.patientId,
                sentAt: new Date(data.sentAt)
            } as ChatMessage;
        } else {
            throw new Error("Unable to send message");
        }
    }
}
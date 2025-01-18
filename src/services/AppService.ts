import { ChatMessage } from "@/domain/models/ChatMessage";
import { Appointment } from "@/domain/models/Appointment";
import { Doctor } from "@/domain/models/Doctor";
import { Patient } from "@/domain/models/Patient";

export class PatientLocalUrls {
    static readonly allDoctorsList = "https://localhost:7062/Doctors/GetAllDoctors";
    static readonly allPatientsList = "https://localhost:7062/Pacients/GetAllPacients";
    static readonly getPatientById = "https://localhost:7062/Pacients/GetPacientById/";
    static readonly getDoctorById = "https://localhost:7062/Doctors/GetDoctorById/";
    static readonly getDocumentsByPatientId = "https://localhost:7062/Document/GetDocumentByPatientId/";
    static readonly addDocument = "https://localhost:7062/Document/AddDocument";
    static readonly allAppointmentsList = "https://localhost:7062/Appointments/GetAllAppointments";
    static readonly getAppointmentById = "https://localhost:7062/Appointments/GetAppointmentById/";
    static readonly getAppointmentByPatientId = "https://localhost:7062/Appointments/GetAppointmentByPacientId/";
    static readonly getAppointmentByDoctorId = "https://localhost:7062/Appointments/GetAppointmentByDoctorId/";
    static readonly getSortedAndPaginatedAppointment = "https://localhost:7062/Appointments/GetSortedAndPaginatedAppointments";
    static readonly updateAppointment = "https://localhost:7062/Appointments/UpdateAppointment";
    static readonly deleteAppointment = "https://localhost:7062/Appointments/DeleteAppointment/";
    static readonly addAppointment = "https://localhost:7062/Appointments/CreateAppointment";
    static readonly getMessagesById = "https://localhost:7062/ChatMessage/GetSortedAndPaginatedChatMessagesBySentByIdAndSentTo";
    static readonly sendMessage = "https://localhost:7062/ChatMessage/CreateChatMessage";
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
            const text = await response.text();
            console.log('Raw response text:', text);
    
            try {
                const data = JSON.parse(text);
                console.log('Parsed data:', data);
    
                return {
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    specialization: data.specialization,
                } as Doctor;
            } catch (error) {
                console.error('Error parsing JSON:', error);
                throw new Error('Failed to parse response as JSON');
            }
        } else {
            console.error('Error fetching doctor data:', response.statusText);
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

    public static async getMessagesByIDs(sentBy: string, sentTo: string): Promise<ChatMessage[]>{
        const response = await fetch(`${PatientLocalUrls.getMessagesById}?Member1=${sentBy}&Member2=${sentTo}`, {
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
                    sentTo: message.sentTo,
                    content: message.content,
                    sentBy: message.sentBy,
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
                sentBy: data.sentBy,
                content: data.content,
                sentTo: data.sentTo,
                sentAt: new Date(data.sentAt)
            } as ChatMessage;
        } else {
            throw new Error("Unable to send message");
        }
    }

    public static async getAllAppointments(): Promise<Appointment[]> {
        const response = await fetch(PatientLocalUrls.allAppointmentsList, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            // map the data to the Appointment type, from the list called 'records' returned in the response
            return data.records.map((appointment: any) => {
                const [date, time] = appointment.date.split("T"); // Split date and time
                return {
                    id: appointment.id,
                    doctorId: appointment.doctorId,
                    patientId: appointment.pacientId,
                    date: new Date(date), // Only the date part
                    time: time.replace("Z", ""), // Time without 'Z' (optional cleanup)
                };
            }) as Appointment[];
            return data;
        } else {
            throw new Error("Unable to fetch data");
        }
    }

    public static async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
        const response = await fetch(PatientLocalUrls.getAppointmentByPatientId + patientId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data.records.map((appointment: any) => ({
                id: appointment.id,
                date: new Date(appointment.date.split("T")[0]), // Extract date
                time: appointment.date.split("T")[1]?.replace("Z", ""), // Extract time
                patientId: appointment.pacientId,
                doctorId: appointment.doctorId,
            })) as Appointment[];
        } else {
            throw new Error("Unable to fetch appointments by patient ID");
        }
    }

    public static async getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
        const response = await fetch(PatientLocalUrls.getAppointmentByDoctorId + doctorId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data.records.map((appointment: any) => ({
                id: appointment.id,
                date: new Date(appointment.date.split("T")[0]),
                time: appointment.date.split("T")[1]?.replace("Z", ""),
                patientId: appointment.pacientId,
                doctorId: appointment.doctorId,
            })) as Appointment[];
        } else {
            throw new Error("Unable to fetch appointments by doctor ID");
        }
    }

    public static async addAppointment(appointment: Appointment): Promise<void> {
        const body = JSON.stringify({
            pacientId: appointment.patientId,
            doctorId: appointment.doctorId,
            date: `${appointment.date.toISOString().split("T")[0]}T${appointment.time}Z`, // Combine date and time
        });

        const response = await fetch(PatientLocalUrls.addAppointment, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body,
        });

        if (!response.ok) {
            throw new Error("Unable to add appointment");
        }
    }

    public static async updateAppointment(appointment: Appointment): Promise<void> {
        const body = JSON.stringify({
            id: appointment.id,
            pacientId: appointment.patientId,
            doctorId: appointment.doctorId,
            date: `${appointment.date.toISOString().split("T")[0]}T${appointment.time}Z`,
        });

        const response = await fetch(PatientLocalUrls.updateAppointment, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body,
        });

        if (!response.ok) {
            throw new Error("Unable to update appointment");
        }
    }

    public static async deleteAppointment(appointmentId: string): Promise<void> {
        const response = await fetch(PatientLocalUrls.deleteAppointment + appointmentId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Unable to delete appointment");
        }
    }
    
}
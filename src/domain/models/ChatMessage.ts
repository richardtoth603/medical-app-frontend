export interface ChatMessage{
    id: string,
    patientId: string,
    doctorID: string,
    content: string,
    sentAt: Date
}
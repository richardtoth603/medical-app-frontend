import { AppService } from "@/services/AppService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchDoctors = () => {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: () => AppService.getAllDoctors(),
    });
}

export const useFetchDoctorById = (doctorId: string) => {
    return useQuery({
        queryKey: ['doctor', doctorId],
        queryFn: () => AppService.getDoctorById(doctorId),
    });
}

export const useFetchDocumentsByPatientId = (patientId: string) => {
    return useQuery({
        queryKey: ['documents', patientId],
        queryFn: () => AppService.getDocumentsByPatientId(patientId),
    });
}

// export const useAddDocument = (data: {file: {title: string, fileType: string, fileData: string}, patientId: string}) => {
//     const file = new File([data.file.fileData], data.file.title, { type: data.file.fileType });
//     return useQuery({
//         queryKey: ['addDocument'],
//         queryFn: (data: any) => AppService.addDocument(file, data.patientId),
//     });
// }

export const useAddDocument = () => {
    const queryClient = useQueryClient();
    return useMutation((data: {file: File, patientId: string}) => {
        return AppService.addDocument(data.file, data.patientId);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['documents']);
        }
    });
}

export const useFetchAppointmentsByPatientId = (patientId: string) => {
    return useQuery({
        queryKey: ['appointments', 'patient', patientId],
        queryFn: () => AppService.getAppointmentsByPatientId(patientId),
    });
}

export const useAddAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AppService.addAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']); // Refetch appointments after adding
        },
    });
}
import { AppService } from "@/services/AppService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchPatients = () => {
    return useQuery({
        queryKey: ['patients'],
        queryFn: () => AppService.getAllPatients(),
    });
}

export const useFetchPatientById = (id: string) => {
    return useQuery({
        queryKey: ['patient', id],
        queryFn: () => AppService.getPatientById(id),
    });
}

export const useFetchAppointments = () => {
    return useQuery({
        queryKey: ['appointment'],
        queryFn: () => AppService.getAllAppointments(),
    });
}

export const useFetchAppointmentsByPatientId = (patientId: string) => {
    return useQuery({
        queryKey: ['appointments', 'patient', patientId],
        queryFn: () => AppService.getAppointmentsByPatientId(patientId),
    });
}

export const useFetchAppointmentsByDoctorId = (doctorId: string) => {
    return useQuery({
        queryKey: ['appointments', 'doctor', doctorId],
        queryFn: () => AppService.getAppointmentsByDoctorId(doctorId),
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

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AppService.updateAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']); // Refetch appointments after updating
        },
    });
}

export const useDeleteAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AppService.deleteAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']); // Refetch appointments after deleting
        },
    });
}
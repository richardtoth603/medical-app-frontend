import { AppService } from "@/services/AppService";
import { useQuery } from "@tanstack/react-query";

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
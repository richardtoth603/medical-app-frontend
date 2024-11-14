import { AppService } from "@/services/AppService";
import { useQuery } from "@tanstack/react-query";

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
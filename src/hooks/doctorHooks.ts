import { PatientService } from "@/services/PatientServices";
import { useQuery } from "@tanstack/react-query";

export const useFetchPatients = () => {
    return useQuery({
        queryKey: ['patients'],
        queryFn: () => PatientService.getAllPatients(),
    });
}
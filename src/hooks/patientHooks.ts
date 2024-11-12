import { PatientService } from "@/services/PatientServices";
import { useQuery } from "@tanstack/react-query";

export const useFetchDoctors = () => {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: () => PatientService.getAllDoctors(),
    });
}
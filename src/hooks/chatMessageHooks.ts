import { AppService } from "@/services/AppService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@/domain/models/ChatMessage";

export const useFetchMessages = (doctorID: string, patientID: string) => {
    return useQuery({
        queryKey: ['messages', doctorID, patientID],
        queryFn: () => AppService.getMessagesByIDs(doctorID, patientID)
    });
}

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newMessage: Omit<ChatMessage, 'id' | 'sentAt'>) => 
            AppService.sendMessage(newMessage),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['messages', variables.doctorID, variables.patientId]);
        },
    });
}


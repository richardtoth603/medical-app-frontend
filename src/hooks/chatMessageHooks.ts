import { AppService } from "@/services/AppService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@/domain/models/ChatMessage";

export const useFetchMessages = (sentBy: string, sentTo: string) => {
    return useQuery({
        queryKey: ['messages', sentBy, sentTo],
        queryFn: () => AppService.getMessagesByIDs(sentBy, sentTo)
    });
}

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newMessage: Omit<ChatMessage, 'id' | 'sentAt'>) => 
            AppService.sendMessage(newMessage),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['messages', variables.sentBy, variables.sentTo]);
        },
    });
}


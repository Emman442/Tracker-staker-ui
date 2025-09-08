// hooks/usePostData.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addActivity } from "@/services/postData";

export function usePostData() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: addActivity,
        onSuccess: () => {
            // refresh activity table after adding new one
            queryClient.invalidateQueries({ queryKey: ["activity"] });
        },
    });

    return { mutate, isPending };
}

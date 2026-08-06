import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseTaskAI, breakdownTaskAI } from '@/api/ai';

export const useParseTaskAI = () => {
  return useMutation({
    mutationFn: parseTaskAI,
  });
};

export const useBreakdownTaskAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, description, taskId }: { title: string; description?: string; taskId?: string }) => 
      breakdownTaskAI(title, description, taskId),
    onSuccess: (_, variables) => {
      if (variables.taskId) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
  });
};

import { useMutation, useQuery } from '@tanstack/react-query';
import { aiService } from '../api/ai';

export const useAiChat = () => {
  return useMutation({
    mutationFn: aiService.chat,
  });
};

export const useWorkoutAdaptation = () => {
  return useMutation({
    mutationFn: aiService.adaptWorkout,
  });
};

export const useApplyWorkoutAdaptation = () => {
  return useMutation({
    mutationFn: aiService.applyWorkoutAdaptation,
  });
};

export const useProgressInsight = () => {
  return useQuery({
    queryKey: ['ai-progress'],
    queryFn: aiService.getProgressInsight,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useRetentionNudge = () => {
  return useQuery({
    queryKey: ['ai-nudge'],
    queryFn: aiService.getRetentionNudge,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

import api from './index';

export const aiService = {
  chat: async (data) => {
    const response = await api.post('/ai/chat', data);
    return response.data;
  },
  
  adaptWorkout: async (request) => {
    // request can be a string prompt
    const response = await api.post('/ai/adapt/workout', request, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  },
  
  applyWorkoutAdaptation: async (adaptationJson) => {
    const response = await api.post('/ai/adapt/workout/apply', adaptationJson);
    return response.data;
  },
  
  getProgressInsight: async () => {
    const response = await api.get('/ai/analytics/progress');
    return response.data;
  },
  
  getRetentionNudge: async () => {
    const response = await api.get('/ai/analytics/nudge');
    return response.data;
  }
};

import { request } from '../request';

export interface SatisfactionRatio {
  satisfied: number;
  neutral: number;
  dissatisfied: number;
}

export interface ActivitySatisfaction extends SatisfactionRatio {
  activity: string;
}

export interface FeedbackData {
  totalResponses: number;
  overallSatisfactionRatio: SatisfactionRatio;
  perActivitySatisfaction: ActivitySatisfaction[];
  futureExpectations: string[];
  averageScore: number;
}

export const getFeedbackByYear = async (year: number): Promise<FeedbackData | null> => {
  const { data, error } = await request({ url: `/feedback/dashboard?year=${year}` });

  if (error) {
    return null;
  }

  return data as FeedbackData;
};

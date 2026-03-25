import { request } from '../request';

export type TEventBody = {
  max_budget: number | null;
  date_event: string;
  location: string;
  costume_color: string[];
  agenda: Array<{ time: { hour: number | undefined; minute: number | undefined }; title: string; content: string }>;
};

export const createEvent = async (data: TEventBody) => {
  const { data: res } = await request({
    url: '/event-config',
    method: 'POST',
    data
  });
  return res;
};

export const updateEvent = async (data: TEventBody) => {
  const { data: updatedEvent } = await request({
    url: '/event-config',
    method: 'PUT',
    data
  });
  return updatedEvent;
};

export const getEvent = async () => {
  const { data: event } = await request({
    url: '/event-config',
    method: 'GET'
  });
  return event;
};

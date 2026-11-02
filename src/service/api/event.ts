import { request } from '../request';

export type TEventBody = {
  max_budget: number | null;
  date_event: string;
  location: string;
  costume_color: string[];
  agenda: Array<{ time: { hour: number | undefined; minute: number | undefined }; title: string; content: string }>;
};

export type DrawMode = 'manual' | 'auto';

export type TDrawSetting = {
  draw_mode: DrawMode;
  date_draw: string | null;
};

export type TEventConfig = TEventBody & TDrawSetting;

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

export const updateDrawSetting = async (data: TDrawSetting) => {
  const { data: updatedEvent } = await request({
    url: '/event-config',
    method: 'PUT',
    data
  });
  return updatedEvent as TEventConfig | null;
};

export const getEvent = async () => {
  const { data: event } = await request({
    url: '/event-config',
    method: 'GET'
  });
  return event as TEventConfig | null;
};

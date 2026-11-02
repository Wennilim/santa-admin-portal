import { $t } from '@/locales';
import { request } from '../request';

export type DrawStatus = 'pending' | 'generated' | 'revealed';

export const getDrawStatus = async () => {
  const { data } = await request({ url: '/christmas-draw/get-reveal-status' });

  return data as { status: DrawStatus } | null;
};

export const generateDraw = async () => {
  const { data } = await request({ url: '/christmas-draw/generate', method: 'POST' });

  return data;
};

export const revealDraw = async () => {
  const thisYear = new Date().getFullYear();
  const { data, error } = await request({ url: `/christmas-draw/${thisYear}/reveal`, method: 'POST' });

  if (error) {
    if (error.response?.status === 404) {
      window.$message?.error($t('page.home.drawNotFound'));
    }
    return null;
  }

  return data;
};

export const deleteDraw = async () => {
  const thisYear = new Date().getFullYear();
  const { data } = await request({ url: `/christmas-draw/${thisYear}`, method: 'DELETE' });

  return data;
};

export const getAllUsersList = async () => {
  const { data } = await request({ url: '/users/get-all' });

  return data;
};

export const deleteUser = async (userId: string) => {
  const { data } = await request({
    url: `/users/${userId}`,
    method: 'DELETE'
  });

  return data;
};

export const updateSubmitGiftStatus = async (userId: string, hasSubmitGift: boolean) => {
  const { data } = await request({
    url: `/send-wishlist/submit-gift`,
    method: 'POST',
    data: { userId, hasSubmitGift }
  });

  return data;
};

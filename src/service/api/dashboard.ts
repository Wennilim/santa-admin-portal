import { $t } from '@/locales';
import { request } from '../request';

export const revealDraw = async () => {
  const thisYear = new Date().getFullYear();
  const { data, error } = await request({ url: `/christmas-draw/${thisYear}/reveal` });

  if (error) {
    if (error.response?.status === 404) {
      window.$message?.error($t('page.home.drawNotFound'));
    }
    return null;
  }

  return data;
};

export const getAllUsersList = async () => {
  const { data } = await request({ url: '/users/get-all' });

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

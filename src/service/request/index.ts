import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getAuthorization, handleExpiredRequest, logoutModal } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createFlatRequest(
  {
    baseURL
    // headers: {
    //   apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    // }
  },
  {
    defaultState: {
      errMsgStack: [],
      refreshTokenPromise: null
    } as RequestInstanceState,
    transform(response: AxiosResponse<App.Service.Response<any>>) {
      if (response.data && typeof response.data === 'object' && 'data' in (response.data as any)) {
        return response.data.data;
      }
      return response.data;
    },
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      if (response.data && typeof response.data === 'object' && 'code' in (response.data as any)) {
        return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
      }
      return response.status >= 200 && response.status < 300;
    },
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data?.code ?? response.status);

      const logout = authStore.resetStore;

      if ((import.meta.env.VITE_SERVICE_LOGOUT_CODES || '').split(',').includes(responseCode)) {
        logout();
        return null;
      }

      if ((import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES || '').split(',').includes(responseCode)) {
        const modalMsg =
          [response.data?.msg, (response.data as any)?.message, (response.data as any)?.error].find(Boolean) ||
          $t('common.error');

        if (!request.state.errMsgStack?.includes(modalMsg)) {
          request.state.errMsgStack = [...(request.state.errMsgStack || []), modalMsg];
          window.addEventListener('beforeunload', logout);

          const cleanup = () => {
            logout();
            window.removeEventListener('beforeunload', logout);
            request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
          };

          window.$dialog?.error({
            title: $t('common.error'),
            content: modalMsg,
            positiveText: $t('common.confirm'),
            onPositiveClick: cleanup,
            onClose: cleanup
          });
        }
        return null;
      }

      if ((import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES || '').split(',').includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          Object.assign(response.config.headers, { Authorization: getAuthorization() });
          return instance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let backendErrorCode = '';

      // get backend error message and code
      if (error.code === BACKEND_ERROR_CODE) {
        // message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      // the error message is displayed in the modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // when the token is expired, refresh token and retry request, so no need to show error message
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      if (error.response?.status === 401) {
        logoutModal($t('common.sessionTimeout'), error.response?.status);
      }
    }
  }
);

export const demoRequest = createRequest(
  {
    baseURL: otherBaseURL.demo
  },
  {
    transform(response: AxiosResponse<App.Service.DemoResponse>) {
      return response.data.result;
    },
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);

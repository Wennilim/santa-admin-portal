<!--
 <script setup lang="ts">
import { computed, reactive } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: 'admin',
  password: 'AdminPassword123!'
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
-->

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const STORAGE_KEY = 'remember_login';

const authStore = useAuthStore();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
  remember: boolean;
}

const model: FormModel = reactive({
  userName: '',
  password: '',
  remember: false
});

/**
 * ✅ 初始化时读取 localStorage
 */
onMounted(() => {
  setTimeout(() => {
    const cache = localStorage.getItem(STORAGE_KEY);
    if (cache) {
      const parsed = JSON.parse(cache);
      model.userName = parsed.userName;
      model.password = '';
      model.remember = parsed.remember;
    }
  }, 0);
});

const rules = computed<Record<keyof Omit<FormModel, 'remember'>, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

/**
 * ✅ 登录逻辑 + remember me 处理
 */
async function handleSubmit() {
  await validate();

  await authStore.login(model.userName, model.password);

  // ✅ 处理 remember me
  if (model.remember) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        userName: model.userName,
        password: model.password,
        remember: true
      })
    );
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
</script>

<template>
  <NForm
    ref="formRef"
    autocomplete="off"
    :model="model"
    :rules="rules"
    size="large"
    :show-label="false"
    @keyup.enter="handleSubmit"
  >
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>

    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>

    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <!-- ✅ 绑定 remember -->
        <NCheckbox v-model:checked="model.remember">
          {{ $t('page.login.pwdLogin.rememberMe') }}
        </NCheckbox>
      </div>

      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>

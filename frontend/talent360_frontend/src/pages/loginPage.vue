<template>
  <div class="login">
    <q-card class="login-card">
      <q-card-section class="login-card-section">
        <div class="text-h4">Talent 360</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical class="login-card-section">
        <mainInput v-model="loginInfo.account" label="Account" icon="fa-solid fa-circle-user" />
        <mainInput v-model="loginInfo.password" label="Password" icon="fa-solid fa-lock" />
      </q-card-actions>
      <q-card-actions vertical class="login-card-section">
        <mainBtn
          label="Login"
          icon="fa-solid fa-door-open"
          color="secondary"
          filled
          @click="onLoginClick"
        />
      </q-card-actions>
    </q-card>
    <mainLoading v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import mainInput from 'components/common/mainInput.vue';
import mainBtn from 'components/common/mainBtn.vue';
import mainLoading from 'components/common/mainLoading.vue';
import { useRouter } from 'vue-router';
import type { LoginRequest } from 'src/models/employeeModel';
import { useEmployeeApi } from '../services/employeeApi';
import { authService } from '../services/auth';

// ===== 測試模式開關（改成 false 連接真實 API）=====
const USE_MOCK_LOGIN = true;
const MOCK_ACCOUNT = 'admin';
const MOCK_PASSWORD = 'admin';

const { isLoading: apiLoading, employeeLogin } = useEmployeeApi();
const isLoading = ref(false);

const loginInfo = reactive<LoginRequest>({
  account: '',
  password: '',
});

const router = useRouter();

const onLoginClick = async () => {
  // 測試模式：使用假帳密
  if (USE_MOCK_LOGIN) {
    if (loginInfo.account === MOCK_ACCOUNT && loginInfo.password === MOCK_PASSWORD) {
      authService.setToken('mock-jwt-token-for-testing');
      await router.push('/announcement');
    } else {
      alert('帳號或密碼錯誤（測試帳密：admin / admin）');
    }
    return;
  }

  // 真實 API 登入
  try {
    isLoading.value = apiLoading.value;
    const result = await employeeLogin(loginInfo);

    if (result?.data?.isSuccess && result.data.data?.token) {
      authService.setToken(result.data.data.token);
      await router.push('/announcement');
    }
  } catch {
    // 登入失敗時可以在這裡添加錯誤提示
  }
};
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.login-card-section {
  padding: 20px;
}
</style>

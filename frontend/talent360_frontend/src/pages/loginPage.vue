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
import { reactive } from 'vue'; // 移除 ref 的匯入，因為 loading.value 已經由 useEmployeeApi 提供
import mainInput from 'components/common/mainInput.vue';
import mainBtn from 'components/common/mainBtn.vue';
import mainLoading from 'components/common/mainLoading.vue';
import { useRouter } from 'vue-router';
import type { LoginRequest } from 'src/models/employeeModel';
import { useEmployeeApi } from '../services/employeeApi';

const { isLoading, employeeLogin } = useEmployeeApi();

const loginInfo = reactive<LoginRequest>({
  account: '',
  password: '',
});

const router = useRouter();

const onLoginClick = async () => {
  try {
    const result = await employeeLogin(loginInfo);

    if (result) {
      const loginInfo = result.data?.data;
      const backendMessage = result.data?.message;
      const success = result.data?.isSuccess;

      console.log('JWT:', loginInfo);
      console.log('MES:', backendMessage);
      console.log('Sue:', success);

      await router.push('/announcement');
    }
  } catch (e) {
    console.error(e);
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

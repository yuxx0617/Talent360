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
    <mainLoading v-model="loading" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import mainInput from 'components/common/mainInput.vue';
import mainBtn from 'components/common/mainBtn.vue';
import mainLoading from 'components/common/mainLoading.vue';
import { useRouter } from 'vue-router';
import type { LoginInfo } from 'components/models.ts';

const loginInfo = reactive<LoginInfo>({
  account: '',
  password: '',
});

const loading = ref(false);

const router = useRouter();

const onLoginClick = async () => {
  try {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    loading.value = false;
    await router.push('/announcement');
  } catch (error) {
    console.error('導航失敗:', error);
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

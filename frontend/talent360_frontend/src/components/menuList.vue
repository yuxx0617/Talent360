<template>
  <n-space vertical class="menuSpace">
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :expand-icon="expandIcon"
      @update:value="handleRouter"
    />
  </n-space>
</template>

<script setup lang="ts">
import { h, computed } from 'vue';
import type { VNodeChild } from 'vue';
import { NIcon, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { MenuList } from 'src/models/models';
import { useRouter } from 'vue-router';

const props = defineProps<{
  menuData: MenuList[];
  collapsed: boolean;
}>();

// 建立icon
library.add(fas);

const renderIcon = (iconName: string): (() => VNodeChild) => {
  return () =>
    h(
      NIcon,
      {
        size: 16,
        style: { marginRight: '2px' },
      },
      {
        default: () => h(FontAwesomeIcon, { icon: iconName }),
      },
    );
};

const expandIcon = (): VNodeChild => {
  return h(NIcon, null, {
    default: () => h(FontAwesomeIcon, { icon: 'fa-solid fa-angle-down' }),
  });
};

// 轉換資料
const transformToNaiveUIOptions = (items: MenuList[]): MenuOption[] => {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map((item) => {
    const option: MenuOption = {
      label: item.label,
    };
    if (item.link) {
      option.key = item.link;
      option.link = item.link;
    } else {
      option.key = item.label;
    }
    if (item.icon) {
      option.icon = renderIcon(item.icon);
    }

    if (item.children) {
      option.children = transformToNaiveUIOptions(item.children);
    }

    return option;
  });
};

const menuOptions = computed(() => {
  return transformToNaiveUIOptions(props.menuData);
});

const router = useRouter();

const renderMenuLabel = (option: MenuOption) => {
  return option.label as string;
};

const handleRouter = async (key: string) => {
  if (key) {
    await router.push(key);
  }
};
</script>

<style scoped>
.menuSpace {
  height: 100%;
}
</style>

<template>
  <n-space vertical>
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :expand-icon="expandIcon"
    />
  </n-space>
</template>

<script setup lang="ts">
import { h, computed } from 'vue';
import type { VNodeChild } from 'vue';
import type { MenuOption } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 1. 定義 Props MenuList
interface MenuList {
  label: string;
  icon?: string;
  link?: string;
  children?: MenuList[];
}

const props = defineProps<{
  menuList: MenuList[];
  collapsed: boolean;
}>();

// 2. 建立icon
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

// 3. 轉換資料
const transformToNaiveUIOptions = (items: MenuList[]): MenuOption[] => {
  if (!items || items.length === 0) {
    return [];
  }
  return items.map((item) => {
    const option: MenuOption = {
      label: item.label,
      key: item.label,
    };
    if (item.link) {
      option.link = item.link;
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
  return transformToNaiveUIOptions(props.menuList);
});

function renderMenuLabel(option: MenuOption) {
  if ('label' in option) {
    // 使用 'label' 作為 key
    return h('a', { href: option.link, target: '_blank' }, option.label as string);
  }
  return option.label as string;
}
</script>

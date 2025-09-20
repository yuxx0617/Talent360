import { boot } from 'quasar/wrappers';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import {
  create,
  NMenu,
  NButton,
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NSpace,
  NLayout,
  NLayoutSider,
  NSwitch,
  NIcon,
} from 'naive-ui';

const naive = create({
  components: [
    NButton,
    NMenu,
    NConfigProvider,
    NMessageProvider,
    NNotificationProvider,
    NDialogProvider,
    NSpace,
    NLayout,
    NLayoutSider,
    NSwitch,
    NIcon,
  ],
});

export default boot(({ app }) => {
  app.use(naive);
});

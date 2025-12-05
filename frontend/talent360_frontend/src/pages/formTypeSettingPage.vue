<template>
  <div class="form-type-setting">
    <!-- 標題與按鈕區 -->
    <div class="header-section">
      <h1 class="page-title">Form Type Setting</h1>
      <div class="action-buttons">
        <mainBtn label="create new form type" color="primary" filled @click="openCreateDialog" />
      </div>
    </div>

    <!-- Form Type 列表 -->
    <div class="form-type-list">
      <mainListCard v-for="(formType, index) in formTypes" :key="formType.id ?? index">
        {{ formType.formTypeName }}
        <template #action>
          <mainToggle
            :model-value="formType.isActive"
            @update:model-value="(val: boolean) => toggleFormTypeStatus(index, val)"
          />
        </template>
      </mainListCard>
    </div>

    <!-- 建立 Form Type Dialog -->
    <mainDialog
      v-model="showCreateDialog"
      :title="getStepTitle()"
      @close="closeCreateDialog"
    >
      <!-- Step 1: Form Type -->
      <template v-if="currentStep === 'formType'">
        <mainFormGroup label="Form Type Name">
          <q-input v-model="newFormType.formTypeName" outlined dense placeholder="Form Type Name" />
        </mainFormGroup>

        <mainFormGroup label="Office">
          <q-select
            v-model="newFormType.office"
            :options="officeOptions"
            outlined
            dense
            emit-value
            map-options
          />
        </mainFormGroup>
      </template>

      <!-- Step 2: Basic Limit -->
      <template v-if="currentStep === 'basicLimit'">
        <mainFormGroup label="Whom Review">
          <div class="checkbox-group">
            <q-checkbox v-model="newFormType.whomReview.hr" label="HR" />
            <q-checkbox v-model="newFormType.whomReview.mainSupervisor" label="MainSupervisor" />
            <q-checkbox v-model="newFormType.whomReview.reviewer" label="Reviewer" />
          </div>
        </mainFormGroup>

        <mainFormGroup label="Other Type Limit">
          <div class="checkbox-group">
            <q-checkbox v-model="newFormType.otherTypeLimit.jobTitle" label="Job Title" />
            <q-checkbox v-model="newFormType.otherTypeLimit.jobGrade" label="Job Grade" />
            <q-checkbox v-model="newFormType.otherTypeLimit.quarter" label="Quarter" />
          </div>
        </mainFormGroup>
      </template>

      <!-- Step 3: Other Limit -->
      <template v-if="currentStep === 'otherLimit'">
        <mainFormGroup v-if="newFormType.otherTypeLimit.jobTitle" label="Job Title">
          <q-select
            v-model="newFormType.jobTitles"
            :options="jobTitleOptions"
            outlined
            dense
            multiple
            emit-value
            map-options
            use-chips
          />
        </mainFormGroup>

        <mainFormGroup v-if="newFormType.otherTypeLimit.jobGrade" label="Job Grade">
          <q-select
            v-model="newFormType.jobGrades"
            :options="jobGradeOptions"
            outlined
            dense
            multiple
            emit-value
            map-options
            use-chips
          />
        </mainFormGroup>

        <mainFormGroup v-if="newFormType.otherTypeLimit.quarter" label="Quarter">
          <q-select
            v-model="newFormType.quarters"
            :options="quarterOptions"
            outlined
            dense
            multiple
            emit-value
            map-options
            use-chips
          />
        </mainFormGroup>
      </template>

      <!-- Preview -->
      <template v-if="currentStep === 'preview'">
        <mainFormGroup label="Form Type Name">
          <div class="preview-value">{{ newFormType.formTypeName }}</div>
        </mainFormGroup>

        <mainFormGroup label="Whom Review">
          <div class="preview-value">{{ getWhomReviewText() }}</div>
        </mainFormGroup>

        <mainFormGroup label="Office">
          <div class="preview-value">{{ getOfficeText() }}</div>
        </mainFormGroup>

        <mainFormGroup v-if="newFormType.jobTitles.length > 0" label="Job Title">
          <div class="preview-value">{{ newFormType.jobTitles.join(', ') }}</div>
        </mainFormGroup>

        <mainFormGroup v-if="newFormType.jobGrades.length > 0" label="Job Grade">
          <div class="preview-value">{{ newFormType.jobGrades.join(', ') }}</div>
        </mainFormGroup>

        <mainFormGroup v-if="newFormType.quarters.length > 0" label="Quarter">
          <div class="preview-value">{{ newFormType.quarters.join(', ') }}</div>
        </mainFormGroup>
      </template>

      <!-- 按鈕區 -->
      <template #actions>
        <!-- Step 1 -->
        <template v-if="currentStep === 'formType'">
          <mainBtn label="next" color="primary" filled @click="goToStep('basicLimit')" />
        </template>

        <!-- Step 2 -->
        <template v-else-if="currentStep === 'basicLimit'">
          <mainBtn label="back" color="primary" outline @click="goToStep('formType')" />
          <mainBtn label="next" color="primary" filled @click="handleBasicLimitNext" />
        </template>

        <!-- Step 3 -->
        <template v-else-if="currentStep === 'otherLimit'">
          <mainBtn label="back" color="primary" outline @click="goToStep('basicLimit')" />
          <mainBtn label="preview" color="primary" filled @click="goToStep('preview')" />
        </template>

        <!-- Preview -->
        <template v-else-if="currentStep === 'preview'">
          <mainBtn label="back" color="primary" outline @click="handlePreviewBack" />
          <mainBtn label="create" color="primary" filled @click="onCreate" />
        </template>
      </template>
    </mainDialog>

    <mainLoading v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import mainBtn from '../components/common/mainBtn.vue';
import mainLoading from '../components/common/mainLoading.vue';
import mainDialog from '../components/common/mainDialog.vue';
import mainFormGroup from '../components/common/mainFormGroup.vue';
import mainListCard from '../components/common/mainListCard.vue';
import mainToggle from '../components/common/mainToggle.vue';
import { useFormTypeApi } from '../services/formTypeApi';
import type { FormTypeInfo, CreateFormTypeStep } from '../models/formTypeModel';

// ===== 測試模式開關 =====
const USE_MOCK_DATA = true;

// 假資料
const mockFormTypes: FormTypeInfo[] = [
  {
    id: 1,
    formTypeName: 'Form Type Name',
    office: 'taiwan',
    whomReview: { hr: true, mainSupervisor: true, reviewer: false },
    otherTypeLimit: { jobTitle: true, jobGrade: false, quarter: false },
    jobTitles: ['E3-8', 'E3-9'],
    jobGrades: [],
    quarters: [],
    isActive: true,
  },
  {
    id: 2,
    formTypeName: 'Form Type Name',
    office: 'japan',
    whomReview: { hr: true, mainSupervisor: false, reviewer: true },
    otherTypeLimit: { jobTitle: false, jobGrade: true, quarter: false },
    jobTitles: [],
    jobGrades: ['senior'],
    quarters: [],
    isActive: true,
  },
  {
    id: 3,
    formTypeName: 'Form Type Name',
    office: 'usa',
    whomReview: { hr: false, mainSupervisor: true, reviewer: true },
    otherTypeLimit: { jobTitle: false, jobGrade: false, quarter: true },
    jobTitles: [],
    jobGrades: [],
    quarters: ['Q1', 'Q2'],
    isActive: false,
  },
  {
    id: 4,
    formTypeName: 'Form Type Name',
    office: 'singapore',
    whomReview: { hr: true, mainSupervisor: true, reviewer: true },
    otherTypeLimit: { jobTitle: true, jobGrade: true, quarter: true },
    jobTitles: ['E4-1'],
    jobGrades: ['manager'],
    quarters: ['Q3'],
    isActive: true,
  },
  {
    id: 5,
    formTypeName: 'Form Type Name',
    office: 'taiwan',
    whomReview: { hr: true, mainSupervisor: false, reviewer: false },
    otherTypeLimit: { jobTitle: false, jobGrade: false, quarter: false },
    jobTitles: [],
    jobGrades: [],
    quarters: [],
    isActive: false,
  },
];

const {
  isLoading,
  getOfficeOptions,
  getJobTitleOptions,
  getJobGradeOptions,
  getQuarterOptions,
} = useFormTypeApi();

// Form Type 列表
const formTypes = ref<FormTypeInfo[]>([]);

// Dialog 狀態
const showCreateDialog = ref(false);
const currentStep = ref<CreateFormTypeStep>('formType');

// 選項
const officeOptions = getOfficeOptions();
const jobTitleOptions = getJobTitleOptions().filter((o) => o.value !== '');
const jobGradeOptions = getJobGradeOptions().filter((o) => o.value !== '');
const quarterOptions = getQuarterOptions().filter((o) => o.value !== '');

// 新 Form Type 表單
const initialFormTypeState = (): Omit<FormTypeInfo, 'id'> => ({
  formTypeName: '',
  office: '',
  whomReview: { hr: false, mainSupervisor: false, reviewer: false },
  otherTypeLimit: { jobTitle: false, jobGrade: false, quarter: false },
  jobTitles: [],
  jobGrades: [],
  quarters: [],
  isActive: true,
});

const newFormType = reactive(initialFormTypeState());

// 取得步驟標題
const getStepTitle = (): string => {
  switch (currentStep.value) {
    case 'formType':
      return 'Form Type';
    case 'basicLimit':
      return 'Basic Limit';
    case 'otherLimit':
      return 'Other Limit';
    case 'preview':
      return 'Create Form Type';
    default:
      return '';
  }
};

// 取得 Whom Review 文字
const getWhomReviewText = (): string => {
  const reviews: string[] = [];
  if (newFormType.whomReview.hr) reviews.push('HR');
  if (newFormType.whomReview.mainSupervisor) reviews.push('MainSupervisor');
  if (newFormType.whomReview.reviewer) reviews.push('Reviewer');
  return reviews.length > 0 ? reviews.join(', ') : '-';
};

// 取得 Office 文字
const getOfficeText = (): string => {
  const option = officeOptions.find((o) => o.value === newFormType.office);
  return option?.label || '-';
};

// 檢查是否有選擇 Other Type Limit
const hasOtherTypeLimit = (): boolean => {
  return (
    newFormType.otherTypeLimit.jobTitle ||
    newFormType.otherTypeLimit.jobGrade ||
    newFormType.otherTypeLimit.quarter
  );
};

// 載入 Form Types
const loadFormTypes = () => {
  if (USE_MOCK_DATA) {
    formTypes.value = [...mockFormTypes];
  }
};

// 開啟建立 Dialog
const openCreateDialog = () => {
  Object.assign(newFormType, initialFormTypeState());
  currentStep.value = 'formType';
  showCreateDialog.value = true;
};

// 關閉建立 Dialog
const closeCreateDialog = () => {
  showCreateDialog.value = false;
};

// 切換步驟
const goToStep = (step: CreateFormTypeStep) => {
  currentStep.value = step;
};

// Basic Limit 下一步處理
const handleBasicLimitNext = () => {
  if (hasOtherTypeLimit()) {
    goToStep('otherLimit');
  } else {
    goToStep('preview');
  }
};

// Preview 返回處理
const handlePreviewBack = () => {
  if (hasOtherTypeLimit()) {
    goToStep('otherLimit');
  } else {
    goToStep('basicLimit');
  }
};

// 切換 Form Type 狀態
const toggleFormTypeStatus = (index: number, value: boolean) => {
  if (USE_MOCK_DATA) {
    const formType = formTypes.value[index];
    if (formType) {
      formType.isActive = value;
    }
  }
};

// 建立 Form Type
const onCreate = () => {
  if (USE_MOCK_DATA) {
    const newId = mockFormTypes.length + 1;
    const newItem: FormTypeInfo = {
      id: newId,
      formTypeName: newFormType.formTypeName,
      office: newFormType.office,
      whomReview: { ...newFormType.whomReview },
      otherTypeLimit: { ...newFormType.otherTypeLimit },
      jobTitles: [...newFormType.jobTitles],
      jobGrades: [...newFormType.jobGrades],
      quarters: [...newFormType.quarters],
      isActive: true,
    };
    mockFormTypes.push(newItem);
    loadFormTypes();
    closeCreateDialog();
    alert('Mock: Form Type created successfully');
  }
};

// 初始化
onMounted(() => {
  loadFormTypes();
});
</script>

<style scoped>
.form-type-setting {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 500;
  color: #2f3b77;
  margin: 0;
}

/* Form Type 列表 */
.form-type-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  padding: 10px 0;
  flex-wrap: wrap;
}

.preview-value {
  padding: 10px;
  text-align: center;
  color: #333;
  font-size: 14px;
}
</style>

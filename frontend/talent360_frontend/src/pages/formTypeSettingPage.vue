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
      <div v-for="(formType, index) in formTypes" :key="formType.id ?? index" class="form-type-item">
        <span class="form-type-name">{{ formType.formTypeName }}</span>
        <q-toggle
          :model-value="formType.isActive"
          color="primary"
          @update:model-value="(val: boolean) => toggleFormTypeStatus(index, val)"
        />
      </div>
    </div>

    <!-- 建立 Form Type Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="create-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">{{ getStepTitle() }}</div>
          <q-btn icon="close" flat round dense @click="closeCreateDialog" />
        </q-card-section>

        <q-separator />

        <!-- Step 1: Form Type -->
        <q-card-section v-if="currentStep === 'formType'" class="dialog-body">
          <div class="form-group">
            <label class="form-label">Form Type Name</label>
            <q-input v-model="newFormType.formTypeName" outlined dense placeholder="Form Type Name" />
          </div>

          <div class="form-group">
            <label class="form-label">Office</label>
            <q-select
              v-model="newFormType.office"
              :options="officeOptions"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <!-- Step 2: Basic Limit -->
        <q-card-section v-if="currentStep === 'basicLimit'" class="dialog-body">
          <div class="form-group">
            <label class="form-label">Whom Review</label>
            <div class="checkbox-group">
              <q-checkbox v-model="newFormType.whomReview.hr" label="HR" />
              <q-checkbox v-model="newFormType.whomReview.mainSupervisor" label="MainSupervisor" />
              <q-checkbox v-model="newFormType.whomReview.reviewer" label="Reviewer" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Other Type Limit</label>
            <div class="checkbox-group">
              <q-checkbox v-model="newFormType.otherTypeLimit.jobTitle" label="Job Title" />
              <q-checkbox v-model="newFormType.otherTypeLimit.jobGrade" label="Job Grade" />
              <q-checkbox v-model="newFormType.otherTypeLimit.quarter" label="Quarter" />
            </div>
          </div>
        </q-card-section>

        <!-- Step 3: Other Limit -->
        <q-card-section v-if="currentStep === 'otherLimit'" class="dialog-body">
          <div v-if="newFormType.otherTypeLimit.jobTitle" class="form-group">
            <label class="form-label">Job Title</label>
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
          </div>

          <div v-if="newFormType.otherTypeLimit.jobGrade" class="form-group">
            <label class="form-label">Job Grade</label>
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
          </div>

          <div v-if="newFormType.otherTypeLimit.quarter" class="form-group">
            <label class="form-label">Quarter</label>
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
          </div>
        </q-card-section>

        <!-- Preview -->
        <q-card-section v-if="currentStep === 'preview'" class="dialog-body">
          <div class="preview-group">
            <label class="preview-label">Form Type Name</label>
            <div class="preview-value">{{ newFormType.formTypeName }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">Whom Review</label>
            <div class="preview-value">{{ getWhomReviewText() }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">Office</label>
            <div class="preview-value">{{ getOfficeText() }}</div>
          </div>

          <div v-if="newFormType.jobTitles.length > 0" class="preview-group">
            <label class="preview-label">Job Title</label>
            <div class="preview-value">{{ newFormType.jobTitles.join(', ') }}</div>
          </div>

          <div v-if="newFormType.jobGrades.length > 0" class="preview-group">
            <label class="preview-label">Job Grade</label>
            <div class="preview-value">{{ newFormType.jobGrades.join(', ') }}</div>
          </div>

          <div v-if="newFormType.quarters.length > 0" class="preview-group">
            <label class="preview-label">Quarter</label>
            <div class="preview-value">{{ newFormType.quarters.join(', ') }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 按鈕區 -->
        <q-card-actions align="right" class="dialog-actions">
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
        </q-card-actions>
      </q-card>
    </q-dialog>

    <mainLoading v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import mainBtn from '../components/common/mainBtn.vue';
import mainLoading from '../components/common/mainLoading.vue';
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

.form-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 2px solid #2f3b77;
  border-radius: 25px;
  background-color: #fff;
}

.form-type-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* Dialog */
.create-dialog {
  min-width: 450px;
  max-width: 550px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  padding: 8px 16px;
  background-color: #e8eaf6;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3b77;
  text-align: center;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  padding: 10px 0;
  flex-wrap: wrap;
}

/* 預覽樣式 */
.preview-group {
  margin-bottom: 16px;
}

.preview-label {
  display: block;
  margin-bottom: 8px;
  padding: 8px 16px;
  background-color: #e8eaf6;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3b77;
  text-align: center;
}

.preview-value {
  padding: 10px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

.dialog-actions {
  padding: 16px;
}
</style>

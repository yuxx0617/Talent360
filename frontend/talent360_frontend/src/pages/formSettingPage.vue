<template>
  <div class="form-setting-page">
    <!-- 標題與按鈕區 -->
    <div class="header-section">
      <h1 class="page-title">Form Setting</h1>
      <div class="action-buttons">
        <mainBtn label="create new form" color="primary" filled @click="openCreateDialog" />
      </div>
    </div>

    <!-- 表單卡片列表 -->
    <div class="form-cards">
      <div v-for="(form, index) in forms" :key="form.id ?? index" class="form-card">
        <div class="form-card-content">
          <div class="form-info">
            <div class="form-main-title">{{ form.mainTitle }}</div>
            <div class="form-sub-title">{{ form.subTitle }}</div>
          </div>
          <q-toggle
            :model-value="form.isActive"
            color="primary"
            @update:model-value="(val) => onToggleForm(form, val)"
          />
        </div>
      </div>
    </div>

    <!-- 建立表單 Dialog -->
    <q-dialog v-model="showCreateDialog" persistent maximized>
      <q-card class="create-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">{{ getStepTitle() }}</div>
          <q-btn icon="close" flat round dense @click="closeCreateDialog" />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <!-- Step 1: Form Info -->
          <div v-if="currentStep === 'formInfo'" class="step-content">
            <div class="form-group">
              <label class="form-label">Form Main Title</label>
              <q-input v-model="newForm.mainTitle" outlined dense placeholder="Form Main Title" />
            </div>
            <div class="form-group">
              <label class="form-label">Form Sub Title</label>
              <q-input v-model="newForm.subTitle" outlined dense placeholder="Form Sub Title" />
            </div>
            <div class="form-group">
              <label class="form-label">Form Type</label>
              <q-select
                v-model="newForm.formType"
                :options="formTypeOptions"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
          </div>

          <!-- Step 2: Form Section -->
          <div v-if="currentStep === 'formSection'" class="step-content">
            <div class="form-group">
              <label class="form-label">Form Section</label>
              <q-input
                v-model="currentSection.sectionTitle"
                outlined
                dense
                placeholder="Form Section Title"
              />
            </div>
          </div>

          <!-- Step 3: Main Question -->
          <div v-if="currentStep === 'mainQuestion'" class="step-content">
            <div class="step-subtitle">Section → Main Question</div>
            <div class="form-group">
              <label class="form-label">Main Question Main Title</label>
              <q-input
                v-model="currentMainQuestion.mainTitle"
                outlined
                dense
                placeholder="Main Question Main Title"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Main Question Sub Title</label>
              <q-input
                v-model="currentMainQuestion.subTitle"
                outlined
                dense
                placeholder="Main Question Sub Title"
              />
            </div>
            <div class="form-group toggle-group">
              <label class="form-label">Need Sub Question</label>
              <q-toggle v-model="currentMainQuestion.needSubQuestion" color="primary" />
            </div>
            <div class="form-group toggle-group">
              <label class="form-label">Need Hint</label>
              <q-toggle v-model="currentMainQuestion.needHint" color="primary" />
            </div>
            <div class="form-group">
              <label class="form-label">Question Type</label>
              <div class="question-type-selector">
                <q-btn
                  v-for="type in 7"
                  :key="type"
                  :class="{ active: currentMainQuestion.questionType === type }"
                  :label="String(type)"
                  round
                  outline
                  @click="currentMainQuestion.questionType = type as 1|2|3|4|5|6|7"
                />
                <q-icon name="help" class="help-icon" />
              </div>
            </div>
          </div>

          <!-- Step 4-1: Sub Question -->
          <div v-if="currentStep === 'subQuestion'" class="step-content">
            <div class="step-subtitle">Main Question → Sub Question</div>
            <div class="form-group">
              <label class="form-label">Sub Question Main Title</label>
              <q-input
                v-model="currentSubQuestion.mainTitle"
                outlined
                dense
                placeholder="Sub Question Main Title"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Sub Question Sub Title</label>
              <q-input
                v-model="currentSubQuestion.subTitle"
                outlined
                dense
                placeholder="Sub Question Sub Title"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Question Type</label>
              <div class="question-type-selector">
                <q-btn
                  v-for="type in 7"
                  :key="type"
                  :class="{ active: currentSubQuestion.questionType === type }"
                  :label="String(type)"
                  round
                  outline
                  @click="currentSubQuestion.questionType = type as 1|2|3|4|5|6|7"
                />
                <q-icon name="help" class="help-icon" />
              </div>
            </div>
            <div class="form-group toggle-group highlight-box">
              <label class="form-label">Need Hint</label>
              <q-toggle v-model="currentSubQuestion.needHint" color="primary" />
            </div>
          </div>

          <!-- Step 4-2: Main Question Hint -->
          <div v-if="currentStep === 'mainQuestionHint'" class="step-content">
            <div class="step-subtitle">Main Question → Hint</div>
            <div class="form-group">
              <label class="form-label">Hint Content</label>
              <q-input
                v-model="currentMainQuestion.hintContent"
                type="textarea"
                outlined
                :rows="5"
                placeholder="Enter hint content..."
              />
            </div>
          </div>

          <!-- Step 5: Sub Question Hint -->
          <div v-if="currentStep === 'subQuestionHint'" class="step-content">
            <div class="step-subtitle">Sub Question → Hint</div>
            <div class="form-group">
              <label class="form-label">Hint Content</label>
              <q-input
                v-model="currentSubQuestion.hintContent"
                type="textarea"
                outlined
                :rows="5"
                placeholder="Enter hint content..."
              />
            </div>
          </div>

          <!-- Preview -->
          <div v-if="currentStep === 'preview'" class="step-content">
            <div class="step-subtitle">Pre-review for one Main Question</div>
            <div class="preview-card">
              <div class="preview-question">
                <div class="preview-main-title">{{ currentMainQuestion.mainTitle }}</div>
                <div class="preview-sub-title">{{ currentMainQuestion.subTitle }}</div>

                <div v-if="currentMainQuestion.needSubQuestion" class="preview-sub-question">
                  <div class="preview-main-title">{{ currentSubQuestion.mainTitle }}</div>
                  <div class="preview-sub-title">{{ currentSubQuestion.subTitle }}</div>
                  <q-icon name="lightbulb" class="hint-icon" v-if="currentSubQuestion.needHint" />
                </div>

                <q-input :model-value="''" outlined dense readonly class="preview-input" placeholder="" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 按鈕區 -->
        <q-card-actions class="dialog-actions">
          <!-- Step 1 -->
          <template v-if="currentStep === 'formInfo'">
            <mainBtn label="next" color="primary" filled @click="goToStep('formSection')" />
          </template>

          <!-- Step 2 -->
          <template v-else-if="currentStep === 'formSection'">
            <mainBtn label="back" color="primary" outline @click="goToStep('formInfo')" />
            <mainBtn label="next" color="primary" filled @click="goToStep('mainQuestion')" />
          </template>

          <!-- Step 3 -->
          <template v-else-if="currentStep === 'mainQuestion'">
            <mainBtn label="back" color="primary" outline @click="goToStep('formSection')" />
            <mainBtn label="next" color="primary" filled @click="handleMainQuestionNext" />
          </template>

          <!-- Step 4-1 -->
          <template v-else-if="currentStep === 'subQuestion'">
            <mainBtn label="back" color="primary" outline @click="goToStep('mainQuestion')" />
            <mainBtn label="next" color="primary" filled @click="handleSubQuestionNext" />
          </template>

          <!-- Step 4-2 -->
          <template v-else-if="currentStep === 'mainQuestionHint'">
            <mainBtn label="back" color="primary" outline @click="handleHintBack" />
            <mainBtn label="pre-review" color="primary" filled @click="goToStep('preview')" />
          </template>

          <!-- Step 5 -->
          <template v-else-if="currentStep === 'subQuestionHint'">
            <mainBtn label="back" color="primary" outline @click="goToStep('subQuestion')" />
            <mainBtn label="pre-review" color="primary" filled @click="goToStep('preview')" />
          </template>

          <!-- Preview -->
          <template v-else-if="currentStep === 'preview'">
            <div class="preview-actions">
              <mainBtn label="back" color="primary" outline @click="handlePreviewBack" />
              <div class="preview-action-buttons">
                <mainBtn
                  label="create new sub question"
                  color="secondary"
                  outline
                  @click="createNewSubQuestion"
                  v-if="currentMainQuestion.needSubQuestion"
                />
                <mainBtn
                  label="create new main question"
                  color="secondary"
                  outline
                  @click="createNewMainQuestion"
                />
                <mainBtn
                  label="completed and pre-review form"
                  color="primary"
                  filled
                  @click="completeForm"
                />
              </div>
            </div>
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
import { useFormManagementApi } from '../services/formManagementApi';
import type {
  FormInfo,
  FormSection,
  MainQuestion,
  SubQuestion,
  CreateFormStep,
  QuestionType,
} from '../models/formManagementModel';

// ===== 測試模式開關 =====
const USE_MOCK_DATA = true;

// 假資料
const mockForms: FormInfo[] = [
  {
    id: 1,
    mainTitle: 'Form Main Title',
    subTitle: 'Form Sub Title',
    formType: 'Performance',
    isActive: true,
    sections: [],
  },
  {
    id: 2,
    mainTitle: 'Form Main Title',
    subTitle: 'Form Sub Title',
    formType: 'Feedback',
    isActive: true,
    sections: [],
  },
  {
    id: 3,
    mainTitle: 'Form Main Title',
    subTitle: 'Form Sub Title',
    formType: '360Review',
    isActive: false,
    sections: [],
  },
  {
    id: 4,
    mainTitle: 'Form Main Title',
    subTitle: 'Form Sub Title',
    formType: 'Custom',
    isActive: true,
    sections: [],
  },
];

const { isLoading, getFormTypeOptions } = useFormManagementApi();

// 表單列表
const forms = ref<FormInfo[]>([]);

// Dialog 狀態
const showCreateDialog = ref(false);
const currentStep = ref<CreateFormStep>('formInfo');

// 表單類型選項
const formTypeOptions = getFormTypeOptions();

// 初始化資料
const initialFormState = (): FormInfo => ({
  mainTitle: '',
  subTitle: '',
  formType: '',
  isActive: true,
  sections: [],
});

const initialSectionState = (): FormSection => ({
  sectionTitle: '',
  questions: [],
});

const initialMainQuestionState = (): MainQuestion => ({
  mainTitle: '',
  subTitle: '',
  needSubQuestion: false,
  needHint: false,
  questionType: 1 as QuestionType,
  hintContent: '',
  subQuestions: [],
});

const initialSubQuestionState = (): SubQuestion => ({
  mainTitle: '',
  subTitle: '',
  questionType: 1 as QuestionType,
  needHint: false,
  hintContent: '',
});

// 表單資料
const newForm = reactive<FormInfo>(initialFormState());
const currentSection = reactive<FormSection>(initialSectionState());
const currentMainQuestion = reactive<MainQuestion>(initialMainQuestionState());
const currentSubQuestion = reactive<SubQuestion>(initialSubQuestionState());

// 取得步驟標題
const getStepTitle = (): string => {
  const titles: Record<CreateFormStep, string> = {
    formInfo: 'Form Info',
    formSection: 'Form Section',
    mainQuestion: 'Section → Main Question',
    subQuestion: 'Main Question → Sub Question',
    mainQuestionHint: 'Main Question → Hint',
    subQuestionHint: 'Sub Question → Hint',
    preview: 'Pre-review for one Main Question',
  };
  return titles[currentStep.value];
};

// 載入表單
const loadForms = () => {
  if (USE_MOCK_DATA) {
    forms.value = [...mockForms];
  }
};

// 開啟建立 Dialog
const openCreateDialog = () => {
  Object.assign(newForm, initialFormState());
  Object.assign(currentSection, initialSectionState());
  Object.assign(currentMainQuestion, initialMainQuestionState());
  Object.assign(currentSubQuestion, initialSubQuestionState());
  currentStep.value = 'formInfo';
  showCreateDialog.value = true;
};

// 關閉建立 Dialog
const closeCreateDialog = () => {
  showCreateDialog.value = false;
};

// 切換步驟
const goToStep = (step: CreateFormStep) => {
  currentStep.value = step;
};

// 處理 Main Question Next
const handleMainQuestionNext = () => {
  if (currentMainQuestion.needSubQuestion) {
    goToStep('subQuestion');
  } else if (currentMainQuestion.needHint) {
    goToStep('mainQuestionHint');
  } else {
    goToStep('preview');
  }
};

// 處理 Sub Question Next
const handleSubQuestionNext = () => {
  if (currentSubQuestion.needHint) {
    goToStep('subQuestionHint');
  } else if (currentMainQuestion.needHint) {
    goToStep('mainQuestionHint');
  } else {
    goToStep('preview');
  }
};

// 處理 Hint Back
const handleHintBack = () => {
  if (currentMainQuestion.needSubQuestion) {
    goToStep('subQuestion');
  } else {
    goToStep('mainQuestion');
  }
};

// 處理 Preview Back
const handlePreviewBack = () => {
  if (currentMainQuestion.needHint) {
    goToStep('mainQuestionHint');
  } else if (currentMainQuestion.needSubQuestion && currentSubQuestion.needHint) {
    goToStep('subQuestionHint');
  } else if (currentMainQuestion.needSubQuestion) {
    goToStep('subQuestion');
  } else {
    goToStep('mainQuestion');
  }
};

// 建立新的子問題
const createNewSubQuestion = () => {
  // 儲存當前子問題
  currentMainQuestion.subQuestions.push({ ...currentSubQuestion });
  // 重置子問題
  Object.assign(currentSubQuestion, initialSubQuestionState());
  goToStep('subQuestion');
};

// 建立新的主問題
const createNewMainQuestion = () => {
  // 儲存當前主問題
  if (currentMainQuestion.needSubQuestion && currentSubQuestion.mainTitle) {
    currentMainQuestion.subQuestions.push({ ...currentSubQuestion });
  }
  currentSection.questions.push({ ...currentMainQuestion });
  // 重置
  Object.assign(currentMainQuestion, initialMainQuestionState());
  Object.assign(currentSubQuestion, initialSubQuestionState());
  goToStep('mainQuestion');
};

// 完成表單
const completeForm = () => {
  if (USE_MOCK_DATA) {
    // 儲存當前問題
    if (currentMainQuestion.needSubQuestion && currentSubQuestion.mainTitle) {
      currentMainQuestion.subQuestions.push({ ...currentSubQuestion });
    }
    if (currentMainQuestion.mainTitle) {
      currentSection.questions.push({ ...currentMainQuestion });
    }
    if (currentSection.sectionTitle) {
      newForm.sections.push({ ...currentSection });
    }

    const newId = mockForms.length + 1;
    mockForms.push({
      ...newForm,
      id: newId,
    });
    loadForms();
    closeCreateDialog();
    alert('Mock: Form created successfully!');
  }
};

// 切換表單狀態
const onToggleForm = (form: FormInfo, value: boolean) => {
  if (USE_MOCK_DATA) {
    const target = mockForms.find((f) => f.id === form.id);
    if (target) {
      target.isActive = value;
    }
    loadForms();
  }
};

// 初始化
onMounted(() => {
  loadForms();
});
</script>

<style scoped>
.form-setting-page {
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

/* 表單卡片 */
.form-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-card {
  border: 2px solid #2f3b77;
  border-radius: 12px;
  padding: 20px;
  background: white;
}

.form-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-main-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.form-sub-title {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* Dialog */
.create-dialog {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-body {
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
}

.step-content {
  padding: 10px 0;
}

.step-subtitle {
  font-size: 18px;
  font-weight: 500;
  color: #2f3b77;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  padding: 8px 20px;
  background-color: #e8eaf6;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3b77;
  text-align: center;
  width: fit-content;
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toggle-group .form-label {
  margin-bottom: 0;
}

.highlight-box {
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 10px;
}

/* Question Type Selector */
.question-type-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.question-type-selector .q-btn {
  width: 36px;
  height: 36px;
  min-width: 36px;
}

.question-type-selector .q-btn.active {
  background-color: #2f3b77;
  color: white;
}

.help-icon {
  color: #ffc107;
  font-size: 24px;
}

/* Preview */
.preview-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
}

.preview-question {
  position: relative;
}

.preview-main-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.preview-sub-title {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.preview-sub-question {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 3px solid #2f3b77;
}

.hint-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #ffc107;
  font-size: 24px;
}

.preview-input {
  margin-top: 15px;
}

/* Dialog Actions */
.dialog-actions {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.preview-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}
</style>

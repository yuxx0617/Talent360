<template>
  <div class="management-event-list">
    <!-- 標題與按鈕區 -->
    <div class="header-section">
      <h1 class="page-title">Event List</h1>
      <div class="action-buttons">
        <mainBtn label="create new event" color="primary" filled @click="openCreateDialog" />
      </div>
    </div>

    <!-- 事件卡片列表 -->
    <div class="event-cards">
      <div v-for="(event, index) in events" :key="event.id ?? index" class="event-card">
        <div class="event-card-header">
          <span class="event-name">{{ event.eventName }}</span>
          <span :class="['event-status', `status-${event.status.toLowerCase()}`]">
            {{ event.status }}
          </span>
        </div>
        <div class="event-card-body">
          <table class="event-table">
            <thead>
              <tr>
                <th>Application Period</th>
                <th>Write Form Period</th>
                <th>Review Period</th>
                <th>Whom Review</th>
                <th>Candidate Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ formatDateRange(event.applicationPeriod) }}</td>
                <td>{{ formatDateRange(event.writeFormPeriod) }}</td>
                <td>{{ formatDateRange(event.hrReviewPeriod) }}</td>
                <td>{{ event.whomReview }}</td>
                <td>{{ event.candidateNumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 建立事件 Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="create-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">Event Info</div>
          <q-btn icon="close" flat round dense @click="closeCreateDialog" />
        </q-card-section>

        <q-separator />

        <!-- 第一頁：填寫表單 -->
        <q-card-section v-if="currentStep === 1" class="dialog-body">
          <!-- Event Name -->
          <div class="form-group">
            <label class="form-label">Event Name</label>
            <q-input v-model="newEvent.eventName" outlined dense placeholder="Event Name" />
          </div>

          <!-- Form -->
          <div class="form-group">
            <label class="form-label">Form</label>
            <q-select
              v-model="newEvent.formId"
              :options="formOptions"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="onFormChange"
            />
          </div>

          <!-- Form Name (顯示) -->
          <div class="form-group">
            <label class="form-label">Form Name</label>
            <div class="form-value">{{ newEvent.formName || '-' }}</div>
          </div>

          <!-- Application Period -->
          <div class="form-group">
            <label class="form-label">Application Period</label>
            <div class="date-range">
              <q-input v-model="newEvent.applicationPeriod.start" outlined dense type="date" />
              <span class="date-separator">~</span>
              <q-input v-model="newEvent.applicationPeriod.end" outlined dense type="date" />
            </div>
          </div>

          <!-- Write Form Period -->
          <div class="form-group">
            <label class="form-label">Write Form Period</label>
            <div class="date-range">
              <q-input v-model="newEvent.writeFormPeriod.start" outlined dense type="date" />
              <span class="date-separator">~</span>
              <q-input v-model="newEvent.writeFormPeriod.end" outlined dense type="date" />
            </div>
          </div>

          <!-- HR Review Period -->
          <div class="form-group">
            <label class="form-label">HR Review Period</label>
            <div class="date-range">
              <q-input v-model="newEvent.hrReviewPeriod.start" outlined dense type="date" />
              <span class="date-separator">~</span>
              <q-input v-model="newEvent.hrReviewPeriod.end" outlined dense type="date" />
            </div>
          </div>

          <!-- MainSupervisor Review Period -->
          <div class="form-group">
            <label class="form-label">MainSupervisor Review Period</label>
            <div class="date-range">
              <q-input v-model="newEvent.mainSupervisorReviewPeriod.start" outlined dense type="date" />
              <span class="date-separator">~</span>
              <q-input v-model="newEvent.mainSupervisorReviewPeriod.end" outlined dense type="date" />
            </div>
          </div>
        </q-card-section>

        <!-- 第二頁：預覽 -->
        <q-card-section v-if="currentStep === 2" class="dialog-body">
          <div class="preview-group">
            <label class="preview-label">Event Name</label>
            <div class="preview-value">{{ newEvent.eventName }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">Form</label>
            <div class="preview-value">{{ newEvent.formName }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">Application Period</label>
            <div class="preview-value">{{ formatDateRange(newEvent.applicationPeriod) }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">Write Form Period</label>
            <div class="preview-value">{{ formatDateRange(newEvent.writeFormPeriod) }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">HR Review Period</label>
            <div class="preview-value">{{ formatDateRange(newEvent.hrReviewPeriod) }}</div>
          </div>

          <div class="preview-group">
            <label class="preview-label">MainSupervisor Review Period</label>
            <div class="preview-value">{{ formatDateRange(newEvent.mainSupervisorReviewPeriod) }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 按鈕區 -->
        <q-card-actions align="right" class="dialog-actions">
          <template v-if="currentStep === 1">
            <mainBtn label="next" color="primary" filled @click="goToStep2" />
          </template>
          <template v-else>
            <mainBtn label="back" color="primary" outline @click="goToStep1" />
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
import { useEventManagementApi } from '../services/eventManagementApi';
import type { EventInfo, DateRange } from '../models/eventManagementModel';

// ===== 測試模式開關 =====
const USE_MOCK_DATA = true;

// 假資料
const mockEvents: EventInfo[] = [
  {
    id: 1,
    eventName: 'event name',
    formId: 'form_001',
    formName: 'Performance Review',
    applicationPeriod: { start: '2025/06', end: '2025/08' },
    writeFormPeriod: { start: '2025/06', end: '2025/08' },
    hrReviewPeriod: { start: '2025/06', end: '2025/08' },
    mainSupervisorReviewPeriod: { start: '2025/06', end: '2025/08' },
    status: 'Applying',
    whomReview: 'HR、MainSupervisor',
    candidateNumber: 50,
  },
  {
    id: 2,
    eventName: 'event name',
    formId: 'form_002',
    formName: 'Annual Evaluation',
    applicationPeriod: { start: '2025/06', end: '2025/08' },
    writeFormPeriod: { start: '2025/06', end: '2025/08' },
    hrReviewPeriod: { start: '2025/06', end: '2025/08' },
    mainSupervisorReviewPeriod: { start: '2025/06', end: '2025/08' },
    status: 'Reviewing',
    whomReview: 'HR、MainSupervisor',
    candidateNumber: 50,
  },
];

const { isLoading, getFormOptions, getFormNameById } = useEventManagementApi();

// 事件列表
const events = ref<EventInfo[]>([]);

// Dialog 狀態
const showCreateDialog = ref(false);
const currentStep = ref(1);

// 表單選項
const formOptions = getFormOptions();

// 新事件表單
const initialEventState = () => ({
  eventName: '',
  formId: '',
  formName: '',
  applicationPeriod: { start: '', end: '' },
  writeFormPeriod: { start: '', end: '' },
  hrReviewPeriod: { start: '', end: '' },
  mainSupervisorReviewPeriod: { start: '', end: '' },
});

const newEvent = reactive(initialEventState());

// 格式化日期範圍
const formatDateRange = (range: DateRange): string => {
  if (!range.start || !range.end) return '-';
  return `${range.start} ~ ${range.end}`;
};

// 載入事件
const loadEvents = () => {
  if (USE_MOCK_DATA) {
    events.value = mockEvents;
  }
};

// 開啟建立 Dialog
const openCreateDialog = () => {
  Object.assign(newEvent, initialEventState());
  currentStep.value = 1;
  showCreateDialog.value = true;
};

// 關閉建立 Dialog
const closeCreateDialog = () => {
  showCreateDialog.value = false;
};

// 表單選擇變更
const onFormChange = (formId: string) => {
  newEvent.formName = getFormNameById(formId);
};

// 下一步
const goToStep2 = () => {
  currentStep.value = 2;
};

// 上一步
const goToStep1 = () => {
  currentStep.value = 1;
};

// 建立事件
const onCreate = () => {
  if (USE_MOCK_DATA) {
    const newId = mockEvents.length + 1;
    mockEvents.push({
      id: newId,
      eventName: newEvent.eventName,
      formId: newEvent.formId,
      formName: newEvent.formName,
      applicationPeriod: { ...newEvent.applicationPeriod },
      writeFormPeriod: { ...newEvent.writeFormPeriod },
      hrReviewPeriod: { ...newEvent.hrReviewPeriod },
      mainSupervisorReviewPeriod: { ...newEvent.mainSupervisorReviewPeriod },
      status: 'Draft',
      whomReview: 'HR、MainSupervisor',
      candidateNumber: 0,
    });
    loadEvents();
    closeCreateDialog();
    alert('Mock: Event created successfully');
  }
};

// 初始化
onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.management-event-list {
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

/* 事件卡片 */
.event-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-card {
  border: 2px solid #2f3b77;
  border-radius: 12px;
  overflow: hidden;
}

.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
}

.event-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.event-status {
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
}

.status-applying {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-reviewing {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-draft {
  background-color: #f5f5f5;
  color: #757575;
}

.event-card-body {
  padding: 15px 20px;
}

.event-table {
  width: 100%;
  border-collapse: collapse;
}

.event-table th,
.event-table td {
  padding: 10px;
  text-align: center;
  font-size: 13px;
}

.event-table th {
  color: #666;
  font-weight: 400;
}

.event-table td {
  color: #333;
}

/* Dialog */
.create-dialog {
  min-width: 500px;
  max-width: 600px;
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

.form-value {
  padding: 10px;
  text-align: center;
  color: #333;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-separator {
  color: #666;
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

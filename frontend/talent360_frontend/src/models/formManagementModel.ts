// 表單類型
export type FormType = 'Performance' | 'Feedback' | '360Review' | 'Custom';

// 問題類型 (1-7)
export type QuestionType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// 表單基本資訊
export interface FormInfo {
  id?: number;
  mainTitle: string;
  subTitle: string;
  formType: FormType | '';
  isActive: boolean;
  sections: FormSection[];
}

// 表單區段
export interface FormSection {
  id?: number;
  sectionTitle: string;
  questions: MainQuestion[];
}

// 主問題
export interface MainQuestion {
  id?: number;
  mainTitle: string;
  subTitle: string;
  needSubQuestion: boolean;
  needHint: boolean;
  questionType: QuestionType;
  hintContent: string;
  subQuestions: SubQuestion[];
}

// 子問題
export interface SubQuestion {
  id?: number;
  mainTitle: string;
  subTitle: string;
  questionType: QuestionType;
  needHint: boolean;
  hintContent: string;
}

// 表單類型選項
export interface FormTypeOption {
  label: string;
  value: FormType | '';
}

// API 響應
export interface FormListResponse {
  isSuccess: boolean;
  message: string;
  data: FormInfo[];
}

// 建立表單的步驟
export type CreateFormStep =
  | 'formInfo'           // Step 1: 表單基本資訊
  | 'formSection'        // Step 2: 區段設定
  | 'mainQuestion'       // Step 3: 主問題
  | 'subQuestion'        // Step 4-1: 子問題（如果需要）
  | 'mainQuestionHint'   // Step 4-2: 主問題提示
  | 'subQuestionHint'    // Step 5: 子問題提示
  | 'preview';           // 預覽

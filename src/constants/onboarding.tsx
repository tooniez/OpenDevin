import { I18nKey } from "#/i18n/declaration";

export type OnboardingAppMode = "cloud" | "self-hosted" | "oss";

interface BaseOnboardingQuestion {
  id: string;
  app_mode: OnboardingAppMode[];
  questionKey: I18nKey;
  subtitleKey?: I18nKey;
}

interface InputQuestion extends BaseOnboardingQuestion {
  type: "input";
  inputOptions: { key: I18nKey; id: string }[];
}

interface SingleSelectQuestion extends BaseOnboardingQuestion {
  type: "single";
  answerOptions: { key: I18nKey; id: string }[];
}

interface MultiSelectQuestion extends BaseOnboardingQuestion {
  type: "multi";
  answerOptions: { key: I18nKey; id: string }[];
}

export type OnboardingQuestion =
  | InputQuestion
  | SingleSelectQuestion
  | MultiSelectQuestion;

export const ONBOARDING_FORM: OnboardingQuestion[] = [
  {
    id: "use_case",
    type: "multi",
    app_mode: ["cloud", "self-hosted"],
    questionKey: I18nKey.ONBOARDING$USE_CASE_QUESTION,
    subtitleKey: I18nKey.ONBOARDING$SELECT_MULTIPLE_SUBTITLE,
    answerOptions: [
      { key: I18nKey.ONBOARDING$USE_CASE_NEW_FEATURES, id: "new_features" },
      {
        key: I18nKey.ONBOARDING$USE_CASE_APP_FROM_SCRATCH,
        id: "app_from_scratch",
      },
      { key: I18nKey.ONBOARDING$USE_CASE_FIXING_BUGS, id: "fixing_bugs" },
      { key: I18nKey.ONBOARDING$USE_CASE_REFACTORING, id: "refactoring" },
      {
        key: I18nKey.ONBOARDING$USE_CASE_AUTOMATING_TASKS,
        id: "automating_tasks",
      },
      { key: I18nKey.ONBOARDING$USE_CASE_NOT_SURE, id: "not_sure" },
    ],
  },
  {
    id: "role",
    type: "single",
    app_mode: ["cloud"],
    questionKey: I18nKey.ONBOARDING$ROLE_QUESTION,
    subtitleKey: I18nKey.ONBOARDING$SELECT_ONE_SUBTITLE,
    answerOptions: [
      {
        key: I18nKey.ONBOARDING$ROLE_SOFTWARE_ENGINEER,
        id: "software_engineer",
      },
      {
        key: I18nKey.ONBOARDING$ROLE_ENGINEERING_MANAGER,
        id: "engineering_manager",
      },
      { key: I18nKey.ONBOARDING$ROLE_CTO_FOUNDER, id: "cto_founder" },
      {
        key: I18nKey.ONBOARDING$ROLE_PRODUCT_OPERATIONS,
        id: "product_operations",
      },
      { key: I18nKey.ONBOARDING$ROLE_STUDENT_HOBBYIST, id: "student_hobbyist" },
      { key: I18nKey.ONBOARDING$ROLE_OTHER, id: "other" },
    ],
  },
];

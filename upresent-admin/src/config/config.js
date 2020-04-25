export const toastDuration = 3000;
const environmentVariable = process.env.REACT_APP_ENV;

export const baseUrlUserApi =
  environmentVariable === "prod"
    ? "https://user.upresent.ga/user"
    : "https://dev.upresent.ga/user/user";
export const baseUrlAuthApi =
  environmentVariable === "prod"
    ? "https://user.upresent.ga/auth"
    : "https://dev.upresent.ga/user/auth";
export const baseUrlFenceApi =
  environmentVariable === "prod"
    ? "https://management.upresent.ga/manage/geo-fence"
    : "https://dev.upresent.ga/management/manage/geo-fence";
export const baseUrlModuleApi =
  environmentVariable === "prod"
    ? "https://management.upresent.ga/manage/module"
    : "https://dev.upresent.ga/management/manage/module";
export const baseUrlReportingApi =
  environmentVariable === "prod"
    ? "https://reporting.upresent.ga/attendance"
    : "https://dev.upresent.ga/reporting/attendance";

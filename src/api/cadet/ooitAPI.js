import { axiosInstance as axios } from "@/main"

class ooitAPI {
  async monitoring_data_export_in_file(monitoringDateTime) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/monitoring-data-export-in-file/?monitoringDateTime=${monitoringDateTime}`,
      { responseType: "blob" },
    )
  }

  async entrance_applications_journal(
    speciality,
    subdivision,
    journalDateFrom,
    journalDateTill,
  ) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/entrance-applications-journal/?speciality=${speciality}&subdivision=${subdivision}&journalDateFrom=${journalDateFrom}&journalDateTill=${journalDateTill}`,
      { responseType: "blob" },
    )
  }
  async getSubmissionData() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/applications-submission-data/`,
      { responseType: "blob" },
    )
  }
  async makeEnrollment() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/enrollment/`,
      { responseType: "blob" },
    )
  }

  async makeEnrollmentABC() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/enrollment-abc/`,
      { responseType: "blob" },
    )
  }

  async makeEnrollmentScore() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/enrollment-score/`,
      { responseType: "blob" },
    )
  }

  async makeEnrollmentReserve() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/enrollment-reserve/`,
      { responseType: "blob" },
    )
  }
}

export default function getOOITAPIInstance() {
  return new ooitAPI()
}

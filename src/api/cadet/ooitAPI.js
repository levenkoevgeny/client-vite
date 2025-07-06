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
    journalDateFrom,
    journalDateTill,
  ) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/entrance-applications-journal/?speciality=${speciality}&journalDateFrom=${journalDateFrom}&journalDateTill=${journalDateTill}`,
      { responseType: "blob" },
    )
  }
}

export default function getOOITAPIInstance() {
  return new ooitAPI()
}

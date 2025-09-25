import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class FavoriteCadetsAPI extends BaseAPI {
  async get_favorite_cadets_for_current_user() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_favorite_cadets_for_current_user/`,
    )
  }

  async add_or_delete_from_favorites(favoriteData) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/add_or_delete_from_favorites/`,
      favoriteData,
    )
  }
}

export default function getFavoriteCadetsAPIInstance() {
  return new FavoriteCadetsAPI(
    "favorite-cadets",
    {
      cadet: "",
      user: "",
    },
    { cadet: "", user: "" },
  )
}

import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "axios";

export const useProfileStore = defineStore("profile", () => {
  const config = useRuntimeConfig();
  const profile = ref(null);
  const apiUrl = config.public.apiUrl;

  async function getProfile(id, accessCode) {
    return axios
      .get(`${apiUrl}/profile/${id}?accessCode=${accessCode}`)
      .then((response) => {
        profile.value = response.data;
      });
  }

  async function createProfile(name, locale) {
    return axios.post(`${apiUrl}/profile`, {
      name,
      locale,
    });
  }

  async function updateProfile(accessCode) {
    return axios.put(
      `${apiUrl}/profile/${profile.value.id}?accessCode=${accessCode}`,
      {
        ...profile.value,
      },
    );
  }

  return {
    createProfile,
    getProfile,
    updateProfile,
    profile,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot));
}

// src/stores/user.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    account: '',
    name: '',
    email: '',
    token: '',
    refresh: '',
    avatar: '',
    description: '',
    is_active: false,
    is_staff: false,
    is_superuser: false,
    is_logged_in: false,
    // 其他用户信息字段
  })
  const selectPatientId = ref(null)
  const selectedReport = ref(null)

  return { user , selectPatientId  , selectedReport }
})

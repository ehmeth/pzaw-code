import { ref, computed } from 'vue'
import { makeRequest } from '@/helpers/fetchWrapper.js'

const username = ref('')
const error = ref('')
const isLoggedIn = computed(() => username.value !== '')

function login(user, pass) {
  return makeRequest.post('polls/api/auth/login', { username: user, password: pass }).then(
    (_data) => {
      username.value = user
    },
    (apiError) => {
      error.value = apiError
    },
  )
}

function register(user, pass) {
  makeRequest.post('polls/api/auth/register', { username: user, password: pass }).then(
    (_data) => {
      username.value = user
    },
    (apiError) => {
      error.value = apiError
    },
  )
}

function logout() {
  makeRequest.post('polls/api/auth/logout').then((_data) => {
    username.value = ''
  })
}

export const useAuthStore = function () {
  return {
    username: username,
    isLoggedIn: isLoggedIn,
    error: error,
    register: register,
    login: login,
    logout: logout,
  }
}

async function getUserData() {
  let data = await makeRequest.get('polls/api/auth/status')
  if (data.authenticated) {
    username.value = data.username
  }
}

getUserData()

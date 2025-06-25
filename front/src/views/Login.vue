<template>
  <div class="page page-center d-flex flex-column">
    <div class="container-tight py-4">
      <!-- <div class="text-center mb-4">
        <a href="#" class="navbar-brand navbar-brand-autodark">Logo</a>
      </div> -->

      <form class="card card-md" @submit.prevent="handleSubmit">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Login to your account</h2>

          <div class="mb-3">
            <label class="form-label">Username</label>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              placeholder="Enter username"
              required
            />
          </div>

          <div class="mb-2">
            <label class="form-label">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
            />
            <!-- <span class="form-label-description mb-4">
              <a href="#">I forgot password</a>
            </span> -->
          </div>

          <!-- <div class="mb-3">
            <label class="form-check">
              <input
                v-model="form.remember"
                type="checkbox"
                class="form-check-input"
              />
              <span class="form-check-label">Remember me</span>
            </label>
          </div> -->

          <!-- CAPTCHA shown only after 3 failed attempts -->
          <div class="mb-3" v-if="captchaEnabled">
            <VueRecaptcha
              ref="recaptcha"
              :sitekey="recaptchaSiteKey"
              @verify="onCaptchaVerified"
              @expired="onCaptchaExpired"
            />
          </div>

          <div class="form-footer">
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
// @ts-ignore
import VueRecaptcha from 'vue3-recaptcha2';

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const loading = ref(false)

const recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const failedAttempts = ref(0)
const captchaToken = ref('')
const recaptcha = ref<InstanceType<typeof VueRecaptcha> | null>(null)

const captchaEnabled = computed(() => failedAttempts.value >= 3)

// Redirect if already logged in
onMounted(() => {
  if (auth.isLoggedIn) {
    router.push('/dashboard')
  }
})

const onCaptchaVerified = (token: string) => {
  captchaToken.value = token
}

const onCaptchaExpired = () => {
  captchaToken.value = ''
  recaptcha.value?.reset()
}

const handleSubmit = async () => {
  if (captchaEnabled.value && !captchaToken.value) {
    alert('Please complete the CAPTCHA')
    return
  }

  loading.value = true
  try {
    await auth.login(form.username, form.password, captchaToken.value)
    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect as string || '/dashboard'
    router.push(redirectTo)
  } catch (error: any) {
    failedAttempts.value += 1
    if (captchaEnabled.value) {
      recaptcha.value?.reset()
      captchaToken.value = ''
    }
    alert(error?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>

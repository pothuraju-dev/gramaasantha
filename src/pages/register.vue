<script setup lang="ts">
import { register } from '@/utils/supaAuth'

const formData = ref({
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const router = useRouter()

const signup = async () => {
  const isRegistered = await register(formData.value)
  if (isRegistered) router.push('/')
}
</script>

<template>
  <div
    class="mx-auto w-full flex justify-center items-center p-10 text-center -mt-10 min-h-[90vh] h-full"
  >
    <Card class="max-w-sm w-full mx-auto h-full">
      <CardHeader>
        <CardTitle class="text-2xl"> Register </CardTitle>
        <CardDescription> Create a new account </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <Button variant="outline" class="w-full"> Register with Google </Button>
          <Separator label="Or" />
        </div>
        <form class="grid gap-4" @submit.prevent="signup">
          <div class="grid gap-2">
            <Label id="username" class="text-left">Username</Label>
            <Input
              id="username"
              v-model="formData.userName"
              type="text"
              placeholder="johndoe19"
              required
            />
          </div>
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div class="grid gap-2">
              <Label id="first_name" class="text-left">First Name</Label>
              <Input
                id="first_name"
                v-model="formData.firstName"
                type="text"
                placeholder="John"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label id="last_name" class="text-left">Last Name</Label>
              <Input
                id="last_name"
                v-model="formData.lastName"
                type="text"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div class="grid gap-2">
            <Label id="email" class="text-left">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="johndoe19@example.com"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label id="password" class="text-left">Password</Label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="*****"
              autocomplete
              required
            />
          </div>

          <div class="grid gap-2">
            <Label id="confirm_password" class="text-left">Confirm Password</Label>
            <Input
              id="confirm_password"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="*****"
              autocomplete
              required
            />
          </div>
          <Button type="submit" class="w-full"> Register </Button>
          <!-- <Button variant="outline" class="w-full"> Login with Google </Button> -->
        </form>
        <div class="mt-4 text-sm text-center">
          Already have an account?
          <RouterLink to="/login" class="underline"> Login </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

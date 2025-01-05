import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set) => ({
  //check if user is authenticated
  authUser: null,
  //starts to check if user is authenticated
  isSigninUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")

      set({ authUser: res.data })
    } catch (error) {
      set({ authUser: null })
      console.error(error)
    } finally {
      set({ isCheckingAuth: false })
    }
  },
}))

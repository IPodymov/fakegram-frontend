import { type AppDispatch } from "../index";
import { authApi } from "../../api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} from "../slices/authSlice";
import type { LoginDto, RegisterDto } from "../../types";

export const loginThunk =
  (credentials: LoginDto) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());
      const response = await authApi.login(credentials);
      dispatch(
        loginSuccess({ user: response.user, token: response.access_token })
      );
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

export const registerThunk =
  (userData: RegisterDto) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerStart());
      const response = await authApi.register(userData);
      dispatch(registerSuccess(response.user));
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      dispatch(registerFailure(errorMessage));
      throw error;
    }
  };

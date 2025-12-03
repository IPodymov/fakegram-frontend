import { type AppDispatch, type RootState } from "../index";
import { usersApi } from "../../api";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  searchUsersStart,
  searchUsersSuccess,
  searchUsersFailure,
} from "../slices/usersSlice";
import { loginSuccess } from "../slices/authSlice";
import type { User } from "../../types";

export const fetchUsersThunk = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchUsersStart());
    const users = await usersApi.getAll();
    dispatch(fetchUsersSuccess(users));
    return users;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    dispatch(fetchUsersFailure(errorMessage));
    throw error;
  }
};

export const fetchUserByIdThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchUserStart());
      const user = await usersApi.getById(id);
      dispatch(fetchUserSuccess(user));
      return user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user";
      dispatch(fetchUserFailure(errorMessage));
      throw error;
    }
  };

export const fetchUserByUsernameThunk =
  (username: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchUserStart());
      const user = await usersApi.getByUsername(username);
      dispatch(fetchUserSuccess(user));
      return user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user";
      dispatch(fetchUserFailure(errorMessage));
      throw error;
    }
  };

export const updateUserThunk =
  (id: string, userData: Partial<User>) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(updateUserStart());
      const user = await usersApi.update(id, userData);
      dispatch(updateUserSuccess(user));
      
      // Если обновляется текущий пользователь, обновляем auth state и localStorage
      const currentUser = getState().auth.user;
      if (currentUser && currentUser.id === id) {
        const token = getState().auth.token;
        if (token) {
          dispatch(loginSuccess({ user, token }));
        }
      }
      
      return user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      dispatch(updateUserFailure(errorMessage));
      throw error;
    }
  };

export const deleteUserThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteUserStart());
      await usersApi.delete(id);
      dispatch(deleteUserSuccess(id));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user";
      dispatch(deleteUserFailure(errorMessage));
      throw error;
    }
  };

export const searchUsersThunk =
  (query: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(searchUsersStart());
      const users = await usersApi.search(query);
      dispatch(searchUsersSuccess(users));
      return users;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to search users";
      dispatch(searchUsersFailure(errorMessage));
      throw error;
    }
  };

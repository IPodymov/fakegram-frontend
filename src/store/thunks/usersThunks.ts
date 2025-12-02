import { type AppDispatch } from "../index";
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
} from "../slices/usersSlice";
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
  (id: string, userData: Partial<User>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(updateUserStart());
      const user = await usersApi.update(id, userData);
      dispatch(updateUserSuccess(user));
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

import { type AppDispatch } from "../index";
import { storiesApi } from "../../api";
import {
  fetchStoriesStart,
  fetchStoriesSuccess,
  fetchStoriesFailure,
  fetchStoryStart,
  fetchStorySuccess,
  fetchStoryFailure,
  createStoryStart,
  createStorySuccess,
  createStoryFailure,
  deleteStoryStart,
  deleteStorySuccess,
  deleteStoryFailure,
} from '../slices/storiesSlice';

export const fetchStoriesThunk = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchStoriesStart());
    const stories = await storiesApi.getAll();
    dispatch(fetchStoriesSuccess(stories));
    return stories;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch stories";
    dispatch(fetchStoriesFailure(errorMessage));
    throw error;
  }
};

export const fetchStoryByIdThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchStoryStart());
      const story = await storiesApi.getById(id);
      dispatch(fetchStorySuccess(story));
      return story;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch story";
      dispatch(fetchStoryFailure(errorMessage));
      throw error;
    }
  };

export const fetchStoriesByUserIdThunk =
  (userId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchStoriesStart());
      const stories = await storiesApi.getByUserId(userId);
      dispatch(fetchStoriesSuccess(stories));
      return stories;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user stories";
      dispatch(fetchStoriesFailure(errorMessage));
      throw error;
    }
  };

export const createStoryThunk =
  (storyData: { content: string; mediaUrl?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(createStoryStart());
      const story = await storiesApi.create(storyData);
      dispatch(createStorySuccess(story));
      return story;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create story";
      dispatch(createStoryFailure(errorMessage));
      throw error;
    }
  };

export const deleteStoryThunk =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteStoryStart());
      await storiesApi.delete(id);
      dispatch(deleteStorySuccess(id));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete story";
      dispatch(deleteStoryFailure(errorMessage));
      throw error;
    }
  };

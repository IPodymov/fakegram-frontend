import { type AppDispatch } from '../index';
import { postsApi } from '../../api';
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
} from '../slices/postsSlice';
import type { Post } from '../../types';

export const fetchPostsThunk = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPostsStart());
    const posts = await postsApi.getAll();
    dispatch(fetchPostsSuccess(posts));
    return posts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    dispatch(fetchPostsFailure(errorMessage));
    throw error;
  }
};

export const fetchPostByIdThunk = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPostStart());
    const post = await postsApi.getById(id);
    dispatch(fetchPostSuccess(post));
    return post;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
    dispatch(fetchPostFailure(errorMessage));
    throw error;
  }
};

export const fetchPostsByUserIdThunk = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPostsStart());
    const posts = await postsApi.getByUserId(userId);
    dispatch(fetchPostsSuccess(posts));
    return posts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user posts';
    dispatch(fetchPostsFailure(errorMessage));
    throw error;
  }
};

export const createPostThunk = (postData: Partial<Post>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(createPostStart());
    const post = await postsApi.create(postData);
    dispatch(createPostSuccess(post));
    return post;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
    dispatch(createPostFailure(errorMessage));
    throw error;
  }
};

export const updatePostThunk = (id: string, postData: Partial<Post>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updatePostStart());
    const post = await postsApi.update(id, postData);
    dispatch(updatePostSuccess(post));
    return post;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
    dispatch(updatePostFailure(errorMessage));
    throw error;
  }
};

export const deletePostThunk = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(deletePostStart());
    await postsApi.delete(id);
    dispatch(deletePostSuccess(id));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
    dispatch(deletePostFailure(errorMessage));
    throw error;
  }
};

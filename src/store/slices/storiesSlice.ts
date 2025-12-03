import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Story } from '../../types';

interface StoriesState {
  stories: Story[];
  currentStory: Story | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoriesState = {
  stories: [],
  currentStory: null,
  loading: false,
  error: null,
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    // Fetch all stories
    fetchStoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStoriesSuccess: (state, action: PayloadAction<Story[]>) => {
      state.loading = false;
      state.stories = action.payload;
    },
    fetchStoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single story
    fetchStoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStorySuccess: (state, action: PayloadAction<Story>) => {
      state.loading = false;
      state.currentStory = action.payload;
    },
    fetchStoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create story
    createStoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createStorySuccess: (state, action: PayloadAction<Story>) => {
      state.loading = false;
      state.stories = [action.payload, ...state.stories];
    },
    createStoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete story
    deleteStoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteStorySuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.stories = state.stories.filter((story) => story.id !== action.payload);
    },
    deleteStoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearStoryError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearStoryError,
} = storiesSlice.actions;

export default storiesSlice.reducer;

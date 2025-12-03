export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  website: string | null;
  isPrivate: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  mediaUrl?: string | null;
  createdAt: string;
  user?: User;
  comments?: Comment[];
  likes?: Like[];
}

export interface Story {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  isVideo?: boolean;
  createdAt: string;
  expiresAt: string;
  viewersCount?: number;
  user?: User;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: User;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

export interface StoriesState {
  stories: Story[];
  currentStory: Story | null;
  loading: boolean;
  error: string | null;
}

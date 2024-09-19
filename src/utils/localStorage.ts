const POSTS_STORAGE_KEY = 'movie_talks_posts';

export interface Post {
  id: number;
  user: string;
  content: string;
  timestamp: string;
}

export const getPosts = (): Post[] => {
  if (typeof window !== 'undefined') {
    const posts = localStorage.getItem(POSTS_STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
  }
  return [];
};

export const savePosts = (posts: Post[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }
};

export const addPost = (post: Omit<Post, 'id'>): Post => {
  const posts = getPosts();
  const newPost = { ...post, id: Date.now() };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
};
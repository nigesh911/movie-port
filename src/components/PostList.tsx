import React from 'react';

interface Post {
  _id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post._id} className="bg-card-bg p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-accent">{post.user}</span>
            <span className="text-secondary text-sm">{new Date(post.timestamp).toLocaleString()}</span>
          </div>
          <p className="text-foreground">{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
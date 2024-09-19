import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

const ProfileSection: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [username, setUsername] = useState(user?.nickname || '');
  const [shareableLink, setShareableLink] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/updateUsername', { username });
      console.log('Username updated:', response.data.username);
      // TODO: Update global state or context with new username
    } catch (error) {
      console.error('Failed to update username:', error);
    }
  };

  const generateShareableLink = async () => {
    try {
      const response = await axios.get('/api/generateShareableLink');
      const baseUrl = window.location.origin;
      setShareableLink(`${baseUrl}/shared-watchlist/${response.data.shareableId}`);
    } catch (error) {
      console.error('Failed to generate shareable link:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Shareable link copied to clipboard!');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-section">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button type="submit">Update Username</button>
      </form>
      <button onClick={generateShareableLink}>Generate Shareable Link</button>
      {shareableLink && (
        <div>
          <input type="text" value={shareableLink} readOnly />
          <button onClick={copyToClipboard}>Copy Link</button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './BulletinBoard.css';

const BulletinBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 投稿をリアルタイムで取得
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content: newPost.trim(),
        author: user.email,
        authorId: user.uid,
        timestamp: serverTimestamp()
      });
      setNewPost('');
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('ja-JP');
  };

  return (
    <div className="bulletin-board">
      <header className="board-header">
        <h1>掲示板</h1>
        <div className="user-info">
          <span>ようこそ、{user?.email}さん</span>
          <div className="header-buttons">
            <button onClick={handleProfileClick} className="profile-btn">
              📝 プロフィール
            </button>
            <button onClick={handleSignOut} className="logout-btn">
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="board-container">
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="投稿内容を入力してください..."
            className="post-input"
            rows="4"
            maxLength="500"
          />
          <div className="post-form-footer">
            <span className="char-count">{newPost.length}/500</span>
            <button 
              type="submit" 
              disabled={loading || !newPost.trim()}
              className="post-btn"
            >
              {loading ? '投稿中...' : '投稿'}
            </button>
          </div>
        </form>

        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>まだ投稿がありません</p>
              <p>最初の投稿をしてみましょう！</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <span className="post-author">{post.author}</span>
                  <span className="post-date">{formatDate(post.timestamp)}</span>
                </div>
                <div className="post-content">
                  {post.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BulletinBoard;

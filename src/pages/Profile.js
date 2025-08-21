import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { updateProfile, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    joinDate: null
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // ユーザーの投稿を取得
      const q = query(
        collection(db, 'posts'),
        where('authorId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserPosts(posts);
        setStats({
          totalPosts: posts.length,
          totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
          joinDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : null
        });
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) return;

    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: displayName.trim()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      alert('プロフィールの更新に失敗しました');
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

  const handleBackToBoard = () => {
    navigate('/dashboard');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('ja-JP');
  };

  const formatJoinDate = (date) => {
    if (!date) return '不明';
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>個人ページ</h1>
        <div className="header-buttons">
          <button onClick={handleBackToBoard} className="back-btn">
            📋 掲示板に戻る
          </button>
          <button onClick={handleSignOut} className="logout-btn">
            ログアウト
          </button>
        </div>
      </header>

      <div className="profile-container">
        {/* プロフィール情報セクション */}
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            </div>
            
            <div className="profile-info">
              <div className="profile-name-section">
                {isEditing ? (
                  <div className="edit-name">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="表示名を入力"
                      className="name-input"
                      maxLength="20"
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={loading || !displayName.trim()}
                        className="save-btn"
                      >
                        {loading ? '保存中...' : '保存'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(user?.displayName || '');
                        }}
                        className="cancel-btn"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-name">
                    <h2>{user?.displayName || '表示名未設定'}</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="edit-btn"
                    >
                      編集
                    </button>
                  </div>
                )}
              </div>
              
              <p className="user-email">{user?.email}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.totalPosts}</span>
                  <span className="stat-label">投稿数</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.totalLikes}</span>
                  <span className="stat-label">いいね数</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{formatJoinDate(stats.joinDate)}</span>
                  <span className="stat-label">登録日</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 投稿履歴セクション */}
        <section className="profile-section">
          <h3>投稿履歴</h3>
          <div className="posts-history">
            {userPosts.length === 0 ? (
              <div className="no-posts">
                <p>まだ投稿がありません</p>
                <p>掲示板で最初の投稿をしてみましょう！</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="post-item">
                  <div className="post-header">
                    <span className="post-date">{formatDate(post.timestamp)}</span>
                    <span className="post-likes">❤️ {post.likes || 0}</span>
                  </div>
                  <div className="post-content">
                    {post.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 設定セクション */}
        <section className="profile-section">
          <h3>アカウント設定</h3>
          <div className="settings-card">
            <div className="setting-item">
              <span className="setting-label">メールアドレス</span>
              <span className="setting-value">{user?.email}</span>
            </div>
            <div className="setting-item">
              <span className="setting-label">アカウント作成日</span>
              <span className="setting-value">{formatJoinDate(stats.joinDate)}</span>
            </div>
            <div className="setting-item">
              <span className="setting-label">最終ログイン</span>
              <span className="setting-value">
                {user?.metadata?.lastSignInTime ? 
                  new Date(user.metadata.lastSignInTime).toLocaleString('ja-JP') : 
                  '不明'
                }
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;

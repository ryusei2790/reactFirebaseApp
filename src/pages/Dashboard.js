import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.08)', padding: 32, width: '100%', maxWidth: 560 }}>
        <h2 style={{ marginTop: 0 }}>ダッシュボード</h2>
        <p style={{ color: '#555' }}>ログイン中: <strong>{user?.email || '不明なユーザー'}</strong></p>
        <div style={{ height: 1, background: '#eee', margin: '16px 0 24px' }} />
        <p style={{ marginBottom: 16 }}>ここに会員限定のコンテンツを配置できます。</p>
        <button onClick={handleSignOut} style={{ padding: '10px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>ログアウト</button>
      </div>
    </div>
  );
};

export default Dashboard;

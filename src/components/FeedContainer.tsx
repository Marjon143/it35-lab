import { useState, useEffect } from 'react';
import {
  IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard,
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonText, IonAvatar, IonRow, IonCol, IonAlert
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

// Inline CSS-in-JS styles
const styles = {
  createPostCard: {
    margin: '16px',
  },
  createPostCardHeader: {
    backgroundColor: '#f4f4f4',
    padding: '12px',
  },
  createPostCardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  postCard: {
    margin: '12px 0',
    padding: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  postCardHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  postCardHeaderRow: {
    alignItems: 'center',
  },
  postCardAvatar: {
    marginRight: '12px',
  },
  postCardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  postCardSubtitle: {
    fontSize: '12px',
    color: '#888',
  },
  postsContainer: {
    marginTop: '16px',
  },
  buttonClear: {
    fontSize: '14px',
    padding: '6px 12px',
  },
  cardContentText: {
    fontSize: '16px',
    color: '#333',
  },
};

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      console.log("Auth Data:", authData); // Debug log to check the fetched auth data
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id, user_avatar_url: userData.avatar_url });
          setUsername(userData.username);
        }
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data as Post[]);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    console.log("Post Content:", postContent);  // Log post content for debugging
    console.log("User:", user);  // Log user object
    console.log("Username:", username);  // Log username

    if (!postContent || !user || !username) {
      console.log("Missing data for creating post.");
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ post_content: postContent, user_id: user.id, username }])
      .select('*');

    if (error) {
      console.error("Error creating post:", error);
    } else {
      console.log("Post created:", data);  // Log the response from Supabase
      setPosts(prevPosts => [data[0] as Post, ...prevPosts]);  // Add the new post at the beginning
      setPostContent('');
    }
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;

    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Posts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {user ? (
            <>
              <IonCard style={styles.createPostCard}>
                <IonCardHeader style={styles.createPostCardHeader}>
                  <IonCardTitle style={styles.createPostCardTitle}>Create Post</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonInput 
                    value={postContent} 
                    onIonChange={e => setPostContent(e.detail.value!)} 
                    placeholder="Write a post..." 
                    clearInput
                  />
                  <IonButton expand="full" onClick={createPost}>Post</IonButton>
                </IonCardContent>
              </IonCard>

              <IonRow style={styles.postsContainer}>
                {posts.map(post => (
                  <IonCol size="12" sizeMd="6" key={post.post_id}>
                    <IonCard style={styles.postCard}>
                      <IonCardHeader style={styles.postCardHeader}>
                        <IonRow style={styles.postCardHeaderRow}>
                          <IonCol size="auto">
                            <IonAvatar style={styles.postCardAvatar}>
                              <img src={post.avatar_url || '/assets/default-avatar.png'} alt="User Avatar" />
                            </IonAvatar>
                          </IonCol>
                          <IonCol>
                            <IonCardTitle style={styles.postCardTitle}>{post.username}</IonCardTitle>
                            <IonCardSubtitle style={styles.postCardSubtitle}>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                          </IonCol>
                        </IonRow>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonText color="secondary">
                          <h1 style={styles.cardContentText}>{post.post_content}</h1>
                        </IonText>
                      </IonCardContent>
                      <IonFooter>
                        <IonButton fill="clear" onClick={() => startEditingPost(post)}>Edit</IonButton>
                        <IonButton fill="clear" color="danger" onClick={() => deletePost(post.post_id)}>Delete</IonButton>
                      </IonFooter>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </>
          ) : (
            <IonLabel>Loading...</IonLabel>
          )}
        </IonContent>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput value={postContent} onIonChange={e => setPostContent(e.detail.value!)} placeholder="Edit your post..." />
          </IonContent>
          <IonFooter>
            <IonButton onClick={savePost}>Save</IonButton>
            <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
          </IonFooter>
        </IonModal>

        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setIsAlertOpen(false)}
          header="Success"
          message="Post updated successfully!"
          buttons={['OK']}
        />
      </IonPage>
    </IonApp>
  );
};

export default FeedContainer;

import { useState, useEffect } from 'react';
import {
  IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard,
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonText, IonAvatar, IonRow, IonCol, IonAlert
} from '@ionic/react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

interface ExtendedUser extends SupabaseUser {
  user_avatar_url?: string;
}

interface Post {
  post_id: string;
  user_id: string;
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
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;

      if (authUser?.email?.endsWith('@nbsc.edu.ph')) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authUser.email)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        }

        if (userData) {
          const extendedUser: ExtendedUser = {
            ...authUser,
            id: userData.user_id,
            user_avatar_url: userData.user_avatar_url || '/assets/default-avatar.png'
          };
          setUser(extendedUser);
          setUsername(userData.username);
        }
      } else {
        console.error('User does not have a valid email domain');
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('post_created_at', { ascending: false });

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
    if (!postContent.trim()) {
      console.log("Post content is empty.");
      return;
    }

    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const currentUsername = username || 'Unknown User';
    const avatar = user.user_avatar_url || '/assets/default-avatar.png';

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        post_content: postContent,
        user_id: user.id,
        username: currentUsername,
        avatar_url: avatar,
      }])
      .select('*');

    if (error) {
      console.error("Error creating post:", error.message);
    } else if (data && data.length > 0) {
      setPosts(prevPosts => [data[0] as Post, ...prevPosts]);
      setPostContent('');
      console.log("Post created successfully!");
    }
  };

  const deletePost = async (post_id: string) => {
    const { error } = await supabase.from('posts').delete().match({ post_id });

    if (error) {
      console.error("Error deleting post:", error.message);
    } else {
      setPosts(posts.filter(post => post.post_id !== post_id));
      console.log("Post deleted successfully.");
    }
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent.trim() || !editingPost) {
      console.warn("Post content is empty or no post selected for editing.");
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        post_content: postContent,
        post_updated_at: new Date().toISOString()
      })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (!error && data && data.length > 0) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => post.post_id === updatedPost.post_id ? updatedPost : post));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
      console.log("Post updated successfully.");
    } else {
      console.error("Error updating post:", error?.message);
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
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Create Post</IonCardTitle>
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

              <IonRow>
                {posts.map(post => (
                  <IonCol size="12" key={post.post_id}>
                    <IonCard>
                      <IonCardHeader>
                        <IonRow>
                          <IonCol size="auto">
                            <IonAvatar>
                              <img src={post.avatar_url || '/assets/default-avatar.png'} alt="User Avatar" />
                            </IonAvatar>
                          </IonCol>
                          <IonCol>
                            <IonCardTitle>{post.username}</IonCardTitle>
                            <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                          </IonCol>
                        </IonRow>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonText color="secondary">
                          <h1>{post.post_content}</h1>
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

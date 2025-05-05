// FeedContainer.tsx (Journal App with core features)
import { useState, useEffect } from 'react';
import {
  IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonLabel,
  IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonText, IonAvatar, IonRow, IonCol, IonAlert, IonInput, IonSelect,
  IonSelectOption
} from '@ionic/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  tags?: string[];
  mood?: string;
  prompt?: string;
  media_url?: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  
        if (error) console.error("Error fetching user data:", error);
  
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
      if (!user) return;
  
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id) // Filter posts by the logged-in user's ID
        .order('post_created_at', { ascending: false });
  
      if (error) console.error('Error fetching posts:', error);
      else setPosts(data as Post[]);
    };
  
    fetchUser();
    fetchPosts();
  }, [user]); // Ensure to re-fetch posts when user data changes
  

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(`journal/${Date.now()}-${file.name}`, file);

    if (error) console.error('Upload error:', error.message);
    else {
      const url = supabase.storage.from('media').getPublicUrl(data.path).data.publicUrl;
      setMediaUrl(url);
    }
  };

  const createPost = async () => {
    if (!postContent.trim()) return;
    if (!user) return;

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        post_content: postContent,
        user_id: user.id,
        username: username || 'Unknown User',
        avatar_url: user.user_avatar_url || '/assets/default-avatar.png',
        tags,
        mood,
        prompt,
        media_url: mediaUrl
      }])
      .select('*');

    if (!error && data && data.length > 0) {
      setPosts(prev => [data[0] as Post, ...prev]);
      setPostContent(''); setTags([]); setMood(''); setPrompt(''); setMediaUrl(null);
    } else {
      console.error("Error creating post:", error?.message);
    }
  };

  const deletePost = async (post_id: string) => {
    const { error } = await supabase.from('posts').delete().match({ post_id });
    if (!error) setPosts(posts.filter(p => p.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent.trim() || !editingPost) return;

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
      setPosts(posts.map(p => p.post_id === updatedPost.post_id ? updatedPost : p));
      setPostContent(''); setEditingPost(null); setIsModalOpen(false); setIsAlertOpen(true);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.post_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>My Journal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {user ? (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Create Entry</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <ReactQuill value={postContent} onChange={setPostContent} />
                  <IonInput placeholder="Tags (comma-separated)" onIonChange={e => setTags(e.detail.value?.split(',').map(t => t.trim()) || [])} />
                  <IonInput placeholder="Mood (e.g., Happy, Anxious)" onIonChange={e => setMood(e.detail.value!)} />
                  <IonSelect placeholder="Choose a Prompt" onIonChange={e => setPrompt(e.detail.value)}>
                    <IonSelectOption value="">No Prompt</IonSelectOption>
                    <IonSelectOption value="What made you smile today?">What made you smile today?</IonSelectOption>
                    <IonSelectOption value="What did you learn today?">What did you learn today?</IonSelectOption>
                  </IonSelect>
                  <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} />
                  <IonButton expand="full" onClick={createPost}>Post</IonButton>
                </IonCardContent>
              </IonCard>

              <IonInput placeholder="Search posts..." onIonChange={e => setSearchTerm(e.detail.value!)} />

              <IonRow>
                {filteredPosts.map(post => (
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
                        <IonText color="secondary"><div dangerouslySetInnerHTML={{ __html: post.post_content }} /></IonText>
                        {post.media_url && <img src={post.media_url} alt="media" style={{ width: '100%', marginTop: '1em' }} />}
                        <p><strong>Mood:</strong> {post.mood}</p>
                        <p><strong>Tags:</strong> {post.tags?.join(', ')}</p>
                        {post.prompt && <p><strong>Prompt:</strong> {post.prompt}</p>}
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
          <IonHeader><IonToolbar><IonTitle>Edit Entry</IonTitle></IonToolbar></IonHeader>
          <IonContent>
            <ReactQuill value={postContent} onChange={setPostContent} />
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

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonTextarea,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonLoading,
  useIonToast,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { add, camera, image, mic, happy } from "ionicons/icons";
import { supabase } from '../utils/supabaseClient';

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [presentToast] = useIonToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("post_created_at", { ascending: false });

    if (error) {
      presentToast({ message: "Error loading posts", duration: 2000, color: "danger" });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const createPost = async () => {
    if (!postContent.trim()) return;

    const { data, error } = await supabase
      .from("posts")
      .insert([{ post_content: postContent }])
      .select();

    if (error) {
      presentToast({ message: "Failed to create post", duration: 2000, color: "danger" });
    } else {
      presentToast({ message: "Post created!", duration: 2000, color: "success" });
      setPostContent("");
      setIsModalOpen(false);
      fetchPosts();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Loading entries..." />

        {/* Posts Feed in Card Format */}
        {posts.map(post => (
          <IonCard key={post.post_id} className="entry-card">
            {post.image_url && (
              <img src={post.image_url} alt="Entry" />
            )}
            <IonCardHeader>
              <IonCardSubtitle>
                {new Date(post.post_created_at).toLocaleDateString()}
              </IonCardSubtitle>
              <IonCardTitle>
                {post.post_content.length > 50
                  ? post.post_content.slice(0, 50) + "..."
                  : post.post_content}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {post.post_content}
            </IonCardContent>
          </IonCard>
        ))}

        {/* Floating Button */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => setIsModalOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal for New Entry */}
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} swipeToClose>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New Page Entry</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonTextarea
              autoGrow
              placeholder="Start writing your thoughts..."
              value={postContent}
              onIonChange={e => setPostContent(e.detail.value!)}
            />
            <IonButtons className="ion-justify-content-around" style={{ marginTop: "1rem" }}>
              <IonButton fill="clear"><IonIcon icon={camera} /></IonButton>
              <IonButton fill="clear"><IonIcon icon={image} /></IonButton>
              <IonButton fill="clear"><IonIcon icon={mic} /></IonButton>
              <IonButton fill="clear"><IonIcon icon={happy} /></IonButton>
            </IonButtons>
            <IonButton expand="block" onClick={createPost} style={{ marginTop: "2rem" }}>
              Save Entry
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Page;

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
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { add, camera, image, mic, happy } from "ionicons/icons";
import { supabase } from "../utils/supabaseClient";
import './Page.css';

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [postTopic, setPostTopic] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [presentToast] = useIonToast();

  const topics = ["Personal", "Work", "Ideas"];

  useEffect(() => {
    fetchPosts();
  }, [selectedTopic]);

  const fetchPosts = async () => {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select(`
        *,
        users (
          username,
          user_avatar_url
        )
      `)
      .order("post_created_at", { ascending: false });

    if (selectedTopic) {
      query = query.eq("post_topic", selectedTopic);
    }

    const { data, error } = await query;

    if (error) {
      presentToast({ message: "Error loading posts", duration: 2000, color: "danger" });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const createPost = async () => {
    if (!postContent.trim() || !postTopic) {
      presentToast({ message: "Please enter content and choose a topic", duration: 2000, color: "warning" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("posts").insert([
      {
        post_content: postContent,
        post_topic: postTopic,
        user_id: user?.id,
      },
    ]);

    if (error) {
      presentToast({ message: "Failed to create post", duration: 2000, color: "danger" });
    } else {
      presentToast({ message: "Post created!", duration: 2000, color: "success" });
      setPostContent("");
      setPostTopic("");
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

        {/* Topic Filter Dropdown */}
        <IonSelect
          value={selectedTopic}
          placeholder="Filter by topic"
          onIonChange={(e) => setSelectedTopic(e.detail.value)}
          interface="popover"
          style={{ marginBottom: "1rem" }}
        >
          <IonSelectOption value={null}>All Topics</IonSelectOption>
          {topics.map((topic, index) => (
            <IonSelectOption key={index} value={topic}>
              {topic}
            </IonSelectOption>
          ))}
        </IonSelect>

        {/* Posts Feed */}
        {posts.map((post) => (
          <IonCard key={post.post_id} className="entry-card">
            <IonCardHeader>
              <IonCardSubtitle>
                {new Date(post.post_created_at).toLocaleDateString()} • {post.post_topic}
              </IonCardSubtitle>
              <IonCardTitle>
                {post.post_content.length > 50
                  ? post.post_content.slice(0, 50) + "..."
                  : post.post_content}
              </IonCardTitle>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                <img
                  src={post.users?.user_avatar_url || "/assets/default-avatar.png"}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                />
                <span>{post.users?.username || "Unknown User"}</span>
              </div>
            </IonCardHeader>
            <IonCardContent>{post.post_content}</IonCardContent>
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
              onIonChange={(e) => setPostContent(e.detail.value!)}
            />
            <IonSelect
              value={postTopic}
              placeholder="Select a topic"
              onIonChange={(e) => setPostTopic(e.detail.value)}
              interface="popover"
              style={{ marginTop: "1rem" }}
            >
              {topics.map((topic, index) => (
                <IonSelectOption key={index} value={topic}>
                  {topic}
                </IonSelectOption>
              ))}
            </IonSelect>

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

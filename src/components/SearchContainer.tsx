import { 
    IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonSearchbar, 
    IonTitle, 
    IonToolbar, 
    IonItem, 
    IonLabel, 
    IonAvatar, 
    IonImg 
  } from '@ionic/react';
  import { useState, useEffect } from 'react';
  
  // Define the Post interface
  interface Post {
    post_id: string;
    user_id: number;
    username: string;
    post_content: string;
    post_created_at: string;
    post_updated_at: string;
    avatar_url?: string;
    tags?: string[];
    mood?: string;
    media_url?: string;
    prompt?: string;
  }
  
  const SearchContainer: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  
    // Fetch posts from the database (simulated as an example)
    useEffect(() => {
      const fetchPosts = async () => {
        // Replace with your API call to fetch posts
        const response = await fetch('/api/posts'); // Example API endpoint
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data); // Set all posts initially
      };
  
      fetchPosts();
    }, []);
  
    // Handle search input
    const handleSearch = (event: CustomEvent) => {
      const query = event.detail.value?.toLowerCase() || '';
      setSearchQuery(query);
  
      // If the query is empty, show all posts
      if (!query) {
        setFilteredPosts(posts);
      } else {
        // Filter posts based on the username search query
        const filtered = posts.filter(post => 
          post.username.toLowerCase().includes(query)
        );
        setFilteredPosts(filtered);
      }
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Search</IonTitle>
          </IonToolbar>
          <IonToolbar>
            {/* Align the search bar to the left */}
            <IonSearchbar 
              value={searchQuery}
              onIonInput={handleSearch} 
              debounce={300} 
              style={{ 
                width: '100%', 
                marginLeft: '10px', // add some left margin to give a little space
              }} 
            />
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '10px',
            }}
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <IonItem key={post.post_id}>
                  {post.avatar_url && (
                    <IonAvatar slot="start">
                      <IonImg src={post.avatar_url} alt={`${post.username}'s avatar`} />
                    </IonAvatar>
                  )}
                  <IonLabel>
                    <h2>{post.username}</h2>
                    <p>{post.post_content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <p><strong>Tags:</strong> {post.tags.join(', ')}</p>
                    )}
                    {post.mood && <p><strong>Mood:</strong> {post.mood}</p>}
                    {post.media_url && <IonImg src={post.media_url} alt="Post media" />}
                    {post.prompt && <p><strong>Prompt:</strong> {post.prompt}</p>}
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <p>No posts found for this username.</p>
            )}
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default SearchContainer;
  
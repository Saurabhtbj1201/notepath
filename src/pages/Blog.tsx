import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Columns, 
  Calendar, 
  Eye, 
  User,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';

interface Article {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  views: number;
  published_at: string;
  author_id: string;
  topic_id: string | null;
  author_username?: string;
  topic_name?: string;
}

type LayoutType = 'grid' | 'list' | 'masonry';

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Auto-scroll carousel
  useEffect(() => {
    if (!carouselApi) return;
    
    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedTopic]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch topics
    const { data: topicsData } = await supabase
      .from('topics')
      .select('*')
      .order('name');
    if (topicsData) setTopics(topicsData);

    // Fetch articles
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (selectedTopic) {
      query = query.eq('topic_id', selectedTopic);
    }

    const { data, error } = await query;

    if (!error && data) {
      const articlesWithDetails = await Promise.all(
        data.map(async (article) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', article.author_id)
            .single();
          
          const { data: topic } = await supabase
            .from('topics')
            .select('name')
            .eq('id', article.topic_id)
            .single();
          
          return {
            ...article,
            author_username: profile?.username || 'Anonymous',
            topic_name: topic?.name,
          };
        })
      );
      
      // Set featured articles (top 5 most viewed)
      if (articlesWithDetails.length > 0) {
        const sorted = [...articlesWithDetails].sort((a, b) => (b.views || 0) - (a.views || 0));
        setFeaturedArticles(sorted.slice(0, 5));
        setArticles(articlesWithDetails);
      }
    }
    setLoading(false);
  };

  const featuredIds = featuredArticles.map(a => a.id);
  const filteredArticles = articles.filter(a => !featuredIds.includes(a.id));

  const renderGridLayout = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredArticles.map((article) => (
        <Link key={article.id} to={`/article/${article.id}`}>
          <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            {article.thumbnail_url && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {article.topic_name && (
                  <Badge variant="secondary" className="font-medium">
                    {article.topic_name}
                  </Badge>
                )}
              </div>
              <h3 className="line-clamp-2 font-serif text-lg font-bold leading-tight group-hover:text-primary">
                {article.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{article.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{article.author_username}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-6">
      {filteredArticles.map((article) => (
        <Link key={article.id} to={`/article/${article.id}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
            <div className="flex flex-col md:flex-row">
              {article.thumbnail_url && (
                <div className="md:w-64 lg:w-80 flex-shrink-0">
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="h-48 md:h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {article.topic_name && (
                      <Badge variant="secondary" className="font-medium">
                        {article.topic_name}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(article.published_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-muted-foreground">{article.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author_username}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.views} views
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );

  const renderMasonryLayout = () => (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {filteredArticles.map((article, index) => (
        <Link key={article.id} to={`/article/${article.id}`} className="break-inside-avoid block mb-6">
          <Card className={`group overflow-hidden transition-all hover:shadow-lg ${index % 3 === 0 ? 'bg-primary/5' : ''}`}>
            {article.thumbnail_url && index % 2 === 0 && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {article.topic_name && (
                  <Badge variant="outline" className="font-medium text-xs">
                    {article.topic_name}
                  </Badge>
                )}
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold group-hover:text-primary">
                {article.title}
              </h3>
              <p className={`text-sm text-muted-foreground ${index % 3 === 0 ? 'line-clamp-4' : 'line-clamp-2'}`}>
                {article.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{article.author_username}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views}
                </span>
              </div>
            </div>
            {article.thumbnail_url && index % 2 !== 0 && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Blog - NotePath | Explore All Articles</title>
        <meta name="description" content="Explore all articles on NotePath. Discover stories on technology, lifestyle, business, and more from our community of writers." />
        <meta name="keywords" content="blog, articles, NotePath, technology, lifestyle, business, writing" />
        <link rel="canonical" href="https://notepath-np.lovable.app/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Featured Articles Carousel */}
          {featuredArticles.length > 0 && !loading && (
            <section className="mb-12">
              <h2 className="mb-6 font-serif text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Featured Articles
              </h2>
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredArticles.map((article) => (
                    <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/2">
                      <Link to={`/article/${article.id}`}>
                        <Card className="group overflow-hidden transition-all hover:shadow-xl h-full">
                          <div className="grid md:grid-cols-2 gap-0 h-full">
                            {article.thumbnail_url && (
                              <div className="overflow-hidden">
                                <img
                                  src={article.thumbnail_url}
                                  alt={article.title}
                                  className="h-48 md:h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="flex flex-col justify-center p-6">
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                {article.topic_name && (
                                  <Badge className="font-medium">
                                    {article.topic_name}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-primary border-primary">
                                  Featured
                                </Badge>
                              </div>
                              <h3 className="mb-3 font-serif text-xl md:text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                              </h3>
                              <p className="mb-4 text-muted-foreground line-clamp-2 text-sm">
                                {article.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {article.author_username}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(article.published_at), 'MMM dd, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {article.views}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4" />
                <CarouselNext className="hidden md:flex -right-4" />
              </Carousel>
            </section>
          )}

          {/* Filters and Layout Toggle */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Topic Filter */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTopic === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTopic(null)}
                >
                  All Topics
                </Badge>
                {topics.slice(0, 5).map((topic) => (
                  <Badge
                    key={topic.id}
                    variant={selectedTopic === topic.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Layout Toggle */}
            <ToggleGroup 
              type="single" 
              value={layout} 
              onValueChange={(value) => value && setLayout(value as LayoutType)}
              className="justify-start"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="masonry" aria-label="Masonry view" className="gap-2">
                <Columns className="h-4 w-4" />
                <span className="hidden sm:inline">Masonry</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Articles */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No articles found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchQuery(''); setSelectedTopic(null); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              </div>
              {layout === 'grid' && renderGridLayout()}
              {layout === 'list' && renderListLayout()}
              {layout === 'masonry' && renderMasonryLayout()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('subscribers')
      .insert({ email });

    if (error) {
      if (error.code === '23505') {
        toast.info('You are already subscribed!');
        setIsSubscribed(true);
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } else {
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
    }
    
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <section className="w-full bg-gradient-to-br from-primary/10 via-primary/5 to-background border-y border-border">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          {/* Heading */}
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Stay Updated with{' '}
            <span className="text-primary">NotePath</span>
          </h2>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Get the latest articles, writing tips, and community updates delivered straight to your inbox.
            Join thousands of readers who trust NotePath.
          </p>

          {/* Features */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Weekly curated content</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Exclusive writing tips</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>No spam, ever</span>
            </div>
          </div>

          {/* Form */}
          {isSubscribed ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 text-base"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 gap-2 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Subscribing...'
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Trust Text */}
          <p className="mt-4 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

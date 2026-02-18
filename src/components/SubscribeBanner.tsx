import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const SubscribeBanner = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('subscribeBannerDismissed') === 'true';
  });

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
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } else {
      toast.success('Successfully subscribed to NotePath!');
      setIsDismissed(true);
      sessionStorage.setItem('subscribeBannerDismissed', 'true');
    }
    
    setIsSubmitting(false);
    setEmail('');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('subscribeBannerDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span className="font-medium">Stay Updated with NotePath</span>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-48 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 sm:w-56"
              required
            />
            <Button 
              type="submit" 
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              className="gap-1"
            >
              {isSubmitting ? 'Subscribing...' : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-70 transition-opacity hover:opacity-100 sm:relative sm:right-0 sm:translate-y-0"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

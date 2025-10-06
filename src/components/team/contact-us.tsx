'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SparklesCore } from '@/components/ui/sparkles';
import { Label } from '@/components/ui/label';
import { Check, Loader2 } from 'lucide-react';
import Earth from '@/components/ui/globe';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ContactUsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ContactUsModal({ open, onOpenChange }: ContactUsModalProps = {}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Form submitted:', { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if this is controlled from parent or has its own trigger
  const isControlled = open !== undefined && onOpenChange !== undefined;
  
  const dialogProps = isControlled 
    ? { open, onOpenChange }
    : {};
  
  return (
    <Dialog {...dialogProps}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-b from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600">
            Contact Us
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-2xl border border-border/40 shadow-xl backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Contact
            </span>
            <span className="text-blue-600 italic">Us</span>
          </DialogTitle>
          <SparklesCore
            id="sparkles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={400}
            className="absolute top-10 left-0 h-16 w-full"
            particleColor="rgb(37, 99, 235)"
          />
        </DialogHeader>

        <div className="grid md:grid-cols-2">
          {/* Left: Form */}
          <div className="relative p-6 md:p-8">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  required
                  className="h-32 resize-none"
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-b from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center justify-center">
                      <Check className="mr-2 h-4 w-4" />
                      Message Sent!
                    </span>
                  ) : (
                    <span>Send Message</span>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </div>

          {/* Right: Earth */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative hidden md:flex items-center justify-center pr-8 mb-8"
          >
            <article className="relative mx-auto h-[350px] max-w-[400px] overflow-hidden rounded-2xl border bg-gradient-to-b from-blue-600 to-blue-600/5 p-6 text-xl text-white md:h-[420px] md:p-8 md:text-2xl lg:text-3xl">
              LegalAI <br/> Your legal queries <br/> Simplified
              <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                <Earth
                  scale={1.1}
                  baseColor={[0.1451, 0.3882, 0.9216]}
                  markerColor={[0.2353, 0.4706, 0.9451]}
                  glowColor={[0.1451, 0.3882, 0.9216]}
                />
              </div>
            </article>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CookiePolicyDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CookiePolicyDialog({ open, onOpenChange }: CookiePolicyDialogProps) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Cookie Policy
          </DialogTitle>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto"
          >
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  {/* 1. Introduction */}
                  <div>
                    <p><strong>1. Introduction</strong></p>
                    <p>
                      This Cookie Policy explains how LegalAI (“we”, “our”, “us”)
                      uses cookies and similar technologies when you visit our website.
                      It also explains your choices regarding these technologies.
                    </p>
                  </div>

                  {/* 2. What Are Cookies */}
                  <div>
                    <p><strong>2. What Are Cookies?</strong></p>
                    <p>
                      Cookies are small text files stored on your device by your browser.
                      They allow us to recognize your device, remember preferences, and
                      improve your overall experience.
                    </p>
                  </div>

                  {/* 3. Types of Cookies We Use */}
                  <div>
                    <p><strong>3. Types of Cookies We Use</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Essential Cookies:</strong> Required for the website to
                        function properly. These include login and security features.
                      </li>
                      <li>
                        <strong>Performance Cookies:</strong> Collect information on how
                        visitors use the site, such as pages visited and errors encountered.
                      </li>
                      <li>
                        <strong>Functional Cookies:</strong> Remember preferences such as
                        language settings and personalized layouts.
                      </li>
                      <li>
                        <strong>Analytics & Tracking Cookies:</strong> Help us measure
                        traffic and usage trends, and understand how our services are
                        being used.
                      </li>
                      <li>
                        <strong>Advertising Cookies:</strong> Used to deliver relevant ads
                        and measure their effectiveness.
                      </li>
                    </ul>
                  </div>

                  {/* 4. How We Use Cookies */}
                  <div>
                    <p><strong>4. How We Use Cookies</strong></p>
                    <p>
                      We use cookies to provide and improve our services, remember your
                      preferences, analyze site performance, personalize content, and
                      deliver targeted advertising.
                    </p>
                  </div>

                  {/* 5. Third-Party Cookies */}
                  <div>
                    <p><strong>5. Third-Party Cookies</strong></p>
                    <p>
                      We may allow third-party service providers such as analytics and
                      advertising networks to place cookies on your device. These parties
                      may collect information about your online activities across websites
                      and services.
                    </p>
                  </div>

                  {/* 6. Your Cookie Choices */}
                  <div>
                    <p><strong>6. Your Choices</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Browser Settings:</strong> Most browsers allow you to
                        control cookies through their settings, including blocking or
                        deleting cookies.
                      </li>
                      <li>
                        <strong>Opt-Out Tools:</strong> Some third parties provide opt-out
                        tools for their cookies, especially for targeted advertising.
                      </li>
                      <li>
                        <strong>Consent Management:</strong> You can manage your cookie
                        preferences directly through our cookie consent banner when
                        visiting the site.
                      </li>
                    </ul>
                  </div>

                  {/* 7. Updates to This Policy */}
                  <div>
                    <p><strong>7. Updates to This Policy</strong></p>
                    <p>
                      We may update this Cookie Policy from time to time. Any changes will
                      be posted on this page with an updated effective date.
                    </p>
                  </div>

                  {/* 8. Contact Us */}
                  <div>
                    <p><strong>8. Contact Us</strong></p>
                    <p>
                      If you have any questions about this Cookie Policy, please contact us at{' '}
                      <a href="mailto:anu.guin.01@gmail.com" className="text-blue-500 underline">
                        anu.guin.01@gmail.com
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t px-6 py-4 sm:items-center">
          {!hasReadToBottom && (
            <span className="text-muted-foreground grow text-xs max-sm:text-center">
              Please scroll and read the Cookie Policy before accepting.
            </span>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" disabled={!hasReadToBottom}>
              I Agree
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

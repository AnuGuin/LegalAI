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

interface PrivacyDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
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
            Privacy Policy
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
                      Welcome to LegalAI. We are committed to protecting your
                      privacy and ensuring the security of your personal information.
                      This Privacy Policy outlines how we collect, use, and protect your data.
                    </p>
                  </div>

                  {/* 2. Information We Collect */}
                  <div>
                    <p><strong>2. Information We Collect</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>a. Personal Information:</strong> When you register
                        for an account, subscribe to our services, or contact us, we
                        may collect personal information such as your name, email
                        address, phone number, and payment details.
                      </li>
                      <li>
                        <strong>b. Usage Data:</strong> We collect information on
                        how you access and use the website, including your IP
                        address, browser type, pages visited, time spent on pages,
                        and other usage statistics.
                      </li>
                      <li>
                        <strong>c. Cookies:</strong> We use cookies and similar
                        tracking technologies to track activity on our website and
                        hold certain information. You can control the use of cookies
                        at the individual browser level.
                      </li>
                    </ul>
                  </div>

                  {/* 3. How We Use Your Information */}
                  <div>
                    <p><strong>3. How We Use Your Information</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>a. To Provide and Maintain Our Services:</strong> We use your personal information to create and manage your account, provide customer support, and process transactions.</li>
                      <li><strong>b. To Improve Our Services:</strong> Usage data helps us understand how our services are being used and allows us to make improvements.</li>
                      <li><strong>c. To Communicate with You:</strong> We may use your information to send newsletters, promotional materials, and other information that may be of interest to you. You can opt out of these communications at any time by following the unsubscribe link in the emails.</li>
                      <li><strong>d. To Enforce Our Terms:</strong> We use your information to enforce our terms and conditions, including detecting and preventing fraud or other unauthorized activities.</li>
                    </ul>
                  </div>

                  {/* 4. Sharing Your Information */}
                  <div>
                    <p><strong>4. Sharing Your Information</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>a. Third-Party Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
                      <li><strong>b. Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                      <li><strong>c. Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your personal information may be transferred to the new entity.</li>
                    </ul>
                  </div>

                  {/* 5. Data Security */}
                  <div>
                    <p><strong>5. Data Security</strong></p>
                    <p>
                      We implement a variety of security measures to maintain the safety of your personal
                      information. However, no method of transmission over the internet or electronic
                      storage is 100% secure. While we strive to use commercially acceptable means to
                      protect your personal information, we cannot guarantee its absolute security.
                    </p>
                  </div>

                  {/* 6. Data Retention */}
                  <div>
                    <p><strong>6. Data Retention</strong></p>
                    <p>
                      We will retain your personal information only for as long as necessary to fulfill
                      the purposes for which it was collected or to comply with legal obligations.
                    </p>
                  </div>

                  {/* 7. Your Rights */}
                  <div>
                    <p><strong>7. Your Rights</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>a. Access and Update:</strong> You have the right to access and update your personal information. You can do this through your account settings.</li>
                      <li><strong>b. Deletion:</strong> You have the right to request the deletion of your personal information. We will comply with your request, subject to certain exceptions prescribed by law.</li>
                      <li><strong>c. Opt-Out:</strong> You have the right to opt-out of receiving promotional communications from us.</li>
                    </ul>
                  </div>

                  {/* 8. Children's Privacy */}
                  <div>
                    <p><strong>8. Children's Privacy</strong></p>
                    <p>
                      Our services are not intended for use by individuals under the age of 18. We do not
                      knowingly collect personal information from children under 18. If you become aware
                      that a child has provided us with personal information, please contact us, and we
                      will take steps to remove such information and terminate the child's account.
                    </p>
                  </div>

                  {/* 9. Changes to This Privacy Policy */}
                  <div>
                    <p><strong>9. Changes to This Privacy Policy</strong></p>
                    <p>
                      We may update our Privacy Policy from time to time. We will notify you of any
                      changes by posting the new Privacy Policy on this page. You are advised to review
                      this Privacy Policy periodically for any changes.
                    </p>
                  </div>

                  {/* 10. Contact Us */}
                  <div>
                    <p><strong>10. Contact Us</strong></p>
                    <p>
                      If you have any questions or concerns about this Privacy Policy, please contact us
                      at <a href="mailto:anu.guin.01@gmail.com" className="text-blue-500 underline">
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
              Please scroll and read the Privacy Policy before accepting.
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

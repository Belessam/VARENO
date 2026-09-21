/**
 * Contact Page
 *
 * Phone, chat/message, and contact form.
 * Premium design consistent with VARENO identity.
 */

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/lib/i18n";

export function ContactPage() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;
    setSent(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-xl lg:py-3xl">
      <div className="mb-10">
        <h1 className="font-display text-headline-lg lg:text-headline-xl text-on-surface tracking-[0.03em] mb-3">
          {t("contact.title")}
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          {/* Phone */}
          <div className="bg-surface-container-low p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                <Icon name="call" size="md" />
              </div>
              <div>
                <span className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant block">
                  {t("contact.phone")}
                </span>
                <a
                  href="tel:01025097906"
                  className="font-body text-headline-sm text-primary font-light hover:underline"
                  dir="ltr"
                >
                  01025097906
                </a>
              </div>
            </div>
            <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
              {t("contact.phoneDesc")}
            </p>
          </div>

          {/* WhatsApp / Chat */}
          <div className="bg-surface-container-low p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                <Icon name="chat" size="md" />
              </div>
              <div>
                <span className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant block">
                  {t("contact.chat")}
                </span>
                <a
                  href="https://wa.me/201025097906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-body-md text-primary hover:underline"
                >
                  {t("contact.sendWhatsApp")}
                </a>
              </div>
            </div>
            <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
              {t("contact.chatDesc")}
            </p>
          </div>

          {/* Response Time */}
          <div className="bg-surface-container-low p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                <Icon name="schedule" size="md" />
              </div>
              <div>
                <span className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant block">
                  {t("contact.responseTime")}
                </span>
                <span className="font-body text-body-md text-on-surface">
                  {t("contact.within24")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface-container-low p-6 md:p-8 shadow-2xl">
          {!sent ? (
            <form onSubmit={handleSendMessage} className="space-y-5">
              <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-2">
                {t("contact.sendMessage")}
              </h2>
              <div>
                <label className="block font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant mb-1.5">
                  {t("contact.yourName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("contact.namePlaceholder")}
                  required
                  className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 font-body text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                />
              </div>
              <div>
                <label className="block font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant mb-1.5">
                  {t("contact.message")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("contact.messagePlaceholder")}
                  required
                  rows={5}
                  className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 font-body text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all"
              >
                {t("contact.sendBtn")}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="check_circle" size="xl" className="text-primary mb-4" />
              <h3 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-2">
                {t("contact.messageSent")}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {t("contact.messageSentDesc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

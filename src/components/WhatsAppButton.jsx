import { MessageCircle } from "lucide-react";

function WhatsAppButton() {
  const phoneNumber = "9471268826";

  const message = encodeURIComponent(
    "Hello Sigma Classes, I want to know more about your courses."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Contact Sigma Classes on WhatsApp"
      title="Chat with Sigma Classes on WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2.2} />
    </a>
  );
}

export default WhatsAppButton;
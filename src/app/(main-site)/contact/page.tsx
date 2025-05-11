import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: "Axignis - Contact",
};

export default function ContactPage() {
  return (
    <div>
      <ContactForm />
    </div>
  )
}

import { useState } from 'react';
import { sendContactForm, ContactFormPayload } from '../services/api/contact';

export function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContactForm = async (data: ContactFormPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await sendContactForm(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return { submitContactForm, loading, error, success };
}

import { apiClient } from './client';

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export async function sendContactForm(data: ContactFormPayload) {
  const response = await apiClient.post('/contact/recieve/', data);
  return response.data;
}

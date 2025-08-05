import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface FormField {
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string; }[];
}

interface FormData {
  title: string;
  submitText: string;
  successMessage: {
    title: string;
    text: string;
  };
  fields: {
    name: FormField;
    email: FormField;
    phone: FormField;
    service: FormField;
    message: FormField;
  };
}

interface ContactFormProps {
  formData: FormData;
}

const ContactForm: React.FC<ContactFormProps> = ({ formData }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setForm({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="bg-black/50 border border-orange-900/30 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">
        {formData.title}
      </h2>
      
      {isSubmitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-green-400 mb-2">{formData.successMessage.title}</h3>
          <p className="text-white/60">
            {formData.successMessage.text}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {formData.fields.name.label} {formData.fields.name.required && '*'}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required={formData.fields.name.required}
                className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={formData.fields.name.placeholder}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {formData.fields.email.label} {formData.fields.email.required && '*'}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required={formData.fields.email.required}
                className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={formData.fields.email.placeholder}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {formData.fields.phone.label}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={formData.fields.phone.placeholder}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {formData.fields.service.label}
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                {formData.fields.service.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {formData.fields.message.label}
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={formData.fields.message.rows}
              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder={formData.fields.message.placeholder}
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center shadow-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            {formData.submitText}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;

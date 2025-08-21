from django.core.mail import send_mail
from django.conf import settings

class EmailHandler:
	@staticmethod
	def send_contact_email(data: dict) -> None:
		name = data.get('name', '')
		email = data.get('email', '')
		phone = data.get('phone', '')
		service = data.get('service', '')
		message = data.get('message', '')

		subject = f"New Contact Form Submission from {name}"
		body = f"""
            Name: {name}
            Email: {email}
            Phone: {phone}
            Service: {service}
            Message: {message}
        """
		send_mail(
			subject,
			body,
			settings.DEFAULT_FROM_EMAIL,
			['admin@detailinghubpk.com'],
			fail_silently=False,
		)

from decimal import Decimal
import random
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from workshop.models.customer import Customer
from workshop.models.product_variant import ProductVariant
from workshop.models.invoice import Invoice
from workshop.models.invoice_items import InvoiceItems

class Command(BaseCommand):
    help = "Generate 10 sample invoices with random items and customers"

    def handle(self, *args, **kwargs):
        customers = list(Customer.objects.all())
        product_variants = list(ProductVariant.objects.all())

        if not customers:
            self.stdout.write(self.style.ERROR("No customers found."))
            return

        if not product_variants:
            self.stdout.write(self.style.ERROR("No product variants found."))
            return

        for _ in range(10):
            customer = random.choice(customers)
            selected_variants = random.sample(product_variants, min(3, len(product_variants)))

            total_amount = Decimal("0.00")
            invoice_items = []

            for variant in selected_variants:
                quantity = random.randint(1, 5)
                unit_price = variant.price
                total_price = unit_price * quantity
                total_amount += total_price

                invoice_items.append({
                    "product_variant": variant,
                    "quantity": quantity,
                    "unit_price": unit_price,
                    "total_price": total_price
                })

            if not invoice_items:
                continue  # Skip if no valid items

            discount = Decimal("5.00")
            tax = total_amount * Decimal("0.05")
            grand_total = total_amount - discount + tax

            # Generate a random due date within the next 30 days
            due_date = datetime.now() + timedelta(days=random.randint(1, 30))

            invoice = Invoice.objects.create(
                customer=customer,  # Pass the Customer instance directly
                subtotal=total_amount,
                total_amount=grand_total,
                discount_amount=discount,  # Updated field name
                tax_amount=tax,           # Updated field name
                status=random.choice(["paid", "pending", "partially_paid"]),
                payment_method=random.choice(["cash", "credit_card", "bank_transfer"]),
                due_date=due_date.date()  # Add due_date
            )

            for item in invoice_items:
                InvoiceItems.objects.create(
                    invoice=invoice,
                    product_variant=item["product_variant"],  # Bind product_variant
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    total_price=item["total_price"]
                )

            self.stdout.write(self.style.SUCCESS(
                f"Invoice {invoice.id} created for {customer.first_name} {customer.last_name} with {len(invoice_items)} items. Total: ${grand_total}, Due Date: {due_date.date()}"
            ))
            self.stdout.write(self.style.SUCCESS(
                f"Invoice {invoice.id} created for {customer.username} with {len(invoice_items)} items. Total: ${grand_total}, Due Date: {due_date.date()}"
            ))

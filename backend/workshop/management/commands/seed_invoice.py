from decimal import Decimal
import random

from django.core.management.base import BaseCommand
from workshop.models.customer import Customer
from workshop.models.product import Product
from workshop.models.invoice import Invoice
from workshop.models.invoice_items import InvoiceItems

class Command(BaseCommand):
    help = "Generate 10 sample invoices with random items and customers"

    def handle(self, *args, **kwargs):
        customers = list(Customer.objects.all())
        products = list(Product.objects.all())

        if not customers:
            self.stdout.write(self.style.ERROR("No customers found."))
            return

        if not products:
            self.stdout.write(self.style.ERROR("No products found."))
            return

        for _ in range(10):
            customer = random.choice(customers)
            selected_products = random.sample(products, min(3, len(products)))

            total_amount = Decimal("0.00")
            invoice_items = []

            for product in selected_products:
                if not product.variants.exists():
                    continue
                variant = product.variants.first()
                quantity = random.randint(1, 5)
                unit_price = variant.price
                total_price = unit_price * quantity
                total_amount += total_price

                invoice_items.append({
                    "product": product,
                    "quantity": quantity,
                    "unit_price": unit_price,
                    "total_price": total_price
                })

            if not invoice_items:
                continue  # skip if no valid items

            discount = Decimal("5.00")
            tax = total_amount * Decimal("0.05")
            grand_total = total_amount - discount + tax

            invoice = Invoice.objects.create(
                customer=customer,
                total_amount=grand_total,
                discount=discount,
                tax=tax,
                status=random.choice(["paid", "pending", "partially_paid"]),
                payment_method=random.choice(["cash", "credit_card", "bank_transfer"]),
            )

            for item in invoice_items:
                InvoiceItems.objects.create(
                    invoice=invoice,
                    product=item["product"],
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    total_price=item["total_price"]
                )

            self.stdout.write(self.style.SUCCESS(
                f"Invoice {invoice.id} created for {customer.username} with {len(invoice_items)} items. Total: ${grand_total}"
            ))

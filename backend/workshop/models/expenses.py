import uuid
from django.db import models
from django.conf import settings


class ExpenseCategory(models.TextChoices):
    CHAI = "chai", "Chai"
    ELECTRICITY = "electricity", "Electricity"
    AWS = "aws", "AWS"
    INTERNET = "internet", "Internet"
    RENT = "rent", "Rent"
    OTHER = "other", "Other"


class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)  # e.g., "Office Chai", "AWS EC2 Bill"
    category = models.CharField(
        max_length=20,
        choices=ExpenseCategory.choices,
        default=ExpenseCategory.OTHER,
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)  # optional details
    paid_on = models.DateField()  # when it was paid
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # optional: track who recorded the expense
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="expenses",
    )

    class Meta:
        db_table = "expense"
        ordering = ["-paid_on"]

    def __str__(self):
        return f"{self.title} - {self.amount}"

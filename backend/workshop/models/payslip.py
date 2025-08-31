import uuid
from django.db import models

from workshop.models import Employee

class PaySlip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payslips")
    month = models.CharField(max_length=7)  # Format: YYYY-MM
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_on = models.DateField(auto_now_add=True)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_salary = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = "payslip"
        unique_together = ("employee", "month")  # Only one slip per employee per month

    def save(self, *args, **kwargs):
        # Calculate total_salary as amount + bonus (bonus can be None)
        bonus_val = self.bonus if self.bonus is not None else 0
        self.total_salary = self.amount + bonus_val
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee} - {self.month} - {self.amount} (Total: {self.total_salary})"
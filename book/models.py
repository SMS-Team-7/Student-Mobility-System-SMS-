from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Book(models.Model):
    BOOK_TYPES = [
        ("past_question", "Past Question"),
        ("textbook", "Textbook"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    book_type = models.CharField(max_length=20, choices=BOOK_TYPES, default="other")
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploaded_books")
    file = models.FileField(upload_to="books/")  # PDF, DOC, etc.
    is_free = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # if not free
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({'Free' if self.is_free else 'Paid'})"


class BookPurchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchases")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="purchases")
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} purchased {self.book.title}"

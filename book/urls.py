from django.urls import path
from .views import (
    BookUploadView, BookListView, BookDetailView,
    PurchaseBookView, MyPurchasesView,
)

urlpatterns = [
    # Books
    path("books/", BookListView.as_view(), name="book-list"),  # List/search books
    path("books/upload/", BookUploadView.as_view(), name="book-upload"),  # Upload book/past question
    path("books/<int:pk>/", BookDetailView.as_view(), name="book-detail"),  # Book detail

    # Purchases
    path("books/<int:book_id>/purchase/", PurchaseBookView.as_view(), name="book-purchase"),
    path("purchases/", MyPurchasesView.as_view(), name="my-purchases"),
]

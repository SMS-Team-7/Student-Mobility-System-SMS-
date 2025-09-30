from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book, BookPurchase
from .serializers import BookSerializer, BookUploadSerializer, BookPurchaseSerializer

from ride.models import TokenReward   # reuse TokenReward model


# -------- Upload Book --------
class BookUploadView(generics.CreateAPIView):
    serializer_class = BookUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        book = serializer.save(uploaded_by=self.request.user)

        # Reward user if book is FREE
        if book.is_free:
            TokenReward.objects.create(
                user=self.request.user,
                ride=None,   # no ride related, since this is library
                amount=5,
                reason="Uploaded a free book"
            )


# -------- List/Search Books --------
class BookListView(generics.ListAPIView):
    queryset = Book.objects.all().order_by("-created_at")
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "book_type"]


# -------- Book Detail --------
class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]


# -------- Purchase Book --------
class PurchaseBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)

        if book.is_free:
            return Response({"message": "This book is free. No purchase needed."}, status=400)

        # Check if already purchased
        if BookPurchase.objects.filter(user=request.user, book=book).exists():
            return Response({"message": "You already purchased this book."}, status=400)

        # Create purchase
        purchase = BookPurchase.objects.create(user=request.user, book=book)

        # Reward user for purchasing
        TokenReward.objects.create(
            user=request.user,
            ride=None,   # unrelated to rides
            amount=3,
            reason="Purchased a book"
        )

        return Response(BookPurchaseSerializer(purchase).data, status=201)


# -------- List My Purchases --------
class MyPurchasesView(generics.ListAPIView):
    serializer_class = BookPurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BookPurchase.objects.filter(user=self.request.user).order_by("-purchased_at")

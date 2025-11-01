from rest_framework import serializers
from .models import Book, BookPurchase


class BookSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id", "title", "description", "book_type",
            "uploaded_by", "file", "is_free", "price", "created_at"
        ]


class BookUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["title", "description", "book_type", "file", "is_free", "price"]


class BookPurchaseSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BookPurchase
        fields = ["id", "user", "book", "purchased_at"]

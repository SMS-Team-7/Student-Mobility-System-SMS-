from rest_framework import serializers

class WebAuthnBeginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)

class WebAuthnCompleteSerializer(serializers.Serializer):
    clientDataJSON = serializers.CharField()
    attestationObject = serializers.CharField(required=False, allow_null=True)
    rawId = serializers.CharField()
    type = serializers.CharField()
    # when authenticating:
    authenticatorData = serializers.CharField(required=False)
    signature = serializers.CharField(required=False)

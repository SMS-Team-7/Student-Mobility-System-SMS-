import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings

# ------------------- Chat & WebRTC -------------------
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        self.room_name = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        # --- Chat Message ---
        if action == "chat_message":
            receiver_id = data.get("receiver_id")
            message = data.get("message")

            # Lazy import models
            ChatMessage = await database_sync_to_async(
                lambda: __import__('chat.models', fromlist=['ChatMessage']).ChatMessage
            )()
            User = await database_sync_to_async(
                lambda: __import__(settings.AUTH_USER_MODEL.split('.')[0],
                                   fromlist=[settings.AUTH_USER_MODEL.split('.')[-1]])
                .objects.get
            )()

            receiver = await database_sync_to_async(lambda: User.objects.get(id=receiver_id))()
            await database_sync_to_async(ChatMessage.objects.create)(
                sender=self.user,
                receiver=receiver,
                content=message
            )

            # Send to receiver
            await self.channel_layer.group_send(
                f"user_{receiver.id}",
                {"type": "chat.message", "message": message, "sender_id": self.user.id}
            )

            # Send back to sender
            await self.send(text_data=json.dumps({
                "action": "chat_message",
                "message": message,
                "receiver_id": receiver.id,
                "sender_id": self.user.id
            }))

        # --- WebRTC Signaling ---
        elif action in ["webrtc_offer", "webrtc_answer", "webrtc_ice_candidate"]:
            target_id = data.get("target_id")
            payload_key = "offer" if action == "webrtc_offer" else "answer" if action == "webrtc_answer" else "candidate"
            payload = data.get(payload_key)

            await self.channel_layer.group_send(
                f"user_{target_id}",
                {"type": action, payload_key: payload, "sender_id": self.user.id}
            )

    # --- Event Handlers ---
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "action": "chat_message",
            "message": event["message"],
            "sender_id": event["sender_id"]
        }))

    async def webrtc_offer(self, event):
        await self.send(text_data=json.dumps({
            "action": "webrtc_offer",
            "offer": event["offer"],
            "sender_id": event["sender_id"]
        }))

    async def webrtc_answer(self, event):
        await self.send(text_data=json.dumps({
            "action": "webrtc_answer",
            "answer": event["answer"],
            "sender_id": event["sender_id"]
        }))

    async def webrtc_ice_candidate(self, event):
        await self.send(text_data=json.dumps({
            "action": "webrtc_ice_candidate",
            "candidate": event["candidate"],
            "sender_id": event["sender_id"]
        }))


# ------------------- Driver Location -------------------
class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "drivers_location"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        user = self.scope["user"]

        if user.is_authenticated:
            DriverLocation = await database_sync_to_async(
                lambda: __import__('chat.models', fromlist=['DriverLocation']).DriverLocation
            )()
            Driver = await database_sync_to_async(
                lambda: __import__('driver.models', fromlist=['Driver']).Driver
            )()

            driver = await database_sync_to_async(lambda: Driver.objects.get(user=user))()
            await database_sync_to_async(DriverLocation.objects.update_or_create)(
                driver=driver,
                defaults={"latitude": latitude, "longitude": longitude}
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "driver.location",
                    "driver_id": driver.id,
                    "latitude": latitude,
                    "longitude": longitude
                }
            )

    async def driver_location(self, event):
        await self.send(text_data=json.dumps(event))

# test_token_rewards.py
import os
import django

# ✅ Make sure Django uses the right settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "team7.settings")
django.setup()

from django.contrib.auth import get_user_model
from driver.models import Driver, Student
from ride.models import Ride
from reward.services.hedera_service import transfer_tokens, create_hedera_account
from dotenv import load_dotenv

load_dotenv()

User = get_user_model()

# -------------------------------
# 🔧 Load environment variables
# -------------------------------
HEDERA_OPERATOR_ID = os.getenv("HEDERA_OPERATOR_ID")
HEDERA_OPERATOR_KEY = os.getenv("HEDERA_OPERATOR_KEY")
TEAM7_TOKEN_ID = os.getenv("TEAM7_TOKEN_ID")

print("🔍 Operator ID loaded as:", repr(HEDERA_OPERATOR_ID))
print("🔍 Operator Key loaded as:", repr(HEDERA_OPERATOR_KEY)[:40] + "...")
print("🔍 Token ID loaded as:", repr(TEAM7_TOKEN_ID))


# -------------------------------
# 🧩 Helper: Ensure Hedera account exists for user
# -------------------------------
def ensure_hedera_account(user):
    """Create and attach a Hedera account for the given user if missing."""
    if not getattr(user, "hedera_account_id", None):
        print(f"⚙️ Creating Hedera account for {user.username}...")
        account_id, pub_key, priv_key = create_hedera_account()

        user.hedera_account_id = account_id
        user.hedera_public_key = pub_key
        user.hedera_private_key = priv_key
        user.save()
        print(f"✅ Created Hedera account {account_id} for {user.username}")
    else:
        print(f"✅ {user.username} already has Hedera account {user.hedera_account_id}")


# -------------------------------
# 🚗 Create dummy ride + token rewards
# -------------------------------
def create_dummy_data():
    student_user, _ = User.objects.get_or_create(
        username="test_student",
        defaults={"email": "student@test.com"}
    )

    driver_user, _ = User.objects.get_or_create(
        username="test_driver",
        defaults={"email": "driver@test.com"}
    )

    # Ensure both have Hedera accounts
    ensure_hedera_account(student_user)
    ensure_hedera_account(driver_user)

    # Create driver/student profiles
    student, _ = Student.objects.get_or_create(user=student_user)
    driver, _ = Driver.objects.get_or_create(user=driver_user, is_available=True)

    # Create dummy completed ride
    ride = Ride.objects.create(
        student=student,
        driver=driver,
        pickup_location="Campus Gate",
        dropoff_location="Library",
        status="completed"
    )

    print(f"🚗 Created dummy ride #{ride.id} between {student_user.username} and {driver_user.username}")

    # Reward both users
    try:
        student_reward = transfer_tokens(
            user=student_user,
            amount=5,
            reason=f"Test reward for booking ride #{ride.id}"
        )

        driver_reward = transfer_tokens(
            user=driver_user,
            amount=10,
            reason=f"Test reward for completing ride #{ride.id}"
        )

        print("✅ Tokens rewarded successfully!")
        print(f"🎓 Student Reward: {student_reward.amount} tokens")
        print(f"🚘 Driver Reward: {driver_reward.amount} tokens")

    except Exception as e:
        print(f"❌ Error rewarding tokens: {e}")


if __name__ == "__main__":
    create_dummy_data()

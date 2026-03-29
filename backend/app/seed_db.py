import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_users():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    default_users = [
        ("admin", "admin@logitrack.com", "admin", "password"),
        ("supply_manager", "supply@logitrack.com", "supply_chain_manager", "password"),
        ("sales_manager", "sales@logitrack.com", "sales_manager", "password"),
        (
            "warehouse_manager",
            "warehouse@logitrack.com",
            "warehouse_manager",
            "password",
        ),
        (
            "logistics_coord",
            "logistics@logitrack.com",
            "logistics_coordinator",
            "password",
        ),
        ("support", "support@logitrack.com", "customer_support", "password"),
    ]

    for username, email, role, password in default_users:
        existing_user = db.query(User).filter(User.username == username).first()
        if not existing_user:
            hashed_password = pwd_context.hash(password)
            user = User(
                username=username,
                email=email,
                hashed_password=hashed_password,
                role=role,
                is_active=True,
            )
            db.add(user)
            print(f"Created user: {username}")

    db.commit()
    db.close()
    print("Users seeded successfully!")


if __name__ == "__main__":
    seed_users()

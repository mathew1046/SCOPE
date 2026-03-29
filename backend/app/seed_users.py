from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

passwords_to_hash = [
    ("admin", "password"),
    ("supply_manager", "password"),
    ("sales_manager", "password"),
    ("warehouse_manager", "password"),
    ("logistics_coord", "password"),
    ("support", "password"),
]

for username, password in passwords_to_hash:
    hashed = pwd_context.hash(password)
    print(f"('{username}', '{hashed}'),")

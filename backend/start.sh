#!/bin/bash
set -e

echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

echo "Creating tables..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

echo "Seeding users..."
python /app/app/seed_db.py

echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
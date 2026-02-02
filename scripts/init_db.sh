#!/bin/bash

# Define variables
DB_CONTAINER="infra-postgres-1" # Standard compose name (folder_service_1)
DB_USER="miningcore"
DB_NAME="miningcore"
SCHEMA_URL="https://raw.githubusercontent.com/oliverw/miningcore/master/src/Miningcore/Persistence/Postgres/Scripts/createdb.sql"

echo "⏳ Waiting for PostgreSQL to be ready..."

# Loop until pg_isready returns 0 (success) inside the container
until docker exec $DB_CONTAINER pg_isready -U $DB_USER > /dev/null 2>&1; do
  echo -n "."
  sleep 2
done

echo ""
echo "✅ Database is up! Downloading schema..."

# Download the schema file to a temporary location
curl -s $SCHEMA_URL -o createdb.sql

if [ -f "createdb.sql" ]; then
    echo "📜 Applying schema to database..."
    # Pipe the file content directly into the psql command inside the container
    cat createdb.sql | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME
    
    # Cleanup
    rm createdb.sql
    echo "🚀 Database initialized successfully!"
else
    echo "❌ Failed to download schema file."
    exit 1
fi
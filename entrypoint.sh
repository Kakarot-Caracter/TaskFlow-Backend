#!/bin/sh
set -e

# Espera opcional a DB (si querés un wait-for, podés añadir aquí)
# Por ejemplo, simple retry loop:
wait_for_db() {
  retries=20
  until nc -z taskflow-db 5432 || [ $retries -le 0 ]; do
    echo "Esperando a postgres... reintentos restantes: $retries"
    retries=$((retries - 1))
    sleep 1
  done

  if [ $retries -le 0 ]; then
    echo "No se pudo conectar a la base de datos (timeout)."
    exit 1
  fi
}

# Solo intentar hacer wait si la variable está presente (evita en entornos donde no exista)
if [ -n "$WAIT_FOR_DB" ]; then
  wait_for_db
fi

# Ejecutar migraciones si PRISMA_MIGRATE=true
if [ "$PRISMA_MIGRATE" = "true" ]; then
  echo "Ejecutando migrations: npx prisma migrate deploy"
  # Usamos npx para invocar la CLI que está en node_modules del builder copiado
  npx prisma migrate deploy
else
  echo "PRISMA_MIGRATE != true, saltando migrate deploy"
fi

# Ejecutar comando principal
exec "$@"

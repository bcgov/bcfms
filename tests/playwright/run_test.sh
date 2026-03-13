set -a
source .env
set +a

npx playwright test $1 --project=firefox
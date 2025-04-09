#!/bin/bash
echo "Enter migration name: "
read -r MIGRATION_NAME
npx ts-node -r tsconfig-paths/register node_modules/typeorm/cli.js migration:generate -d src/common/configs/orm.config.ts "src/migrations/$MIGRATION_NAME"
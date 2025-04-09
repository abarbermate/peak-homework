import { AppDataSource } from '@app/common/configs/orm.config';

export async function runMigrations() {
  if (!AppDataSource.isInitialized) {
    try {
      console.log('Initializing AppDataSource...');
      await AppDataSource.initialize();
      console.log('AppDataSource initialized.');
    } catch (error) {
      console.error('Failed to initialize AppDataSource:', error);
      process.exit(1);
    }
  }

  try {
    const hasPendingMigrations = await AppDataSource.showMigrations();

    if (hasPendingMigrations) {
      console.log('Running pending migrations...');
      await AppDataSource.runMigrations();
      console.log('Migrations completed.');
    } else {
      console.log('No pending migrations.');
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

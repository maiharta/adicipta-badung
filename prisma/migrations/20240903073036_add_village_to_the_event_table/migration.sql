-- AlterTable
ALTER TABLE `events` ADD COLUMN `village_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `villages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

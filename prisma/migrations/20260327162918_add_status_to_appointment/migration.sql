-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'canceled', 'completed');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled';

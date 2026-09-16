-- AlterTable
ALTER TABLE "User" ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Form" ADD COLUMN "notifyOnSubmission" BOOLEAN NOT NULL DEFAULT false;
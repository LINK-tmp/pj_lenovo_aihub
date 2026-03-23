-- AlterTable
ALTER TABLE "use_cases" ADD COLUMN     "coverImage" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organizationDesc" TEXT,
ADD COLUMN     "organizationLogo" TEXT;

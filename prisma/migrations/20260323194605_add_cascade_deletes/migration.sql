-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_useCaseId_fkey";

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_useCaseId_fkey" FOREIGN KEY ("useCaseId") REFERENCES "use_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

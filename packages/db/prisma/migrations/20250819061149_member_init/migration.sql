-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "isCollaborative" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."member" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."member" ADD CONSTRAINT "member_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

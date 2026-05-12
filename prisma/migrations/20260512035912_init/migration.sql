-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTOR', 'MOBIL');

-- CreateEnum
CREATE TYPE "JournalType" AS ENUM ('SYMPTOM', 'MODIFICATION', 'GENERAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "currentMileage" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "annualTaxDate" TIMESTAMP(3),
    "fiveYearTaxDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartInterval" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "intervalKm" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartInterval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartReplacement" (
    "id" TEXT NOT NULL,
    "partIntervalId" TEXT NOT NULL,
    "replacedAtKm" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "receiptImageUrl" TEXT,
    "replacedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartReplacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleJournal" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "JournalType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleJournal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Vehicle_userId_idx" ON "Vehicle"("userId");

-- CreateIndex
CREATE INDEX "PartInterval_vehicleId_idx" ON "PartInterval"("vehicleId");

-- CreateIndex
CREATE INDEX "PartReplacement_partIntervalId_idx" ON "PartReplacement"("partIntervalId");

-- CreateIndex
CREATE INDEX "VehicleJournal_vehicleId_idx" ON "VehicleJournal"("vehicleId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartInterval" ADD CONSTRAINT "PartInterval_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartReplacement" ADD CONSTRAINT "PartReplacement_partIntervalId_fkey" FOREIGN KEY ("partIntervalId") REFERENCES "PartInterval"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleJournal" ADD CONSTRAINT "VehicleJournal_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('private', 'group', 'supergroup', 'channel');

-- CreateEnum
CREATE TYPE "WizardStep" AS ENUM ('IDLE', 'PICK_DAYS', 'PICK_TIME', 'PICK_TEXT', 'CONFIRM');

-- CreateTable
CREATE TABLE "BotAdmin" (
    "userId" BIGINT NOT NULL,
    "username" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotAdmin_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "BotGroup" (
    "id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ChatType" NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleCommand" (
    "id" TEXT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "days" "DayOfWeek"[],
    "timeMinutes" INTEGER NOT NULL,
    "tz" TEXT NOT NULL DEFAULT 'Asia/Almaty',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleCommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatWizardState" (
    "id" TEXT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "step" "WizardStep" NOT NULL DEFAULT 'IDLE',
    "tempDays" "DayOfWeek"[],
    "tempTimeMin" INTEGER,
    "tempMessage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatWizardState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BotGroup_type_idx" ON "BotGroup"("type");

-- CreateIndex
CREATE INDEX "BotGroup_addedAt_idx" ON "BotGroup"("addedAt");

-- CreateIndex
CREATE INDEX "ScheduleCommand_chatId_enabled_idx" ON "ScheduleCommand"("chatId", "enabled");

-- CreateIndex
CREATE INDEX "ScheduleCommand_createdBy_idx" ON "ScheduleCommand"("createdBy");

-- CreateIndex
CREATE INDEX "ScheduleCommand_tz_idx" ON "ScheduleCommand"("tz");

-- CreateIndex
CREATE INDEX "ChatWizardState_step_idx" ON "ChatWizardState"("step");

-- CreateIndex
CREATE UNIQUE INDEX "ChatWizardState_chatId_userId_key" ON "ChatWizardState"("chatId", "userId");

-- AddForeignKey
ALTER TABLE "ScheduleCommand" ADD CONSTRAINT "ScheduleCommand_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "BotGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleCommand" ADD CONSTRAINT "ScheduleCommand_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "BotAdmin"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

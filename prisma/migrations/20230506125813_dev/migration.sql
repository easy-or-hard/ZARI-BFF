-- CreateTable
CREATE TABLE "Zodiac" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "startMonthDay" TEXT NOT NULL,
    "endMonthDay" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zodiac_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" BIGINT NOT NULL,
    "email" TEXT,
    "byeolId" INTEGER,
    "json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Byeol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Byeol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zari" (
    "id" SERIAL NOT NULL,
    "zodiacId" INTEGER NOT NULL,
    "byeolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Zari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banzzack" (
    "id" SERIAL NOT NULL,
    "contents" TEXT NOT NULL,
    "byeolId" INTEGER NOT NULL,
    "byeolName" TEXT NOT NULL,
    "zariId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banzzack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zodiac_symbol_key" ON "Zodiac"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Byeol_name_key" ON "Byeol"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_byeolId_fkey" FOREIGN KEY ("byeolId") REFERENCES "Byeol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zari" ADD CONSTRAINT "Zari_zodiacId_fkey" FOREIGN KEY ("zodiacId") REFERENCES "Zodiac"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zari" ADD CONSTRAINT "Zari_byeolId_fkey" FOREIGN KEY ("byeolId") REFERENCES "Byeol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banzzack" ADD CONSTRAINT "Banzzack_byeolId_fkey" FOREIGN KEY ("byeolId") REFERENCES "Byeol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banzzack" ADD CONSTRAINT "Banzzack_zariId_fkey" FOREIGN KEY ("zariId") REFERENCES "Zari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

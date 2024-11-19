-- CreateTable
CREATE TABLE "currency" (
    "id" SERIAL NOT NULL,
    "rubles" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission" (
    "id" SERIAL NOT NULL,
    "fromEur" DOUBLE PRECISION NOT NULL,
    "fromRub" DOUBLE PRECISION NOT NULL,
    "fromXof" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id")
);

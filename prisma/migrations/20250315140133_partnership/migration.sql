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

-- CreateTable
CREATE TABLE "commissionPartnership" (
    "id" SERIAL NOT NULL,
    "fromEurPartnership" DOUBLE PRECISION NOT NULL,
    "fromRubPartnership" DOUBLE PRECISION NOT NULL,
    "fromXofPartnership" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "commissionPartnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rate" (
    "id" SERIAL NOT NULL,
    "fromEur" DOUBLE PRECISION NOT NULL,
    "fromRub" DOUBLE PRECISION NOT NULL,
    "fromXof" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "exchange_rate_pkey" PRIMARY KEY ("id")
);

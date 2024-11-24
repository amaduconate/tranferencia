-- CreateTable
CREATE TABLE "exchange_rate" (
    "id" SERIAL NOT NULL,
    "eur" DOUBLE PRECISION NOT NULL,
    "fromRub" DOUBLE PRECISION NOT NULL,
    "fromXof" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "exchange_rate_pkey" PRIMARY KEY ("id")
);

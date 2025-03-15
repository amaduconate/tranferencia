-- CreateTable
CREATE TABLE "currency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rubles" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "commission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromEur" REAL NOT NULL,
    "fromRub" REAL NOT NULL,
    "fromXof" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "exchange_rate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromEur" REAL NOT NULL,
    "fromRub" REAL NOT NULL,
    "fromXof" REAL NOT NULL
);

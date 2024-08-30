-- CreateTable
CREATE TABLE "subscriptions" (
    "subscriptionId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "totalnumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("subscriptionId")
);

/**
 * Demo seed — reseller + customer + wallets + contacts.
 * Currently logs SQL-equivalent statements for local dev without a DB.
 * TODO: wire to PrismaClient (User/Wallet/ContactGroup/Contact) when DATABASE_URL is live.
 * Run with: npx ts-node prisma/seed.ts (after `npm install`)
 */
async function main(): Promise<void> {
  const stmts = [
    `INSERT INTO "User" (id, email, role, "ownerId") VALUES ('u_admin','admin@local.dev','super_admin',NULL);`,
    `INSERT INTO "User" (id, email, role, "ownerId") VALUES ('u_reseller','reseller@local.dev','reseller','u_admin');`,
    `INSERT INTO "User" (id, email, role, "ownerId") VALUES ('u_customer','customer@local.dev','customer','u_reseller');`,
    `INSERT INTO "Wallet" ("userId", "balanceCredits") VALUES ('u_reseller', 5000);`,
    `INSERT INTO "Wallet" ("userId", "balanceCredits") VALUES ('u_customer', 1000);`,
    `INSERT INTO "ContactGroup" (id, "ownerId", name) VALUES ('g_demo','u_customer','Demo group');`,
    `INSERT INTO "Contact" (id, "groupId", mobile, name) VALUES ('c_1','g_demo','9999999999','Demo One');`,
    `INSERT INTO "Contact" (id, "groupId", mobile, name) VALUES ('c_2','g_demo','8888888888','Demo Two');`,
    // NOTE: No dlt_* inserts by design (DLT_DISABLED).
  ];
  for (const s of stmts) {
    // eslint-disable-next-line no-console
    console.log(s);
  }
  // TODO: replace console.log block with:
  //   const { PrismaClient } = await import('@prisma/client');
  //   const prisma = new PrismaClient();
  //   ...upserts...
  //   await prisma.$disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

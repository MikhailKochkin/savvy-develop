# Migration `20201222123423-m`

This migration has been generated by MikhailKochkin at 12/22/2020, 3:34:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "UserLevel" ADD COLUMN     "userId" TEXT
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201218105852..20201222123423-m
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Application {
   id            String     @id @default(cuid())
@@ -603,8 +603,9 @@
   id        String   @id @default(cuid())
   level     Float?   @default(1)
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
+  userId    String?
   user      User?
 }
 enum CheckType {
```



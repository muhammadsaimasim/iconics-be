# Rolling out the security fixes

Do the steps in order. Steps 1 and 2 close the two worst holes (public PII and a
forgeable admin token) and can't wait for the rest.

## 0. Before deploying: check whether data already leaked (C1)

On the server:

```sh
sudo zgrep -hE 'GET /api/register/(workshop|participant|paper)' /var/log/nginx/access.log* | awk '{print $1}' | sort | uniq -c | sort -rn
```

Any hits from IPs that aren't your own mean registrant data (names, CNICs,
contacts, document links) was probably harvested. Tell NED IT / the organisers and
treat it as a data-breach incident. Step 6 cuts off the old document links.

Also check for forged admin tokens. Until now, an unset `JWT_SECRET` fell back to a
public default string. If production never set one, anyone could have minted an
admin token. Admin actions weren't logged, so review speakers/committee/settings
content for anything you didn't change.

## 1. Server environment (`iconics-be/.env` on the server)

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

- `JWT_SECRET=<that value>` is required. The server refuses to start without it.
- `NODE_ENV=production`
- `HOST=127.0.0.1`
- `ADMIN_SECRET` is no longer used. Delete it.
- Optional: `SUPABASE_PUBLIC_BUCKET=public-assets`, `SUPABASE_PRIVATE_BUCKET=registerations`

## 2. Deploy backend and frontend together

The admin login changed from a shared secret to email + password, so deploy both
repos at the same time.

```sh
cd iconics-be
npm ci
npx prisma migrate deploy        # creates the admins table + enables RLS on all tables
node scripts/create-admin.js you@neduet.edu.pk "Your Name"     # once per admin
pm2 restart <app>                # or however the process is managed
```

`create-admin.js` also resets passwords (`ADMIN_PASSWORD=... node scripts/create-admin.js ...`)
and disables accounts (`--disable <email>`). Give every admin their own account.

## 3. Close port 5000 (C2)

The app now listens on 127.0.0.1 only. Also close the port at the firewall:

```sh
sudo ufw deny 5000
```

Ask NED IT to block it on any upstream / cloud firewall too.
Verify from outside: `curl -m 5 http://iconics.neduet.edu.pk:5000/api/health` must time out or be refused.

## 4. nginx (H1, H5)

Merge `deploy/nginx-iconics.conf` into the site config, then
`sudo nginx -t && sudo systemctl reload nginx`.

## 5. Supabase: verify RLS (C3)

The migration in step 2 enables RLS. Confirm in the Supabase SQL editor:

```sql
select c.relname, c.relrowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r';
```

Every row must show `true`. Then check that the anon key really is locked out:

```sh
curl "https://<project>.supabase.co/rest/v1/participant_registrations?select=id&limit=1" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
```

The response must be an empty array or a permission error, never data.

## 6. Make registrant documents private (C3)

After the new backend is live:

```sh
node scripts/migrate-private-storage.js            # dry run: shows what it would change
node scripts/migrate-private-storage.js --apply    # copies site images to public bucket, rewrites DB rows
# check the public site: speaker, reviewer and workshop images still load
node scripts/migrate-private-storage.js --make-private
```

After this, every old public document URL stops working. Admins open documents
from the Registrations page, which issues 5-minute signed links.

## 7. Rotate keys (M7)

The service-role key bypasses all Supabase security. It now sits only in the
server `.env`. If it was ever committed, pasted in chat, or shared beyond the
server, rotate it (Supabase → Settings → API → JWT secret / roll keys) and
update the server `.env`. Also remove the old project's keys that are commented
out in `.env`.

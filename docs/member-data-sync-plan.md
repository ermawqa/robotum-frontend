# RoboTUM member data — single source of truth

**Status:** proposal, not yet started
**Owner:** _unassigned_
**Last updated:** 2026-08-15

---

## 1. The actual problem

We have five systems that each hold member data, and each one is authoritative for
something:

| System | Currently trusted for |
|---|---|
| Slack | who is actually active this semester |
| Notion | robotum emails, project/user groups, Junior/Senior, Notion permissions |
| Google Workspace | `@robotum.info` accounts, Google Groups, calendars |
| Airtable | detailed onboarding answers collected at acceptance |
| Supabase | what gets published on the website |

The problem is **not** that we have five tools. It is that **no field has a defined
owner**. When someone joins, switches project, or leaves, there is no single place
that change enters the system, so it gets applied to two or three tools and forgotten
in the rest. Everything drifts, and Slack ends up "most reliable" only because it's
the one nobody can avoid touching.

Adding a sixth tool will not fix this. Defining ownership will.

---

## 2. Principle: one owner per *field*, not per platform

Supabase becomes the **registry**. Every other system is either an **intake**
(data flows in, once) or a **projection** (data flows out, repeatedly).

```
                 ┌──────────────┐
   Airtable ────▶│              │────▶ Google Workspace   (accounts + groups)
   (intake:      │   SUPABASE   │────▶ Notion             (properties)
    onboarding)  │  (registry)  │────▶ Slack              (channel invites)
                 │              │────▶ robotum.info       (public website)
                 └──────────────┘
```

Slack stops being the source of truth for "who is active" and becomes evidence we
reconcile against. That is a demotion on purpose.

### Field ownership

| Field | Owner | Everyone else |
|---|---|---|
| Identity (name, robotum email, personal email) | Supabase | mirrors |
| Membership status (active / on-leave / alumni) + semester | Supabase | mirrors |
| Project / department assignment | Supabase | mirrors |
| Junior / Senior | Supabase | Notion mirrors as a property |
| Onboarding answers | Airtable → copied into Supabase **once** at acceptance | — |
| Website display (photo, story, LinkedIn) | Supabase | — |

---

## 3. Constraints that shape everything below

**These need verifying against our actual plan tiers before Phase 2 is scoped.**
They are the difference between "we automate it" and "we generate a task for a human".

| System | What we can automate | What we cannot |
|---|---|---|
| **Google Workspace** | Create/suspend accounts, add/remove group members. Admin SDK Directory API works on every Workspace edition. Needs a service account with domain-wide delegation impersonating a super-admin. | — (this one is clean) |
| **Slack** | Read the roster (`users.list`, `users.lookupByEmail`), invite/remove from **channels** | **Deactivating a member** needs SCIM → Business+/Enterprise Grid. User groups need a paid tier. On Free/Pro, offboarding stays manual. |
| **Notion** | Create/update database rows and properties (incl. Junior/Senior) | **Teamspace/group permissions** — no public API outside Enterprise. Permission changes stay manual. |
| **Airtable** | Full REST API on all plans (≈5 req/sec per base) | — |

**Consequence:** full end-to-end automation is not achievable on standard plans.
The realistic target is *automated where the API allows, and a reviewed task list
for the rest*. That is still a massive improvement over the status quo, and it is
why Phase 1 below is a drift report rather than a sync engine.

> **Action:** confirm our Slack plan tier and Notion plan tier before scoping Phase 3.
> If Slack is Free/Pro, plan for manual deactivation permanently.

---

## 4. Phases

### Phase 0 — Decide and verify _(days, no code)_

- [ ] Name an owner for this project
- [ ] Confirm Slack plan tier and Notion plan tier (see §3)
- [ ] Confirm who has Google Workspace super-admin (needed for the service account)
- [ ] Agree the status vocabulary: `applicant | active | on_leave | alumni`
- [ ] Decide whether Airtable stays as the intake form or gets retired in Phase 4

**Exit:** the table in §3 has no unknowns.

---

### Phase 1 — Read-only drift report _(≈1 weekend, zero risk)_

A scheduled job pulls all five systems, matches people on email, writes nothing,
and outputs a diff:

- in Slack, not in Notion
- active `@robotum.info` account, but marked alumni
- Notion says Project A, Google Group says Project B
- accepted in Airtable, never provisioned anywhere
- on the website, but not an active member

**Why this is first:** it solves most of the day-to-day pain immediately, it cannot
break anything because it has no write path, and — critically — **it produces the
identity mapping that every later phase depends on**. Skipping it means Phase 2
has to guess at matching people by name, which is exactly how these systems drifted
apart in the first place.

**Deliverable:** a script + a rendered report. Not yet wired into the website.

**Exit:** the report runs clean and a human agrees its findings are real.

---

### Phase 2 — Supabase becomes the registry _(≈1 week)_

Extend the member model (see §5) and backfill the external ID map from the Phase 1
matching. Move the drift report to run on a schedule and surface it in `/admin` as a
list of pending actions with "mark done".

At this point nothing is automated yet, but there is **one place** that says what is
true, and a visible list of where reality disagrees.

**Exit:** every current member exists in Supabase with correct status, project, and
at least one external ID mapped.

---

### Phase 3 — One-directional writes, one spoke at a time _(≈1 week per spoke)_

Model three lifecycle events — `join`, `change_project`, `leave` — as rows in a
`member_events` table. A worker consumes them and fans out. Order matters:

1. **Google Workspace** — highest value, cleanest API, fully automatable
2. **Notion** — properties only; permission changes emit a human task
3. **Slack** — channel invites; deactivation emits a human task (see §3)

Anything the API cannot do becomes an item in the drift report rather than a silent
failure.

**Exit:** onboarding one person requires exactly one action in Supabase.

---

### Phase 4 — Retire the intake duplication _(optional)_

Either move the onboarding form to Supabase, or keep Airtable as intake-only and
drop it from the reconciliation loop.

---

## 5. Data model

```sql
-- lifecycle
status              member_status  -- 'applicant'|'active'|'on_leave'|'alumni'
seniority           text           -- 'junior'|'senior'
active_semester     text           -- 'WS25/26'

-- the join key
robotum_email       text unique
personal_email      text           -- people apply before they have a robotum address

-- external identity map — the thing that makes sync possible
slack_user_id       text
notion_page_id      text
airtable_record_id  text
google_suspended    boolean
```

**The external ID map is the whole trick.** Re-matching on names or fuzzy emails on
every run is not sync, it's a guess that gets worse over time. Store the IDs once
(Phase 1 produces them) and never match on a human-readable field again.

Note we already have `members_personal`, `member_memberships`, `member_projects`,
`departments`, and `projects` in Supabase — this extends that, it does not replace it.

---

## 6. Privacy — do not skip this

Our Supabase is **public-read via RLS** because the website reads from it anonymously.
Airtable onboarding answers and personal emails are PII, and we operate under GDPR
at TUM.

**Rule: member PII never lands in the `public` schema.**

- Put the registry in a separate `internal` schema with **no `anon` grants**
- Expose only what the website needs, through a narrow view:

```sql
create view public.members_public as
  select id, full_name, avatar_url, linkedin_url, story
  from internal.members
  where status = 'active' and show_on_website;
```

`fetchTeamMembers` / `fetchMemberStories` in `src/data/membersApi.js` then point at
views instead of base tables. Small code change, and it makes the sync data
*structurally* unable to leak rather than relying on us remembering.

---

## 7. The semester ritual (process, not code)

None of the above survives contact with a student club unless there is a recurring
moment where the registry is re-confirmed. Every semester start:

1. Everyone confirms they're returning (status → `active` or `alumni`)
2. Project leads confirm their roster
3. The drift report is run and driven to zero
4. Only then do accounts get provisioned for new members

The tooling makes this cheap. It does not make it optional.

---

## 8. Where it runs

Supabase Edge Functions + `pg_cron` — secrets live in one place and we already pay
for it. A nightly reconcile plus event-driven fan-out is plenty; nothing here needs
sub-minute consistency.

For Phase 1 specifically, write it as a **standalone Node script in this repo first**.
It is far easier to iterate on and inspect than an Edge Function, and it can be
promoted once the logic is stable.

---

## 9. Explicitly out of scope

- Bidirectional sync. Five systems × two directions is twenty sync paths and any
  conflict corrupts all of them. Every arrow in §2 points one way.
- Real-time sync. Nightly is fine.
- Syncing every field. Only the ones that must agree: identity, status, project,
  seniority.
- Replacing Notion or Slack. They stay; they just stop being sources of truth.

---

## 10. Open decisions

| # | Decision | Needed by |
|---|---|---|
| 1 | Who owns this project? | Phase 0 |
| 2 | Slack + Notion plan tiers — do we upgrade, or accept manual offboarding? | Phase 0 |
| 3 | Is `@robotum.info` email the primary key, or do we need a surrogate for pre-account applicants? | Phase 2 |
| 4 | Does Airtable survive Phase 4? | Phase 4 |

---

## Next step

Phase 1. Get read access to Google Workspace and Slack, and the drift report can be
written and running against real data without touching a single system's state.

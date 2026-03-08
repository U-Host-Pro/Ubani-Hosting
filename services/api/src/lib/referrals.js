import { newId, nowIso } from "./db.js";
import { runQuery } from "./turso.js";

export async function rewardReferral({ env, referrerId, referredUserId }) {
  const rewardCents = Number(env.REFERRAL_REWARD_CENTS || 5000);
  const now = nowIso();

  await runQuery(
    env,
    `INSERT INTO referrals (id, referrer_id, referred_user_id, reward_cents, status, created_at)
     VALUES (?, ?, ?, ?, 'granted', ?)`,
    [newId("ref"), referrerId, referredUserId, rewardCents, now]
  );

  await runQuery(env, "UPDATE users SET credit = credit + ?, updated_at = ? WHERE id = ?", [
    rewardCents,
    now,
    referrerId
  ]);

  return { rewardCents };
}

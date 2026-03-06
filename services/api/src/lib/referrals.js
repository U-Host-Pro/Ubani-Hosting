import { newId, nowIso } from "./db.js";

export async function rewardReferral({ env, referrerId, referredUserId }) {
  const rewardCents = Number(env.REFERRAL_REWARD_CENTS || 5000);
  const now = nowIso();

  await env.DB.prepare(
    `INSERT INTO referrals (id, referrer_id, referred_user_id, reward_cents, status, created_at)
     VALUES (?1, ?2, ?3, ?4, 'granted', ?5)`
  )
    .bind(newId("ref"), referrerId, referredUserId, rewardCents, now)
    .run();

  await env.DB.prepare("UPDATE users SET credit = credit + ?1, updated_at = ?2 WHERE id = ?3")
    .bind(rewardCents, now, referrerId)
    .run();

  return { rewardCents };
}

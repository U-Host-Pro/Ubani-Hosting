export async function rewardReferral(referrerId, db, rewardCents = 5000) {
  await db.prepare("UPDATE users SET credit = credit + ?1 WHERE id = ?2").bind(rewardCents, referrerId).run();
}

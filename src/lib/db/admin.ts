import { createClient } from '../supabase/server';
import { getDbPool } from './pool';

export async function isCurrentUserOwner(): Promise<boolean> {
  try {
    const supabase = await createClient();

    // শুধু getUser() যথেষ্ট — এটি অটোমেটিক সেশন চেক করে
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.log('No authenticated user:', error?.message);
      return false;
    }

    const userId = data.user.id;

    // ডাটাবেসে চেক করুন ইউজারটি admin কিনা
    const { rows } = await getDbPool().query<{ is_owner: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM public.admin_users WHERE user_id = $1
       ) AS is_owner`,
      [userId]
    );

    return rows[0]?.is_owner === true;
  } catch (err) {
    console.error('isCurrentUserOwner error:', err);
    return false;
  }
}

import { getSupabase } from './supabase'
import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type MatchWithProfiles = Database['public']['Views']['matches_with_profiles']['Row']

export async function getDiscoverProfiles(userId: string): Promise<Profile[]> {
  const supabase = getSupabase()

  // Get IDs already swiped
  const { data: swiped } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', userId)

  const swipedIds = (swiped ?? []).map((s) => s.swiped_id)
  const excludeIds = [userId, ...swipedIds]

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .limit(20)

  return data ?? []
}

export async function getMatches(userId: string): Promise<MatchWithProfiles[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('matches_with_profiles')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  return data ?? []
}

export async function findMatchId(userId: string, otherId: string): Promise<string | null> {
  const supabase = getSupabase()
  const u1 = userId < otherId ? userId : otherId
  const u2 = userId < otherId ? otherId : userId

  const { data } = await supabase
    .from('matches')
    .select('id')
    .eq('user1_id', u1)
    .eq('user2_id', u2)
    .single()

  return data?.id ?? null
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
    .limit(100)

  return data ?? []
}

export async function sendMessage(matchId: string, senderId: string, text: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('messages')
    .insert({ match_id: matchId, sender_id: senderId, text })
    .select()
    .single()

  return { data, error }
}

export async function getMyProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = getSupabase()
  return supabase.from('profiles').update(updates).eq('id', userId)
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const supabase = getSupabase()

  // Convert non-web-safe formats (HEIC, HEIF, TIFF, BMP) to JPEG via canvas
  const needsConvert = /\.(heic|heif|tiff?|bmp)$/i.test(file.name)
  let uploadFile = file
  let path = `${userId}/avatar.jpg`

  if (needsConvert) {
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0)
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.92))
      if (blob) uploadFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    } catch {
      // createImageBitmap may not support HEIC on some browsers — proceed with original
      path = `${userId}/avatar.${file.name.split('.').pop()}`
      uploadFile = file
    }
  } else {
    const ext = file.name.split('.').pop() ?? 'jpg'
    path = `${userId}/avatar.${ext}`
  }

  const { error } = await supabase.storage.from('avatars').upload(path, uploadFile, { upsert: true, contentType: uploadFile.type || 'image/jpeg' })
  if (error) return null

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

export function subscribeToMessages(matchId: string, onMessage: (msg: Message) => void) {
  const supabase = getSupabase()
  return supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe()
}

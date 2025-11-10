import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch all destinations
export async function GET(request: NextRequest) {
  try {
    const { data: destinations, error } = await supabaseAdmin
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, destinations })
  } catch (error: any) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new destination
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, theme, region, country, description, image_url, is_active } = body

    const { data: destination, error } = await supabaseAdmin
      .from('destinations')
      .insert({
        name,
        theme,
        region,
        country: country || 'France',
        description,
        image_url,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, destination })
  } catch (error: any) {
    console.error('Error creating destination:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update destination
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data: destination, error } = await supabaseAdmin
      .from('destinations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, destination })
  } catch (error: any) {
    console.error('Error updating destination:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete destination
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Destination ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('destinations')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting destination:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

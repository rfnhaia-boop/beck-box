import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { productId } = await request.json();

        // 1. Initialize Supabase Admin (using service role key for secure access)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Check if user is authenticated (simplified for now)
        // In a real app, you'd check a session or a purchase record

        // 3. Fetch product path from DB
        const { data: product, error: dbError } = await supabase
            .from('products')
            .select('file_path')
            .eq('id', productId)
            .single();

        if (dbError || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // 4. Create Signed URL that expires in 60 seconds
        const { data, error: storageError } = await supabase
            .storage
            .from('packs')
            .createSignedUrl(product.file_path, 60);

        if (storageError) {
            return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 });
        }

        return NextResponse.json({ url: data.signedUrl });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const resolvedParams = await params;
    const slugPath = resolvedParams.slug.join('/');
    const backendUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000';
    const targetUrl = `${backendUrl}/api/${slugPath}`;
    
    console.log(`[Next.js Proxy] Forwarding ${req.method} request to ${targetUrl}`);
    
    const options: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('authorization') || '',
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.text(); // Use text to avoid JSON parse errors if body is empty
      if (body) {
        options.body = body;
      }
    }
    
    const res = await fetch(targetUrl, options);
    
    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
    
    console.log(`[Next.js Proxy] Backend returned status: ${res.status}`);
    
    // If the backend returned an error, don't throw, just return it so Axios gets the correct status
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`[Next.js Proxy] Error forwarding request:`, error);
    return NextResponse.json(
      { error: `Failed to proxy request to backend. Make sure the backend is running. Details: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;

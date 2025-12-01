export const config = {
  matcher: '/images/:path*',
};

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Extract day number from /images/X.png
  const match = pathname.match(/\/images\/(\d+)\.png/);
  if (!match) {
    return new Response('Not found', { status: 404 });
  }
  
  const dayNum = parseInt(match[1], 10);
  
  // Validate day number
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 24) {
    return new Response('Invalid day', { status: 404 });
  }
  
  // Check if the day is allowed
  // Use UTC time since server might be in different timezone
  const now = new Date();
  const utcDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  
  // For Finnish timezone (UTC+2), we need to add the offset
  const finnishDate = new Date(utcDate.getTime() + 2 * 60 * 60 * 1000);
  
  const currentMonth = finnishDate.getMonth(); // 0-11, December = 11
  const currentDay = finnishDate.getDate();
  
  // Only allow if it's December and the requested day <= current day
  if (currentMonth !== 11 || dayNum > currentDay) {
    // Redirect naughty glitchers to the 404 page 🎅
    return Response.redirect(new URL('/404.html', request.url), 302);
  }
  
  // Allow the request to continue to the actual image
  return;
}
